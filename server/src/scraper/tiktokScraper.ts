import { chromium, Browser, Page } from 'playwright';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { db } from '../services/db';
import { imageProcessor } from '../services/imageProcessor';
import { visionExtractor } from '../ai/visionExtractor';
import { ScrapedProduct, ScrapingJobStatus } from '../types/product';

export class TikTokScraper {
  private status: ScrapingJobStatus = {
    isRunning: false,
    status: 'idle',
    totalFound: 0,
    processedCount: 0,
    savedCount: 0,
    skippedCount: 0,
    logs: []
  };

  private browser: Browser | null = null;

  public getStatus(): ScrapingJobStatus {
    return { ...this.status };
  }

  private addLog(level: 'info' | 'warn' | 'success' | 'error', message: string) {
    const logItem = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    this.status.logs.unshift(logItem);
    // Keep last 150 logs
    if (this.status.logs.length > 150) {
      this.status.logs.pop();
    }
    console.log(`[${logItem.timestamp}] [${level.toUpperCase()}] ${message}`);
  }

  /**
   * Run full profile crawl for @classy.bling with Chrome Impersonation and Strict Deduplication
   */
  public async scrapeProfile(targetHandle: string = 'classy.bling', maxVideos: number = 30): Promise<ScrapedProduct[]> {
    if (this.status.isRunning) {
      throw new Error('A scraping task is already running!');
    }

    this.status = {
      isRunning: true,
      status: 'running',
      totalFound: 0,
      processedCount: 0,
      savedCount: 0,
      skippedCount: 0,
      logs: []
    };

    const savedProducts: ScrapedProduct[] = [];
    const cleanHandle = targetHandle.replace('@', '').split('/').pop() || 'classy.bling';
    const profileUrl = `https://www.tiktok.com/@${cleanHandle}`;

    this.addLog('info', `🚀 Starting TikTok bot on profile: ${profileUrl}`);
    this.addLog('info', `🛡️ Angle Guard Active: Skipping any video that is not standard product showcase angle`);
    this.addLog('info', `🔄 Deduplication Active: Filtering out repeated product entries`);

    try {
      // Step 1: Fetch metadata via yt-dlp Chrome impersonation
      const { spawn } = await import('child_process');
      const axios = (await import('axios')).default;

      this.addLog('info', `Fetching video playlist metadata...`);

      const posts: Array<{ id: string; url: string; title: string; coverUrl?: string }> = await new Promise((resolve, reject) => {
        const proc = spawn('python', [
          '-m', 'yt_dlp',
          '--impersonate', 'chrome',
          '--flat-playlist',
          '--dump-json',
          profileUrl,
          '--playlist-end', String(maxVideos)
        ]);

        let stdoutData = '';
        let stderrData = '';

        proc.stdout.on('data', data => { stdoutData += data.toString(); });
        proc.stderr.on('data', data => { stderrData += data.toString(); });

        proc.on('close', code => {
          if (code !== 0 && !stdoutData) {
            return reject(new Error(`Crawler exit code ${code}: ${stderrData}`));
          }
          const lines = stdoutData.trim().split('\n').filter(Boolean);
          const list: any[] = [];
          for (const line of lines) {
            try {
              const p = JSON.parse(line);
              const cover = p.thumbnails?.find((t: any) => t.id === 'cover' || t.id === 'originCover') || p.thumbnails?.[0];
              list.push({
                id: p.id,
                url: p.webpage_url || p.url || `https://www.tiktok.com/@${cleanHandle}/video/${p.id}`,
                title: p.title || '',
                coverUrl: cover?.url
              });
            } catch (e) {}
          }
          resolve(list);
        });
      });

      this.status.totalFound = posts.length;
      this.addLog('info', `Found ${posts.length} videos from @${cleanHandle}. Beginning inspection...`);

      const originalsDir = path.resolve(__dirname, '../../uploads/originals');
      if (!fs.existsSync(originalsDir)) fs.mkdirSync(originalsDir, { recursive: true });

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        this.status.currentVideoUrl = post.url;
        this.status.processedCount = i + 1;

        this.addLog('info', `[${i + 1}/${posts.length}] Inspecting Post ID: ${post.id}`);

        if (!post.coverUrl) {
          this.status.skippedCount++;
          this.addLog('warn', `⏭️ Skipped: No cover image available.`);
          continue;
        }

        const tempFilePath = path.join(originalsDir, `raw_${post.id}.jpg`);

        try {
          // Download frame
          const res = await axios({
            method: 'GET',
            url: post.coverUrl,
            responseType: 'arraybuffer',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Referer': 'https://www.tiktok.com/'
            },
            timeout: 15000
          });

          await fs.promises.writeFile(tempFilePath, res.data);

          // Process image through Angle Guard, AI OCR, and Auto Cropper
          const product = await this.processImageFile(tempFilePath, post.url);
          if (product) {
            savedProducts.push(product);
            this.status.savedCount++;
            this.addLog('success', `✅ Added: "${product.name}" - $${product.price} (${product.category})`);
          } else {
            this.status.skippedCount++;
          }
        } catch (err: any) {
          this.status.skippedCount++;
          this.addLog('error', `Error processing post ${post.id}: ${err.message}`);
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        }
      }

