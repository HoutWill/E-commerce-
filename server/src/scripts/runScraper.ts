import { tiktokScraper } from '../scraper/tiktokScraper';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const targetHandle = process.argv[2] || 'classy.bling';
  const maxVideos = parseInt(process.argv[3] || '20', 10);

  console.log(`\n======================================================`);
  console.log(`✨ Classy Bling TikTok Scraper & AI Extraction Bot ✨`);
  console.log(`🎯 Target: @${targetHandle.replace('@', '')}`);
  console.log(`📦 Max videos to inspect: ${maxVideos}`);
  console.log(`📐 Angle Filter: Only product showcase angles will be saved`);
  console.log(`======================================================\n`);

  try {
    const products = await tiktokScraper.scrapeProfile(targetHandle, maxVideos);
    console.log(`\n✨ Scraping finished! Saved ${products.length} products to database.`);
  } catch (err: any) {
    console.error(`\n❌ Scraper error: ${err.message}`);
  }
}

main();
