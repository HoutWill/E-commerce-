import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { visionExtractor } from '../ai/visionExtractor';
import { imageProcessor } from '../services/imageProcessor';
import { db } from '../services/db';
import { ScrapedProduct } from '../types/product';
import dotenv from 'dotenv';

dotenv.config();

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

interface TikTokPostMetadata {
  id: string;
  url: string;
  webpage_url: string;
  title: string;
  description: string;
  thumbnails: Array<{ id: string; url: string }>;
}

async function fetchAllTikTokVideos(handle: string = 'classy.bling', maxItems: number = 60): Promise<TikTokPostMetadata[]> {
  const profileUrl = `https://www.tiktok.com/@${handle.replace('@', '')}`;
  console.log(`🌐 Fetching video metadata for ${profileUrl} using Chrome Impersonation...`);

  return new Promise((resolve, reject) => {
    const args = [
      '-m', 'yt_dlp',
      '--impersonate', 'chrome',
      '--flat-playlist',
      '--dump-json',
      profileUrl,
      '--playlist-end', String(maxItems)
    ];

    const proc = spawn('python', args);
    let stdoutData = '';
    let stderrData = '';

    proc.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0 && !stdoutData) {
        return reject(new Error(`yt-dlp failed with exit code ${code}: ${stderrData}`));
      }

      const lines = stdoutData.trim().split('\n').filter(Boolean);
      const posts: TikTokPostMetadata[] = [];

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.id && (parsed.webpage_url || parsed.url)) {
            posts.push({
              id: parsed.id,
              url: parsed.url || parsed.webpage_url,
              webpage_url: parsed.webpage_url || parsed.url,
              title: parsed.title || '',
              description: parsed.description || '',
              thumbnails: parsed.thumbnails || []
            });
          }
        } catch (e) {
          // ignore malformed lines
        }
      }

      resolve(posts);
    });
  });
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Referer': 'https://www.tiktok.com/'
    },
    timeout: 20000
  });

  await fs.promises.writeFile(destPath, response.data);
}

async function run() {
  console.log('\n======================================================');
  console.log('✨ Classy Bling Full TikTok Catalog Extractor & Deduplicator ✨');
  console.log('🎯 Target: @classy.bling');
  console.log('🛡️ Angle Guard: Activated (Skips non-showcase angles)');
  console.log('🔄 Deduplication Guard: Activated (No repeated products)');
  console.log('======================================================\n');

  const originalsDir = path.resolve(__dirname, '../../uploads/originals');
  const croppedDir = path.resolve(__dirname, '../../uploads/cropped');
  if (!fs.existsSync(originalsDir)) fs.mkdirSync(originalsDir, { recursive: true });
  if (!fs.existsSync(croppedDir)) fs.mkdirSync(croppedDir, { recursive: true });

  // 1. Fetch all videos from profile
  const posts = await fetchAllTikTokVideos('classy.bling', 50);
  console.log(`📦 Successfully discovered ${posts.length} videos from @classy.bling!\n`);

  // Existing database products for strict deduplication
  const existingProducts = db.getAll();
  const seenProductNames = new Set<string>();
  for (const p of existingProducts) {
    seenProductNames.add(normalizeProductName(p.name));
  }

  let uniqueAddedCount = 0;
  let skippedDuplicatesCount = 0;
  let skippedAngleCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const videoUrl = post.webpage_url || `https://www.tiktok.com/@classy.bling/video/${post.id}`;
    console.log(`------------------------------------------------------`);
    console.log(`[${i + 1}/${posts.length}] 🎬 Inspecting Post ID: ${post.id}`);

    // Get best thumbnail or cover
    const coverThumb = post.thumbnails?.find(t => t.id === 'cover' || t.id === 'originCover') || post.thumbnails?.[0];
    if (!coverThumb || !coverThumb.url) {
      console.log(`⏭️ Skipped: No image frame thumbnail available.`);
      skippedAngleCount++;
      continue;
    }

    const tempFilename = `tiktok_${post.id}_raw.jpg`;
    const tempFilePath = path.join(originalsDir, tempFilename);

    try {
      // Download frame image
      await downloadImage(coverThumb.url, tempFilePath);

      // AI Vision Analysis
      const visionResult = await visionExtractor.analyzeFrame(tempFilePath);

      // Check Angle Match
      if (!visionResult.angleMatched) {
        console.log(`⏭️ SKIPPED (Angle Mismatch): Video is not standard product showcase format.`);
        skippedAngleCount++;
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        continue;
      }

      // Check Deduplication
      const normName = normalizeProductName(visionResult.name);
      if (seenProductNames.has(normName)) {
        console.log(`🔁 SKIPPED (Duplicate): "${visionResult.name}" is already in your catalog.`);
        skippedDuplicatesCount++;
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        continue;
      }

      // Unique Product Found! Auto-crop box
      console.log(`✅ MATCHED UNIQUE ITEM: "${visionResult.name}" - $${visionResult.price} (${visionResult.category})`);

      const prodId = uuidv4();
      const croppedFilename = `${prodId}_cropped.webp`;
      const permanentOriginalPath = path.join(originalsDir, `${prodId}_original.png`);
      fs.renameSync(tempFilePath, permanentOriginalPath);

      const croppedUrl = await imageProcessor.cropProductBox(
        permanentOriginalPath,
        croppedFilename,
        visionResult.boundingBox
      );

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
        description: visionResult.description || `${visionResult.name} designer toy collectible.`,
        originalScreenshotUrl: `/uploads/originals/${prodId}_original.png`,
        croppedImageUrl: croppedUrl,
        boundingBox: visionResult.boundingBox,
        tiktokVideoUrl: videoUrl,
        tiktokPostId: post.id,
        contactTelegram: visionResult.contactTelegram || '092917831',
        contactFacebook: visionResult.contactFacebook || 'Classy Bling',
        angleMatched: true,
        confidence: visionResult.confidence || 0.95,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        featured: true
      };

      db.add(newProduct);
      seenProductNames.add(normName);
      uniqueAddedCount++;
      console.log(`🎉 Added "${newProduct.name}" to database! (Total unique items: ${db.getAll().length})`);

    } catch (err: any) {
      console.error(`Error processing post ${post.id}:`, err.message);
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    }
  }

  console.log('\n======================================================');
  console.log('🏁 Full TikTok Catalog Crawl Completed!');
  console.log(`📹 Total Videos Scanned: ${posts.length}`);
  console.log(`✨ New Unique Products Saved: ${uniqueAddedCount}`);
  console.log(`🔁 Duplicates Filtered: ${skippedDuplicatesCount}`);
  console.log(`⏭️ Angle Mismatches Skipped: ${skippedAngleCount}`);
  console.log(`🛍️ Total Unique Products in Web Catalog: ${db.getAll().length}`);
  console.log('======================================================\n');
}

run().catch(console.error);