      this.status.status = 'completed';
      this.addLog('success', `🎉 Complete! Scanned: ${this.status.processedCount}, New Unique Products: ${this.status.savedCount}, Skipped: ${this.status.skippedCount}`);
    } catch (err: any) {
      this.status.status = 'error';
      this.addLog('error', `Fatal crawler error: ${err.message}`);
    } finally {
      this.status.isRunning = false;
    }

    return savedProducts;
  }

  /**
   * Process a single video URL
   */
  public async processSingleVideoUrl(videoUrl: string): Promise<ScrapedProduct | null> {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 900 }
      });
      const page = await context.newPage();
      return await this.processSingleVideoPage(page, videoUrl);
    } finally {
      await browser.close();
    }
  }

  /**
   * Internal handler to navigate to video, capture clear frame screenshot, and analyze
   */
  private async processSingleVideoPage(page: Page, videoUrl: string): Promise<ScrapedProduct | null> {
    await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500); // Allow video player to initialize and render frame

    // Take screenshot of the video container or main viewport
    const videoElement = await page.$('video') || await page.$('[data-e2e="browse-video"]') || await page.$('.video-player');

    const tempFilename = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
    const tempFilePath = path.resolve(__dirname, '../../uploads/originals', tempFilename);

    // Ensure directory exists
    const originalsDir = path.dirname(tempFilePath);
    if (!fs.existsSync(originalsDir)) {
      fs.mkdirSync(originalsDir, { recursive: true });
    }

    if (videoElement) {
      await videoElement.screenshot({ path: tempFilePath });
    } else {
      await page.screenshot({ path: tempFilePath });
    }

    // Process image through Vision Extractor
    return await this.processImageFile(tempFilePath, videoUrl);
  }

  /**
   * Core logic to analyze an image frame, check angle, crop product box, and store in DB
   */
  public async processImageFile(imageFilePath: string, videoUrl?: string): Promise<ScrapedProduct | null> {
    const id = uuidv4();
    const originalExt = path.extname(imageFilePath) || '.png';
    const originalFilename = `${id}_original${originalExt}`;
    const croppedFilename = `${id}_cropped.webp`;

    const destOriginalPath = path.resolve(__dirname, '../../uploads/originals', originalFilename);
    
    // Copy to persistent original path if needed
    if (imageFilePath !== destOriginalPath) {
      await fs.promises.copyFile(imageFilePath, destOriginalPath);
    }

    const originalUrl = `/uploads/originals/${originalFilename}`;

    // Step 1: AI Vision Analysis & Angle Check
    this.addLog('info', 'Analyzing frame with Multimodal Vision AI...');
    const visionResult = await visionExtractor.analyzeFrame(destOriginalPath);

    // Step 2: Check Angle Filter
    if (!visionResult.angleMatched) {
      this.addLog('warn', `⏭️ Video skipped (Angle mismatch): ${visionResult.skippedReason || 'Does not match product showcase format'}`);
      if (fs.existsSync(destOriginalPath)) fs.unlinkSync(destOriginalPath);
      return null;
    }

    // Step 3: Strict Deduplication Check
    const normName = visionResult.name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    const existingProducts = db.getAll();
    const isDuplicate = existingProducts.some(p => 
      p.name.toLowerCase().replace(/[^a-z0-9]/g, '').trim() === normName
    );

    if (isDuplicate) {
      this.addLog('warn', `🔁 Video skipped (Duplicate): "${visionResult.name}" is already in your catalog.`);
      if (fs.existsSync(destOriginalPath)) fs.unlinkSync(destOriginalPath);
      return null;
    }

    // Step 4: Crop Product Box
    this.addLog('info', `✨ Unique product confirmed! Auto-cropping box for: "${visionResult.name}"`);
    const croppedUrl = await imageProcessor.cropProductBox(
      destOriginalPath,
      croppedFilename,
      visionResult.boundingBox
    );

    // Step 5: Extract post ID if available
    let postId: string | undefined;
    if (videoUrl) {
      const match = videoUrl.match(/\/video\/(\d+)/);
      if (match) postId = match[1];
    }

    // Step 6: Construct Product Record
    const product: ScrapedProduct = {
      id,
      name: visionResult.name || 'Unnamed Collectible',
      price: visionResult.price || 0,
      currency: visionResult.currency || '$',
      stockStatus: visionResult.stockStatus || 'In Stock',
      brand: visionResult.brand || 'Classy Bling Collection',
      series: visionResult.series || 'Designer Series',
      category: visionResult.category || 'Blind Box',
      subcategory: visionResult.subcategory || 'Plush Doll Blind Box',
      tags: visionResult.tags || [visionResult.category, visionResult.brand],
      description: visionResult.description || `${visionResult.name} designer toy collectible.`,
      originalScreenshotUrl: originalUrl,
      croppedImageUrl: croppedUrl,
      boundingBox: visionResult.boundingBox,
      tiktokVideoUrl: videoUrl,
      tiktokPostId: postId,
      contactTelegram: visionResult.contactTelegram || '092917831',
      contactFacebook: visionResult.contactFacebook || 'Classy Bling',
      angleMatched: true,
      confidence: visionResult.confidence || 0.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured: true
    };

    // Save into database
    db.add(product);
    return product;
  }
}

export const tiktokScraper = new TikTokScraper();
