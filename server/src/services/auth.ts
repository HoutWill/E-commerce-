import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface LoginAttempt {
  count: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
  lockedUntil: number | null;
}

interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
}

// In-memory security rate-limit storage
const ipAttempts = new Map<string, LoginAttempt>();
const activeSessions = new Map<string, AdminSession>();

// Security configuration
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const WINDOW_DURATION_MS = 15 * 60 * 1000;  // 15 minutes
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

// Generic error response to prevent user/email enumeration or password revelation
const GENERIC_AUTH_ERROR = 'Invalid credentials. Please verify your email and password.';

// Admin credentials (from environment or default secure vault)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';

// Helper to get client IP
export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Clean up expired lockout entries and sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, attempt] of ipAttempts.entries()) {
    if (attempt.lockedUntil && attempt.lockedUntil < now) {
      ipAttempts.delete(ip);
    } else if (now - attempt.firstAttemptAt > WINDOW_DURATION_MS && !attempt.lockedUntil) {
      ipAttempts.delete(ip);
    }
  }

  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}, 60 * 1000);

export class AuthService {
  /**
   * Check if an IP is currently locked out
   */
  static checkRateLimit(ip: string): { isLocked: boolean; remainingSeconds: number; remainingAttempts: number } {
    const attempt = ipAttempts.get(ip);
    const now = Date.now();

    if (!attempt) {
      return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
    }

    // Check if lockout has expired
    if (attempt.lockedUntil) {
      if (now < attempt.lockedUntil) {
        const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
        return { isLocked: true, remainingSeconds, remainingAttempts: 0 };
      } else {
        // Lockout expired, reset attempts
        ipAttempts.delete(ip);
        return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
      }
    }

    // Reset window if elapsed
    if (now - attempt.firstAttemptAt > WINDOW_DURATION_MS) {
      ipAttempts.delete(ip);
      return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
    }

    const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - attempt.count);
    return { isLocked: false, remainingSeconds: 0, remainingAttempts };
  }

  /**
   * Register a failed login attempt for an IP
   */
  static recordFailedAttempt(ip: string): { isLocked: boolean; remainingSeconds: number; remainingAttempts: number } {
    const now = Date.now();
    let attempt = ipAttempts.get(ip);

    if (!attempt || (now - attempt.firstAttemptAt > WINDOW_DURATION_MS && !attempt.lockedUntil)) {
      attempt = {
        count: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
        lockedUntil: null
      };
      ipAttempts.set(ip, attempt);
      return { isLocked: false, remainingSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
    }

    attempt.count += 1;
    attempt.lastAttemptAt = now;

    if (attempt.count >= MAX_FAILED_ATTEMPTS) {
      attempt.lockedUntil = now + LOCKOUT_DURATION_MS;
      const remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
      return { isLocked: true, remainingSeconds, remainingAttempts: 0 };
    }

    const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - attempt.count);
    return { isLocked: false, remainingSeconds: 0, remainingAttempts };
  }

  /**
   * Clear failed attempts on successful login
   */
  static clearFailedAttempts(ip: string) {
    ipAttempts.delete(ip);
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  static safeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Fake compare to preserve timing consistency
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  }

  /**
   * Perform authentication with anti-enumeration and timing normalization
   */
  static async login(req: Request, res: Response) {
    const ip = getClientIp(req);
    const rateLimit = AuthService.checkRateLimit(ip);

    if (rateLimit.isLocked) {
      return res.status(429).json({
        success: false,
        error: `Too many login attempts. IP temporarily restricted. Try again in ${rateLimit.remainingSeconds} seconds.`,
        remainingSeconds: rateLimit.remainingSeconds,
        isLocked: true
      });
    }

    const { email, password } = req.body || {};

    // Artificially enforce minimum 400ms delay to deter high-speed brute force and timing analysis
    const start = Date.now();

    const normalizedEmail = (typeof email === 'string' ? email : '').toLowerCase().trim();
    const providedPassword = typeof password === 'string' ? password : '';

    const isEmailValid = AuthService.safeCompare(normalizedEmail, ADMIN_EMAIL);
    const isPasswordValid = AuthService.safeCompare(providedPassword, ADMIN_PASSWORD);

    const elapsed = Date.now() - start;
    if (elapsed < 400) {
      await new Promise(resolve => setTimeout(resolve, 400 - elapsed));
    }

    if (!isEmailValid || !isPasswordValid) {
      const updatedLimit = AuthService.recordFailedAttempt(ip);

      if (updatedLimit.isLocked) {
        return res.status(429).json({
          success: false,
          error: `Security Alert: 5 consecutive failed attempts. IP address restricted for 15 minutes.`,
          remainingSeconds: updatedLimit.remainingSeconds,
          isLocked: true
        });
      }

      return res.status(401).json({
        success: false,
        error: GENERIC_AUTH_ERROR,
        remainingAttempts: updatedLimit.remainingAttempts,
        isLocked: false
      });
    }

    // Authentication Success: Clear rate limits & Issue secure token
    AuthService.clearFailedAttempts(ip);

    const token = `cb_adm_${crypto.randomBytes(32).toString('hex')}`;
    const session: AdminSession = {
      token,
      email: ADMIN_EMAIL,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS,
      ip
    };

    activeSessions.set(token, session);

    return res.json({
      success: true,
      token,
      admin: {
        email: ADMIN_EMAIL,
        role: 'SUPER_ADMIN',
        expiresAt: session.expiresAt
      }
    });
  }

  /**
   * Verify an active token
   */
  static verify(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token as string);

    if (!token) {
      return res.status(401).json({ success: false, authenticated: false });
    }

    const session = activeSessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({ success: false, authenticated: false });
    }

    return res.json({
      success: true,
      authenticated: true,
      admin: {
        email: session.email,
        role: 'SUPER_ADMIN',
        expiresAt: session.expiresAt
      }
    });
  }

  /**
   * Logout and destroy session token
   */
  static logout(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.body?.token as string);

    if (token && activeSessions.has(token)) {
      activeSessions.delete(token);
    }

    return res.json({ success: true, message: 'Logged out successfully' });
  }

  /**
   * Express middleware to protect sensitive admin routes
   */
  static requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.query.token as string);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    }

    const session = activeSessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    }

    next();
  }
}
