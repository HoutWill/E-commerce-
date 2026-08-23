import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit, { Options } from 'express-rate-limit';

/**
 * Robust Client IP Resolver
 * Accurately extracts the client IP address considering reverse proxies,
 * Cloudflare (CF-Connecting-IP), Ngrok, and standard X-Forwarded-For chains.
 */
export function getClientIp(req: Request): string {
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp.trim()) {
    return cfIp.trim();
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

/**
 * Standardized Rate Limit JSON Error Handler
 */
function createRateLimitHandler(limitName: string, windowMinutes: number) {
  return (req: Request, res: Response, _next: NextFunction, options: Options) => {
    const retryAfter = res.getHeader('Retry-After') || `${windowMinutes * 60}`;
    const ip = getClientIp(req);

    console.warn(`⚠️ [Security Alert] IP Rate Limit Exceeded: [${limitName}] from IP: ${ip} on path: ${req.originalUrl}`);

    res.status(options.statusCode).json({
      success: false,
      error: `Security Alert: Rate limit reached for ${limitName}. Please slow down your requests.`,
      rateLimitType: limitName,
      statusCode: options.statusCode,
      retryAfterSeconds: Number(retryAfter) || windowMinutes * 60,
      clientIp: ip,
      timestamp: new Date().toISOString()
    });
  };
}

/**
 * 1. Tier 1: Global DDoS & Flood Shield
 * Protects the entire server against high-frequency HTTP flooding & bot swarms.
 * Limit: 300 requests per 1 minute per IP.
 */
export const globalDDoSProtection = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  handler: createRateLimitHandler('Global DDoS Shield', 1),
  skip: (req) => {
    // Skip internal health probes if requested locally
    return req.path === '/api/health' && (req.ip === '127.0.0.1' || req.ip === '::1');
  }
});

/**
 * 2. Tier 2: General API Rate Limiter
 * Applies to all standard API endpoints (/api/*).
 * Limit: 100 requests per minute per IP.
 */
export const generalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  handler: createRateLimitHandler('API Endpoint Protection', 1)
});

/**
 * 3. Tier 3: Scraper & AI Vision Heavy-Load Limiter
 * Heavy Playwright crawling and Gemini/OCR vision operations consume significant CPU/memory.
 * Limit: 10 requests per 5 minutes per IP.
 */
export const scraperHeavyLoadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  handler: createRateLimitHandler('Heavy Scraper & AI Vision Operations', 5)
});

/**
 * 4. Tier 4: Admin Mutation Rate Limiter
 * Applies to product creation, updates, and deletion.
 * Limit: 60 mutations per minute per IP.
 */
export const adminMutationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 mutations per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  handler: createRateLimitHandler('Catalog Modification Gateway', 1)
});

/**
 * 5. Helmet HTTP Security Headers Configuration
 * Hardens headers against Clickjacking, MIME-type sniffing, XSS, and stack fingerprinting.
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Set to false to allow embedded map frames, external TikTok CDNs, and Google Fonts
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin image loads
  xFrameOptions: { action: 'sameorigin' },
  xContentTypeOptions: true,
  xXssProtection: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hidePoweredBy: true
});

/**
 * 6. Request Sanitization & Prototype Pollution Defense
 * Scrubs malicious keys from JSON bodies and query parameters.
 */
export function requestSanitizer(req: Request, _res: Response, next: NextFunction) {
  const sanitizeObject = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;

    for (const key of Object.keys(obj)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        delete obj[key];
        continue;
      }
      if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
}

import multer from 'multer';

/**
 * 7. Secure File Upload Validator (MIME-Type & Extension Check)
 */
export function validateImageUpload(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  const fileExt = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Security Error: Invalid file type. Only genuine JPEG, PNG, WEBP, and GIF images are permitted.'));
  }
}
