import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { visionExtractor } from '../ai/visionExtractor';
import { imageProcessor } from '../services/imageProcessor';
import { db } from '../services/db';
import { ScrapedProduct } from '../types/product';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Helper to normalize product name for deduplication
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function crawlAll() {
  console.log('\n======================================================');
  console.log('🚀 Classy Bling Full Profile Scraper & Deduplicator');
  console.log('🎯 Target: https://www.tiktok.com/@classy.bling');
  console.log('🛡️ Angle Guard: Skip non-matching videos');
  console.log('🔄 Deduplication: Skip duplicates of existing products');
  console.log('======================================================\n');

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security'
    ]
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
    locale: 'en-US'
  });

  const page = await context.newPage();

  try {
    console.log('🌐 Loading @classy.bling profile...');
    await page.goto('https://www.tiktok.com/@classy.bling', {
      waitUntil: 'domcontentloaded',
      timeout: 45000
    });

    await page.waitForTimeout(4000);

    // Scroll down multiple times to load all video posts
    console.log('📜 Scrolling feed to discover all videos...');
    let prevCount = 0;
    let videoLinks: string[] = [];
    const maxScrolls = 25;

    for (let scroll = 0; scroll < maxScrolls; scroll++) {
      // Extract current video links
      const currentLinks = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a[href*="/video/"]'));
        const hrefs = new Set<string>();
        for (const a of anchors) {
          const href = (a as HTMLAnchorElement).href;
          if (href && href.includes('/video/')) {
            hrefs.add(href.split('?')[0]); // Remove query params
          }
        }
        return Array.from(hrefs);
      });

      console.log(`Scroll ${scroll + 1}/${maxScrolls}: Found ${currentLinks.length} video links so far...`);
      videoLinks = currentLinks;

      if (currentLinks.length === prevCount && scroll > 4) {
        console.log('✨ Reached end of feed or no more new videos loading.');
        break;
      }
      prevCount = currentLinks.length;

      // Scroll down
      await page.evaluate(() => window.scrollBy(0, 1500));
      await page.waitForTimeout(2000);
    }

    console.log(`\n📦 Total unique TikTok videos found: ${videoLinks.length}`);

    // Track existing products for strict deduplication
    const existingProducts = db.getAll();
    const seenNormalizedNames = new Set<string>();
    for (const p of existingProducts) {
      seenNormalizedNames.add(normalizeProductName(p.name));
    }

    console.log(`📊 Currently ${existingProducts.length} items already in database.`);

    const originalsDir = path.resolve(__dirname, '../../uploads/originals');
    const croppedDir = path.resolve(__dirname, '../../uploads/cropped');
    if (!fs.existsSync(originalsDir)) fs.mkdirSync(originalsDir, { recursive: true });
    if (!fs.existsSync(croppedDir)) fs.mkdirSync(croppedDir, { recursive: true });

    let addedCount = 0;
    let skippedAngleCount = 0;
    let skippedDuplicateCount = 0;

    for (let i = 0; i < videoLinks.length; i++) {
      const videoUrl = videoLinks[i];
      console.log(`\n------------------------------------------------------`);
      console.log(`[${i + 1}/${videoLinks.length}] 🎬 Inspecting video: ${videoUrl}`);

      try {
        await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await page.waitForTimeout(2500); // Allow video frame to render

        const tempId = `crawl_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const tempOriginalPath = path.join(originalsDir, `${tempId}_original.png`);

        // Screenshot video player
        const videoElement = await page.$('video') || await page.$('[data-e2e="browse-video"]') || await page.$('.video-player');
        if (videoElement) {
          await videoElement.screenshot({ path: tempOriginalPath });
        } else {
          await page.screenshot({ path: tempOriginalPath });
        }

        // Run Gemini Multimodal AI Vision & Angle Checker
        const visionResult = await visionExtractor.analyzeFrame(tempOriginalPath);

        // Step 1: Angle check
        if (!visionResult.angleMatched) {
          console.log(`⏭️ SKIPPED (Angle Mismatch): Video is not a product showcase angle or missing price.`);
          skippedAngleCount++;
          // Clean up temp file
          if (fs.existsSync(tempOriginalPath)) fs.unlinkSync(tempOriginalPath);
          continue;
        }

        // Step 2: Strict Deduplication Check
        const normName = normalizeProductName(visionResult.name);
        if (seenNormalizedNames.has(normName)) {
          console.log(`🔁 SKIPPED (Duplicate): Product "${visionResult.name}" already in catalog.`);
          skippedDuplicateCount++;
          if (fs.existsSync(tempOriginalPath)) fs.unlinkSync(tempOriginalPath);
          continue;
        }

        // Step 3: It's a new unique product! Auto-crop product box
        console.log(`✅ MATCHED UNIQUE PRODUCT: "${visionResult.name}" - $${visionResult.price} (${visionResult.category})`);
        const prodId = uuidv4();
        const croppedFilename = `${prodId}_cropped.webp`;
        const persistentOriginalPath = path.join(originalsDir, `${prodId}_original.png`);
        fs.renameSync(tempOriginalPath, persistentOriginalPath);

        const croppedUrl = await imageProcessor.cropProductBox(
          persistentOriginalPath,
          croppedFilename,
          visionResult.boundingBox
        );

        let postId: string | undefined;
        const match = videoUrl.match(/\/video\/(\d+)/);
        if (match) postId = match[1];

        const newProduct: ScrapedProduct = {
          id: prodId,
          name: visionResult.name,
          price: visionResult.price,
          currency: visionResult.currency || '$',
          stockStatus: visionResult.stockStatus || 'In Stock',
          brand: visionResult.brand || 'Classy Bling Collection',
          series: visionResult.series || 'Designer Series',
          category: visionResult.category || 'Blind Box',
          subcategory: visionResult.subcategory || 'Plush Doll Blind Box',
          tags: visionResult.tags || [visionResult.category, visionResult.brand],
          description: visionResult.description || `${visionResult.name} designer blind box collectible.`,
          originalScreenshotUrl: `/uploads/originals/${prodId}_original.png`,
          croppedImageUrl: croppedUrl,
          boundingBox: visionResult.boundingBox,
          tiktokVideoUrl: videoUrl,
          tiktokPostId: postId,
          contactTelegram: visionResult.contactTelegram || '092917831',
          contactFacebook: visionResult.contactFacebook || 'Classy Bling',
          angleMatched: true,
          confidence: visionResult.confidence || 0.95,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          featured: true
        };

        db.add(newProduct);
        seenNormalizedNames.add(normName);
        addedCount++;
        console.log(`🎉 Saved new product to database! (Total in DB: ${db.getAll().length})`);

      } catch (err: any) {
        console.error(`❌ Error on video ${videoUrl}:`, err.message);
      }

      await page.waitForTimeout(1000);
    }

    console.log('\n======================================================');
    console.log('🏁 Crawl Complete Summary:');
    console.log(`✨ Total Videos Inspected: ${videoLinks.length}`);
    console.log(`🎁 New Unique Products Added: ${addedCount}`);
    console.log(`🔁 Duplicates Skipped: ${skippedDuplicateCount}`);
    console.log(`⏭️ Angle Mismatches Skipped: ${skippedAngleCount}`);
    console.log(`📦 Final Unique Products in Catalog: ${db.getAll().length}`);
    console.log('======================================================\n');

  } catch (err: any) {
    console.error('Fatal crawler error:', err);
  } finally {
    await browser.close();
  }
}

crawlAll();
