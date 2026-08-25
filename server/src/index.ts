import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import http from 'http';
import { db } from './services/db';
import { tiktokScraper } from './scraper/tiktokScraper';
import { imageProcessor } from './services/imageProcessor';
import { AuthService } from './services/auth';
import {
  securityHeaders,
  globalDDoSProtection,
  generalApiLimiter,
  scraperHeavyLoadLimiter,
  adminMutationLimiter,
  requestSanitizer,
  validateImageUpload,
  getClientIp
} from './middleware/security';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable reverse proxy trust for Ngrok, Cloudflare, and Nginx (needed for accurate IP rate limiting)
app.set('trust proxy', 1);

// 1. HTTP Security Headers (Helmet)
app.use(securityHeaders);

// 2. Global DDoS & Flood Protection (300 requests/min per IP)
app.use(globalDDoSProtection);

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or matching origins/tunnels
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.ngrok-free.dev') || origin.endsWith('.ngrok.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev / tunnel mode while preserving origin credentials
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 4. Request Body Size Limits & Payload Sanitization (Defend against payload bomb & prototype pollution)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(requestSanitizer);

// 5. Tier 2 Rate Limiter on all /api endpoints (100 req/min per IP)
app.use('/api', generalApiLimiter);

// 6. Tier 3 Rate Limiter on Scraper endpoints (10 req/5min per IP)
app.use('/api/scrape', scraperHeavyLoadLimiter);

