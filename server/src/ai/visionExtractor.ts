import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createWorker } from 'tesseract.js';
import { BoundingBox, StockStatus } from '../types/product';

dotenv.config();

export interface VisionExtractionResult {
  angleMatched: boolean;
  skippedReason?: string;
  name: string;
  price: number;
  currency: string;
  stockStatus: StockStatus;
  brand: string;
  series: string;
  category: string;
  subcategory: string;
  tags: string[];
  description: string;
  contactTelegram: string;
  contactFacebook: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export class VisionExtractor {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  public async analyzeFrame(imagePath: string): Promise<VisionExtractionResult> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image not found at path: ${imagePath}`);
    }

    // Attempt Gemini AI if key is present
    if (this.genAI) {
      try {
        return await this.extractWithGemini(imagePath);
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local OCR extraction:', err);
      }
    }

    // High accuracy local OCR fallback
    return await this.extractWithLocalOCR(imagePath);
  }

  private async extractWithGemini(imagePath: string): Promise<VisionExtractionResult> {
    if (!this.genAI) throw new Error('Gemini API not configured');

    const imageBuffer = await fs.promises.readFile(imagePath);
    const base64Data = imageBuffer.toString('base64');

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      }
    });

    const prompt = `
You are an expert e-commerce vision AI for a designer toy boutique (@classy.bling).
Analyze this TikTok video frame screenshot.

First check if this frame matches the CLASSY BLING standard product showcase format:
Standard format characteristics:
- Shows a hand holding a blind box / designer toy box or doll in front of toy shelves/claw machines.
- Contains prominent overlay text at the top: Product Name (e.g. "Nommi Pinky Energy", "Labubu...", "Crybaby..."), "Price XX$", and stock status (e.g. "Available instock").

If the image does NOT show a product box showcase with product text overlay (e.g. random person talking, unrelated video, wrong camera angle, missing price), set "angleMatched": false, "skippedReason": "Video does not match standard product showcase angle or lacks product overlay".

If it MATCHES, extract the structured data accurately:
- name: The exact product name shown in overlay text (e.g., "Nommi Pinky Energy").
- price: Number only (e.g. 14 if "Price 14$").
- currency: Currency symbol (e.g. "$").
- stockStatus: "In Stock" (if Available instock/checkmarks), "Out of Stock", or "Pre-order".
- brand: Brand name (e.g., "Nommi", "Pop Mart", "TOP TOY", "Finding Unicorn", "Baby Three", "52TOYS", "Heyone", "TNT Space").
- series: Series name (e.g., "Pinky Energy", "Fall in Wild", "Have a Seat").
- category: Main category (e.g. "Blind Box", "Plush Dolls", "Vinyl Figures", "Keyrings").
- subcategory: Subcategory (e.g. "Plush Doll Blind Box", "Action Figure Blind Box").
- tags: Array of relevant tags for searching.
- description: A clean, enticing 1-2 sentence product description for a luxury blind box store.
- contactTelegram: Extracted telegram number if visible (default "092917831").
- contactFacebook: Extracted Facebook page name if visible (default "Classy Bling").
- boundingBox: Normalized coordinates [0.0 to 1.0] of ONLY the printed toy box packaging itself (EXCLUDE human hands, fingers, thumbs, arm, and background):
  {
    "ymin": float (0.0 to 1.0 - top of the box),
    "xmin": float (0.0 to 1.0 - left edge of the box, excluding thumb/fingers),
    "ymax": float (0.0 to 1.0 - bottom edge of the box, excluding hand),
    "xmax": float (0.0 to 1.0 - right edge of the box)
  }

Return STRICT JSON adhering to this schema:
{
  "angleMatched": boolean,
  "skippedReason": string | null,
  "name": string,
  "price": number,
  "currency": string,
  "stockStatus": "In Stock" | "Out of Stock" | "Pre-order" | "Low Stock",
  "brand": string,
  "series": string,
  "category": string,
  "subcategory": string,
  "tags": string[],
  "description": string,
  "contactTelegram": string,
  "contactFacebook": string,
  "confidence": number,
  "boundingBox": {
    "ymin": number,
    "xmin": number,
    "ymax": number,
    "xmax": number
  }
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/png',
          data: base64Data
        }
      }
    ]);

    const text = result.response.text();
    const parsed = JSON.parse(text) as VisionExtractionResult;
    return parsed;
  }

  /**
   * Local OCR engine using Tesseract
   */
  private async extractWithLocalOCR(imagePath: string): Promise<VisionExtractionResult> {
    try {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(imagePath);
      await worker.terminate();

      const text = ret.data.text;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

      // Look for Price pattern like "Price 14$", "Price $14", "14$"
      let price = 0;
      const priceMatch = text.match(/Price\s*[:=\s]*\$?(\d+)/i) || text.match(/(\d+)\s*\$/);
      if (priceMatch) {
        price = parseInt(priceMatch[1], 10);
      }

      // Check if price or product overlay exists
      if (!price && !text.toLowerCase().includes('price')) {
        return {
          angleMatched: false,
          skippedReason: 'No product price overlay detected (not standard product showcase angle).',
          name: '',
          price: 0,
          currency: '$',
          stockStatus: 'In Stock',
          brand: 'Classy Bling',
          series: '',
          category: 'Blind Box',
          subcategory: '',
          tags: [],
          description: '',
          contactTelegram: '092917831',
          contactFacebook: 'Classy Bling',
          confidence: 0
        };
      }

      // Extract title from line before "Price"
      let productName = 'Classy Bling Designer Collectible';
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes('price') && i > 0) {
          productName = lines[i - 1].replace(/[^a-zA-Z0-9\s-]/g, '').trim();
          break;
        }
      }

      if (productName === 'Classy Bling Designer Collectible' && lines.length > 0) {
        productName = lines[0].replace(/[^a-zA-Z0-9\s-]/g, '').trim();
      }

      // Infer brand from title
      let brand = 'Pop Mart';
      const lower = productName.toLowerCase();
      if (lower.includes('nommi')) brand = 'Nommi';
      else if (lower.includes('baby three') || lower.includes('babythree')) brand = 'Baby Three';
      else if (lower.includes('labubu') || lower.includes('monsters') || lower.includes('crybaby') || lower.includes('skullpanda') || lower.includes('dimoo') || lower.includes('hirono')) brand = 'Pop Mart';
      else if (lower.includes('top toy')) brand = 'TOP TOY';
      else if (lower.includes('finding unicorn') || lower.includes('shinwoo')) brand = 'Finding Unicorn';

      // Infer category
      let category = 'Blind Box';
      if (lower.includes('plush') || lower.includes('doll') || lower.includes('pendant') || lower.includes('macaron')) {
        category = 'Plush Dolls';
      } else if (lower.includes('figure') || lower.includes('vinyl')) {
        category = 'Vinyl Figures';
      } else if (lower.includes('keychain') || lower.includes('keyring')) {
        category = 'Keychains';
      }

      const stockStatus: StockStatus = text.toLowerCase().includes('pre-order') || text.toLowerCase().includes('preorder')
        ? 'Pre-order'
        : 'In Stock';

      return {
        angleMatched: true,
        name: productName,
        price: price || 14,
        currency: '$',
        stockStatus,
        brand,
        series: productName,
        category,
        subcategory: `${brand} ${category}`,
        tags: [brand, category, productName, stockStatus].filter(Boolean),
        description: `${productName} official collectible by ${brand}. Fast order via Telegram 092917831.`,
        contactTelegram: '092917831',
        contactFacebook: 'Classy Bling',
        confidence: 0.9,
        boundingBox: {
          ymin: 0.32,
          xmin: 0.10,
          ymax: 0.93,
          xmax: 0.90
        }
      };

    } catch (ocrErr) {
      console.error('Local OCR error:', ocrErr);
      return {
        angleMatched: false,
        skippedReason: 'OCR error reading video frame',
        name: '',
        price: 0,
        currency: '$',
        stockStatus: 'In Stock',
        brand: '',
        series: '',
        category: '',
        subcategory: '',
        tags: [],
        description: '',
        contactTelegram: '092917831',
        contactFacebook: 'Classy Bling',
        confidence: 0
      };
    }
  }
}

export const visionExtractor = new VisionExtractor();
