# ✨ Classy Bling - TikTok Scraper, AI Vision Extractor & Web Catalog

An automated TikTok bot and Multimodal AI pipeline built for **@classy.bling**. The bot monitors/crawls TikTok videos, detects the standard product showcase angle, extracts product names, prices ($), stock availability, and categories with Gemini AI, auto-crops clean product photos, and serves a modern luxury boutique catalog website.

---

## 🌟 Key Features

1. **🎯 Smart Angle & Format Detection**
   - Inspects video frames and checks for standard product showcase format (hand holding box + overlay with Title, Price, Instock).
   - **Intelligently skips** any video that does not match this angle or lacks product details.

2. **🧠 Gemini Multimodal Vision AI**
   - Reads the TikTok frame overlay:
     - **Product Title**: (e.g. `Nommi Pinky Energy`, `Labubu Fall in Wild`)
     - **Price**: (e.g. `$14`)
     - **Stock Status**: `In Stock` / `Pre-order` / `Out of Stock`
     - **Brand & Series**: (e.g. `Pop Mart`, `Nommi`, `Baby Three`, `Skullpanda`, `Crybaby`)
     - **Category & Tags**: Automatic classification (e.g. `Plush Dolls`, `Blind Box`, `Vinyl Figures`)
     - **Bounding Box**: Detects normalized box coordinates `[ymin, xmin, ymax, xmax]`.

3. **✂️ Automatic AI Studio Cropper**
   - Uses `sharp` with the AI bounding box to cleanly crop out the product box packaging without background clutter.
   - Dual-view toggle on the website: switch anytime between the **Clean Studio Crop** and the **Original TikTok Video Screenshot**.

4. **🛍️ Interactive Web Storefront & Bot Studio**
   - Search by name, brand, category, or price.
   - Filter by `In Stock Only` and sort by price or newest.
   - **Direct Telegram Order**: 1-click button opening chat with Telegram `092917831` with pre-filled product details.
   - **Bot Control Center**: Run automated profile crawl on `@classy.bling`, process single TikTok URLs, or drop screenshots for instant OCR.
   - **Export**: 1-click export to `products.json` or `products.csv`.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# At project root
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure Environment (Optional for live Gemini API)
Edit `server/.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
TIKTOK_TARGET_HANDLE=classy.bling
TELEGRAM_CONTACT=092917831
FB_PAGE=Classy Bling
```

### 3. Run Development Servers
```bash
npm run dev
```
- **Web Storefront & Bot Studio UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

### 4. Run Standalone CLI Scraper
```bash
# Scrape @classy.bling profile for up to 20 videos
npm run scrape

# Or specify custom handle and limit
npm --prefix server run scrape -- classy.bling 30
```

---

## 📁 Project Structure

```
Classybling/
├── client/                     # Vite + React + Tailwind storefront & dashboard
│   ├── src/
│   │   ├── components/         # Navbar, Hero, ProductCard, ProductModal, BotStudioModal
│   │   ├── services/api.ts     # REST API client
│   │   ├── types.ts            # Frontend data types
│   │   ├── App.tsx             # Main catalog page
│   │   └── main.tsx
│   └── vite.config.ts
├── server/                     # Express + Playwright + Gemini AI backend
│   ├── src/
│   │   ├── ai/
│   │   │   └── visionExtractor.ts  # Gemini Multimodal OCR + Angle Verification
│   │   ├── scraper/
│   │   │   └── tiktokScraper.ts    # Headless Playwright TikTok video crawler
│   │   ├── services/
│   │   │   ├── db.ts               # Product JSON database manager
│   │   │   └── imageProcessor.ts   # Sharp bounding box cropper
│   │   ├── scripts/
│   │   │   ├── runScraper.ts       # CLI scraper runner
│   │   │   └── seedSample.ts       # Initial catalog & sample processor
│   │   └── index.ts                # REST API endpoints
│   ├── data/
│   │   └── products.json           # Structured catalog database
│   └── uploads/
│       ├── originals/              # Full TikTok video screenshots
│       └── cropped/                # Clean AI cropped product boxes
└── package.json
```