// Static uploads serving with caching headers
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Multer storage for uploaded screenshots / frames with security validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const origDir = path.join(uploadsDir, 'originals');
    if (!fs.existsSync(origDir)) fs.mkdirSync(origDir, { recursive: true });
    cb(null, origDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const cleanExt = ext.replace(/[^a-zA-Z0-9.]/g, '');
    cb(null, `upload_${Date.now()}_${Math.random().toString(36).substring(7)}${cleanExt}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // Max 20MB file upload
  },
  fileFilter: (req, file, cb) => {
    validateImageUpload(file, cb);
  }
});

// ==========================================
// Health & Security Telemetry
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  res.json({
    status: 'ok',
    service: 'Classy Bling Bot & AI Catalog API',
    security: {
      ddosShield: 'active',
      rateLimiting: 'multi-tiered active',
      antiBruteForce: 'active (5 max attempts / 15m lockout)',
      slowlorisProtection: 'active (20s headers timeout)'
    },
    clientIp,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// Admin Security Gate & Authentication Routes
// ==========================================
app.post('/api/admin/login', (req: Request, res: Response) => {
  AuthService.login(req, res);
});

app.get('/api/admin/verify', (req: Request, res: Response) => {
  AuthService.verify(req, res);
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  AuthService.logout(req, res);
});

// ==========================================
// Products API (Public Read / Admin Write)
// ==========================================
app.get('/api/products', (req: Request, res: Response) => {
  let products = db.getAll();
  const { search, category, brand, inStockOnly, sort } = req.query;

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (category && typeof category === 'string' && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase() || (p.subcategory && p.subcategory.toLowerCase() === category.toLowerCase()));
  }

  if (brand && typeof brand === 'string' && brand !== 'All') {
    products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (inStockOnly === 'true') {
    products = products.filter(p => p.stockStatus === 'In Stock');
  }

  if (req.query.minPrice) {
    const min = parseFloat(req.query.minPrice as string);
    if (!isNaN(min)) products = products.filter(p => p.price >= min);
  }

  if (req.query.maxPrice) {
    const max = parseFloat(req.query.maxPrice as string);
    if (!isNaN(max)) products = products.filter(p => p.price <= max);
  }

  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json({
    total: products.length,
    products
  });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const product = db.getById(id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Admin Modifying Endpoints (Protected by Tier 4 Rate Limiting & Admin Auth)
app.post('/api/products', adminMutationLimiter, AuthService.requireAuth, (req: Request, res: Response) => {
  const product = db.add(req.body);
  res.status(201).json(product);
});

app.put('/api/products/:id', adminMutationLimiter, AuthService.requireAuth, (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const updated = db.update(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.delete('/api/products/:id', adminMutationLimiter, AuthService.requireAuth, (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const success = db.delete(id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

// Categories & Brands
app.get('/api/categories', (req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.get('/api/brands', (req: Request, res: Response) => {
  res.json(db.getBrands());
});

// Store Settings Endpoints
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', adminMutationLimiter, AuthService.requireAuth, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// ==========================================
// TikTok Scraper Control Endpoints (Protected)
// ==========================================
app.post('/api/scrape/start', AuthService.requireAuth, async (req: Request, res: Response) => {
  const { handle = 'classy.bling', maxVideos = 20 } = req.body;

  if (tiktokScraper.getStatus().isRunning) {
    return res.status(400).json({ error: 'A scraping job is already in progress' });
  }

  // Trigger asynchronously
  tiktokScraper.scrapeProfile(handle, Number(maxVideos)).catch(err => {
    console.error('Async scraper run error:', err);
  });

  res.json({ message: 'Scraper started successfully', target: handle });
});

app.get('/api/scrape/status', (req: Request, res: Response) => {
  res.json(tiktokScraper.getStatus());
});

// Single Video URL Processing (Protected)
app.post('/api/scrape/single-video', AuthService.requireAuth, async (req: Request, res: Response) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: 'videoUrl is required' });
  }

  try {
    const product = await tiktokScraper.processSingleVideoUrl(videoUrl);
    if (!product) {
      return res.status(422).json({
        success: false,
        message: 'Video did not match the standard product showcase angle (or price overlay was missing).'
      });
    }
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manual Screenshot / Photo Upload & AI Extraction (Protected)
app.post('/api/scrape/upload-frame', AuthService.requireAuth, upload.single('frame'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const videoUrl = req.body.videoUrl || undefined;
    const product = await tiktokScraper.processImageFile(filePath, videoUrl);

    if (!product) {
      return res.status(422).json({
        success: false,
        message: 'Image did not match standard product showcase angle.'
      });
    }

    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Export Data Endpoints
app.get('/api/export/json', (req: Request, res: Response) => {
  const products = db.getAll();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=classybling_products.json');
  res.send(JSON.stringify(products, null, 2));
});

app.get('/api/export/csv', (req: Request, res: Response) => {
  const products = db.getAll();
  const headers = ['ID', 'Name', 'Price', 'Currency', 'Stock Status', 'Brand', 'Series', 'Category', 'Telegram', 'Facebook', 'Cropped Image', 'Original Screenshot', 'Created At'];
  
  const escapeCsv = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;
  
  const rows = products.map(p => [
    escapeCsv(p.id),
    escapeCsv(p.name),
    escapeCsv(p.price),
    escapeCsv(p.currency),
    escapeCsv(p.stockStatus),
    escapeCsv(p.brand),
    escapeCsv(p.series),
    escapeCsv(p.category),
    escapeCsv(p.contactTelegram),
    escapeCsv(p.contactFacebook),
    escapeCsv(p.croppedImageUrl),
    escapeCsv(p.originalScreenshotUrl),
    escapeCsv(p.createdAt)
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=classybling_products.csv');
  res.send(csvContent);
});

// ==========================================
// Start HTTP Server with Slowloris DDoS Defense
// ==========================================
const server = http.createServer(app);

// Slowloris & Slow Connection Timeouts (Kills stalled/hung attacker sockets)
server.headersTimeout = 20000;    // 20s max to receive HTTP headers
server.requestTimeout = 30000;    // 30s max for complete request
server.keepAliveTimeout = 5000;   // 5s keep-alive timeout

server.listen(PORT, () => {
  console.log(`🛡️ Classy Bling Security Armed & Protected API Server running on http://localhost:${PORT}`);
});
