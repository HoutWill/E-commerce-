import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/db';
import { imageProcessor } from '../services/imageProcessor';
import { ScrapedProduct } from '../types/product';

async function seed() {
  console.log('🌱 Seeding initial products and processing sample user photo...');

  const sampleSourcePath = 'C:\\Users\\MSI\\.gemini\\antigravity-ide\\brain\\db3f5f89-f567-4c34-923f-3cab96a0c6e2\\.user_uploaded\\media_1787421418702.png';
  const originalsDir = path.resolve(__dirname, '../../uploads/originals');
  const croppedDir = path.resolve(__dirname, '../../uploads/cropped');

  if (!fs.existsSync(originalsDir)) fs.mkdirSync(originalsDir, { recursive: true });
  if (!fs.existsSync(croppedDir)) fs.mkdirSync(croppedDir, { recursive: true });

  const sampleId = 'nommi-pinky-energy-001';
  const destOriginal = path.join(originalsDir, `${sampleId}_original.png`);
  const croppedFilename = `${sampleId}_cropped.webp`;

  if (fs.existsSync(sampleSourcePath)) {
    fs.copyFileSync(sampleSourcePath, destOriginal);
    console.log('✅ Copied user uploaded sample photo to originals');

    // Perform smart bounding box crop on the Nommi Pinky Energy box
    const croppedUrl = await imageProcessor.cropProductBox(
      destOriginal,
      croppedFilename,
      {
        ymin: 0.32,
        xmin: 0.08,
        ymax: 0.93,
        xmax: 0.88
      }
    );

    const nommiProduct: ScrapedProduct = {
      id: sampleId,
      name: "Nommi Pinky Energy",
      price: 14,
      currency: "$",
      stockStatus: "In Stock",
      brand: "Nommi",
      series: "Pinky Energy",
      category: "Plush Dolls",
      subcategory: "Plush Doll Blind Box",
      tags: ["Nommi", "Pinky Energy", "Plush Doll", "Blind Box", "TOP TOY", "Kawaii", "In Stock", "Viral"],
      description: "Nommi Pinky Energy Plush Doll Blind Box. Official viral collectible featuring soft plush bunny ears, starry details, and pastel pink aesthetics.",
      originalScreenshotUrl: `/uploads/originals/${sampleId}_original.png`,
      croppedImageUrl: croppedUrl,
      tiktokVideoUrl: "https://www.tiktok.com/@classy.bling",
      contactTelegram: "092917831",
      contactFacebook: "Classy Bling",
      angleMatched: true,
      confidence: 0.98,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured: true
    };

    db.add(nommiProduct);
    console.log('✅ Added Nommi Pinky Energy to database!');
  }

  // Add more top Classy Bling designer blind boxes to seed the store beautifully
  const catalogSeeds: Partial<ScrapedProduct>[] = [
    {
      id: "labubu-fall-in-wild-002",
      name: "THE MONSTERS Fall in Wild Plush Doll Pendant",
      price: 32,
      currency: "$",
      stockStatus: "In Stock",
      brand: "Pop Mart",
      series: "The Monsters",
      category: "Plush Dolls",
      subcategory: "Plush Doll Pendant",
      tags: ["Labubu", "The Monsters", "Pop Mart", "Fall in Wild", "Pendant", "Hot"],
      description: "POP MART THE MONSTERS Fall in Wild vinyl plush pendant with bucket hat and overalls. Highly sought after viral collectible.",
      originalScreenshotUrl: `/uploads/originals/${sampleId}_original.png`,
      croppedImageUrl: `/uploads/cropped/${croppedFilename}`,
      tiktokVideoUrl: "https://www.tiktok.com/@classy.bling",
      contactTelegram: "092917831",
      contactFacebook: "Classy Bling",
      angleMatched: true,
      confidence: 0.95,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
      featured: true
    },
    {
      id: "labubu-have-a-seat-003",
      name: "Labubu Have a Seat Vinyl Plush Blind Box",
      price: 24,
      currency: "$",
      stockStatus: "In Stock",
      brand: "Pop Mart",
      series: "The Monsters",
      category: "Blind Box",
      subcategory: "Vinyl Plush Blind Box",
      tags: ["Labubu", "Have a Seat", "Pop Mart", "Blind Box", "Plush"],
      description: "THE MONSTERS Have a Seat vinyl face sitting plush doll blind box series.",
      originalScreenshotUrl: `/uploads/originals/${sampleId}_original.png`,
      croppedImageUrl: `/uploads/cropped/${croppedFilename}`,
      tiktokVideoUrl: "https://www.tiktok.com/@classy.bling",
      contactTelegram: "092917831",
      contactFacebook: "Classy Bling",
      angleMatched: true,
      confidence: 0.96,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      featured: true
    },
    {
      id: "crybaby-sunset-concert-004",
      name: "CRYBABY Sunset Concert Series Plush Pendant",
      price: 22,
      currency: "$",
      stockStatus: "In Stock",
      brand: "Pop Mart",
      series: "Crybaby",
      category: "Plush Dolls",
      subcategory: "Plush Pendant",
      tags: ["Crybaby", "Sunset Concert", "Pop Mart", "Plush Doll", "Pendant"],
      description: "CRYBABY Sunset Concert series plush doll keychain pendant with floral headphones and guitar charm.",
      originalScreenshotUrl: `/uploads/originals/${sampleId}_original.png`,
      croppedImageUrl: `/uploads/cropped/${croppedFilename}`,
      tiktokVideoUrl: "https://www.tiktok.com/@classy.bling",
      contactTelegram: "092917831",
      contactFacebook: "Classy Bling",
      angleMatched: true,
      confidence: 0.94,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date().toISOString(),
      featured: true
    },
    {
      id: "skullpanda-mare-animals-005",
      name: "SKULLPANDA The Mare of Animals Blind Box",
      price: 18,
      currency: "$",
      stockStatus: "In Stock",
      brand: "Pop Mart",
      series: "Skullpanda",
      category: "Blind Box",
      subcategory: "Vinyl Figure Blind Box",
      tags: ["Skullpanda", "Mare of Animals", "Pop Mart", "Art Toy", "Figure"],
      description: "SKULLPANDA The Mare of Animals art toy vinyl collectible figure series.",
      originalScreenshotUrl: `/uploads/originals/${sampleId}_original.png`,
      croppedImageUrl: `/uploads/cropped/${croppedFilename}`,
      tiktokVideoUrl: "https://www.tiktok.com/@classy.bling",
      contactTelegram: "092917831",
      contactFacebook: "Classy Bling",
      angleMatched: true,
      confidence: 0.97,
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      updatedAt: new Date().toISOString(),
      featured: true
    },
    {
      id: "baby-three-v3-macaron-006",
      name: "Baby Three V3 Big Head Macaron Bunny Plush",
      price: 16,
      currency: "$",
      stockStatus: "In Stock",
      brand: "Baby Three",
      series: "Macaron V3",
      category: "Plush Dolls",
      subcategory: "Plush Doll Blind Box",
      tags: ["Baby Three", "Macaron", "Plush", "Blind Box", "Cute"],
      description: "Baby Three V3 Big Head plush doll blind box with rotating eyes and soft pastel zipper macaron fur.",
      originalScreenshotUrl: `/uploads/originals/${sampleId}_original.png`,
      croppedImageUrl: `/uploads/cropped/${croppedFilename}`,
      tiktokVideoUrl: "https://www.tiktok.com/@classy.bling",
      contactTelegram: "092917831",
      contactFacebook: "Classy Bling",
      angleMatched: true,
      confidence: 0.93,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date().toISOString(),
      featured: false
    }
  ];

  for (const item of catalogSeeds) {
    db.add(item as ScrapedProduct);
  }

  console.log(`🎉 Seeding complete! Database now has ${db.getAll().length} products.`);
}

seed().catch(err => {
  console.error('Seeding error:', err);
});
