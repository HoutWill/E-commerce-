import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import { ScrapedProduct, BoundingBox } from '../types/product';

interface VideoMeta {
  index: number;
  id: string;
  title: string;
  url: string;
  thumb_url: string;
}

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const ORIGINALS_DIR = path.join(UPLOADS_DIR, 'originals');
const CROPPED_DIR = path.join(UPLOADS_DIR, 'cropped');
const RAW_DIR = path.join(UPLOADS_DIR, 'tiktok_raw_thumbs');
const VIDEO_LIST_FILE = path.join(__dirname, '../../data/tiktok_video_list.json');
const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');

fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
fs.mkdirSync(CROPPED_DIR, { recursive: true });

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

function cleanProductName(raw: string): string {
  let cleaned = raw
    .replace(/[^\w\s\-\.\'\(\)]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Known product dictionary for accurate title polishing
  const dictionary: { pattern: RegExp; canonical: string }[] = [
    { pattern: /mega\s*space\s*molly\s*v2/i, canonical: 'Mega Space Molly V2 100%' },
    { pattern: /mega\s*space\s*molly/i, canonical: 'Mega Space Molly 100% Series' },
    { pattern: /molly\s*baking\s*time/i, canonical: 'Molly Baking Time Carb Lover' },
    { pattern: /baby\s*three\s*weirdly\s*adorable\s*mini/i, canonical: 'Baby Three Weirdly Adorable Mini' },
    { pattern: /baby\s*three\s*pocket\s*bunny/i, canonical: 'Baby Three Pocket Bunny Treasure' },
    { pattern: /baby\s*three\s*macaron/i, canonical: 'Baby Three V3 Big Head Macaron Bunny' },
    { pattern: /baby\s*three/i, canonical: 'Baby Three Plush Doll Series' },
    { pattern: /nommi\s*(?:abt|about)\s*the\s*childhood/i, canonical: 'Nommi About The Childhood Plush Doll' },
    { pattern: /nommi\s*pinky\s*energy/i, canonical: 'Nommi Pinky Energy Plush Doll' },
    { pattern: /nommi/i, canonical: 'Nommi Cute Plush Series' },
    { pattern: /cries?\s*baby\s*animal\s*kindergarten/i, canonical: 'Crie Baby Animal Kindergarten' },
    { pattern: /cry\s*baby\s*sunset\s*concert/i, canonical: 'CRYBABY Sunset Concert Plush Pendant' },
    { pattern: /cry\s*baby/i, canonical: 'CRYBABY Series Figure' },
    { pattern: /samuel\s*ocean/i, canonical: 'Samuel Ocean Mobilization Plush' },
    { pattern: /skullpanda\s*(?:the\s*sound|action\s*cut)/i, canonical: 'SKULLPANDA The Sound & Action Cut' },
    { pattern: /skullpanda\s*the\s*mare\s*of\s*animals/i, canonical: 'SKULLPANDA The Mare of Animals' },
    { pattern: /skullpanda/i, canonical: 'SKULLPANDA Series Blind Box' },
    { pattern: /stitch\s*blind\s*box/i, canonical: 'Disney Stitch Sleep Vinyl Plush Blind Box' },
    { pattern: /stitch/i, canonical: 'Disney Stitch Blind Box Series' },
    { pattern: /the\s*monsters\s*fall\s*in\s*wild/i, canonical: 'THE MONSTERS Fall in Wild Plush Pendant' },
    { pattern: /labubu\s*have\s*a\s*seat/i, canonical: 'Labubu Have a Seat Vinyl Plush' },
    { pattern: /labubu/i, canonical: 'Labubu Pop Mart Vinyl Figure' }
  ];

  for (const dict of dictionary) {
    if (dict.pattern.test(cleaned)) {
      return dict.canonical;
    }
  }

  // Capitalize nicely
  return cleaned
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function detectBrandAndCategory(name: string): { brand: string; category: string; series?: string } {
  const lower = name.toLowerCase();
  let brand = 'Pop Mart';
  let category = 'Blind Box';
  let series: string | undefined = undefined;

  if (lower.includes('baby three')) {
    brand = 'Baby Three';
    category = 'Plush Dolls';
    series = 'Baby Three Plush';
  } else if (lower.includes('nommi')) {
    brand = 'Nommi';
    category = 'Plush Dolls';
    series = 'Nommi Sure Fun';
  } else if (lower.includes('stitch')) {
    brand = 'Disney';
    category = 'Plush Dolls';
    series = 'Disney Lilo & Stitch';
  } else if (lower.includes('samuel')) {
    brand = 'MEI YI YOU ART TOY';
    category = 'Plush Dolls';
    series = 'Samuel Ocean';
  } else if (lower.includes('crie baby') || lower.includes('cries baby')) {
    brand = 'Crie Baby';
    category = 'Plush Dolls';
    series = 'Animal Kindergarten';
  } else if (lower.includes('skullpanda')) {
    brand = 'Pop Mart';
    category = lower.includes('figure') ? 'Action Figures' : 'Blind Box';
    series = 'Skullpanda';
  } else if (lower.includes('molly')) {
    brand = 'Pop Mart';
    category = lower.includes('space') ? 'Action Figures' : 'Blind Box';
    series = 'Molly Series';
  } else if (lower.includes('crybaby') || lower.includes('sunset')) {
    brand = 'Pop Mart';
    category = 'Plush Dolls';
    series = 'CRYBABY';
  } else if (lower.includes('labubu') || lower.includes('monsters')) {
    brand = 'Pop Mart';
    category = 'Plush Dolls';
    series = 'THE MONSTERS';
  }

  return { brand, category, series };
}

export async function processAllThumbnails() {
  console.log('🚀 Starting Full TikTok Catalog Processor...');

  if (!fs.existsSync(VIDEO_LIST_FILE)) {
    console.error('❌ video list file not found!');
    return;
  }

  const videos: VideoMeta[] = JSON.parse(fs.readFileSync(VIDEO_LIST_FILE, 'utf-8'));
  const rawFiles = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  console.log(`📁 Found ${rawFiles.length} raw thumbnails from TikTok to analyze.`);

  // Initialize Tesseract OCR scheduler
  const scheduler = Tesseract.createScheduler();
  const worker1 = await Tesseract.createWorker('eng');
  const worker2 = await Tesseract.createWorker('eng');
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);

  const parsedProducts: ScrapedProduct[] = [];
  const seenProductKeys = new Set<string>();

  for (let i = 0; i < rawFiles.length; i++) {
    const rawFile = rawFiles[i];
    const vidId = path.basename(rawFile, path.extname(rawFile));
    const videoMeta = videos.find(v => v.id === vidId);
    const rawPath = path.join(RAW_DIR, rawFile);

    try {
      const meta = await sharp(rawPath).metadata();
      if (!meta.width || !meta.height) continue;

      // Extract top 38% for text recognition
      const topBuffer = await sharp(rawPath)
        .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.38) })
        .grayscale()
        .normalise()
        .toBuffer();

      const ocrRes = await scheduler.addJob('recognize', topBuffer);
      const rawText = ocrRes.data.text.trim();

      // Check Angle Guard: must have price and instock/available indicator
      const hasInstock = /instock|avail|available|price|\$/i.test(rawText);
      const priceMatch = rawText.match(/price\s*([0-9]+(?:\.[0-9]+)?)\s*[\$sS]?/i) || 
                         rawText.match(/([0-9]+(?:\.[0-9]+)?)\s*[\$sS]/i) ||
                         rawText.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:USD|\$)/i);

      if (!hasInstock || !priceMatch) {
        // Skip non-showcase video
        continue;
      }

      const rawPrice = parseFloat(priceMatch[1]);
      if (isNaN(rawPrice) || rawPrice <= 0 || rawPrice > 500) {
        continue;
      }

      // Extract Product Name from lines before "Price"
      const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      let rawNameLine = '';
      for (const line of lines) {
        if (/price/i.test(line)) break;
        if (!/fb page|telegram|@/i.test(line)) {
          rawNameLine += ' ' + line;
        }
      }

      if (!rawNameLine.trim() && lines.length > 0) {
        rawNameLine = lines[0];
      }

      const cleanName = cleanProductName(rawNameLine);
      if (cleanName.length < 3 || /^(the|and|price|page|telegram)$/i.test(cleanName)) {
        continue;
      }

      // Deduplication Check
      const normKey = normalizeName(cleanName);
      if (seenProductKeys.has(normKey)) {
        console.log(`⏩ Skipping duplicate video for product: "${cleanName}" (ID: ${vidId})`);
        continue;
      }
      seenProductKeys.add(normKey);

      const { brand, category, series } = detectBrandAndCategory(cleanName);

      // Crop the blind box packaging cleanly from the lower region
      const box: BoundingBox = {
        ymin: 0.28,
        xmin: 0.08,
        ymax: 0.94,
        xmax: 0.92
      };

      const cropLeft = Math.round(box.xmin * meta.width);
      const cropTop = Math.round(box.ymin * meta.height);
      const cropWidth = Math.round((box.xmax - box.xmin) * meta.width);
      const cropHeight = Math.round((box.ymax - box.ymin) * meta.height);

      const originalFilename = `${vidId}_original.png`;
      const croppedFilename = `${vidId}_cropped.webp`;

      const originalFilePath = path.join(ORIGINALS_DIR, originalFilename);
      const croppedFilePath = path.join(CROPPED_DIR, croppedFilename);

      // Save full original image
      await sharp(rawPath).png().toFile(originalFilePath);

      // Save high-quality cropped box image
      await sharp(rawPath)
        .extract({
          left: Math.max(0, cropLeft),
          top: Math.max(0, cropTop),
          width: Math.min(cropWidth, meta.width - cropLeft),
          height: Math.min(cropHeight, meta.height - cropTop)
        })
        .webp({ quality: 92 })
        .toFile(croppedFilePath);

      const product: ScrapedProduct = {
        id: `prod_${vidId}`,
        name: cleanName,
        price: rawPrice,
        currency: 'USD',
        stockStatus: 'In Stock' as const,
        category,
        brand,
        series: series || '',
        description: `Authentic ${cleanName} blind box / designer art toy collectible from Classy Bling. In stock and ready to ship.`,
        boundingBox: box,
        originalScreenshotUrl: `/uploads/originals/${originalFilename}`,
        croppedImageUrl: `/uploads/cropped/${croppedFilename}`,
        tiktokVideoUrl: videoMeta?.url || `https://www.tiktok.com/@classy.bling/video/${vidId}`,
        contactTelegram: 'https://t.me/+85592917831',
        contactFacebook: 'https://facebook.com',
        angleMatched: true,
        confidence: 0.95,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [brand, category, ...(series ? [series] : []), 'Authentic', 'In Stock']
      };

      parsedProducts.push(product);
      console.log(`✅ [${parsedProducts.length}] Extracted: "${cleanName}" | Price: $${rawPrice} | Brand: ${brand} | File: ${croppedFilename}`);

    } catch (err: any) {
      console.error(`❌ Error processing thumbnail ${rawFile}:`, err.message);
    }
  }

  await scheduler.terminate();

  // Save the updated catalog
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(parsedProducts, null, 2), 'utf-8');
  console.log(`\n🎉 Processed Catalog Complete! Saved ${parsedProducts.length} unique items to ${PRODUCTS_FILE}`);
}

if (require.main === module) {
  processAllThumbnails()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
