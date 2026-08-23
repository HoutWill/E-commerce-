import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function testTikTokPage() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 }
  });

  const page = await context.newPage();

  console.log('Navigating to https://www.tiktok.com/@classy.bling...');
  await page.goto('https://www.tiktok.com/@classy.bling', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(4000);

  const screenshotPath = path.resolve(__dirname, '../../uploads/debug_tiktok_page.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Saved debug screenshot to:', screenshotPath);

  // Check all anchor tags
  const anchors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      href: a.href,
      text: a.innerText.trim(),
      className: a.className
    }));
  });

  console.log(`Total anchors found on page: ${anchors.length}`);
  const videoAnchors = anchors.filter(a => a.href.includes('/video/') || a.href.includes('/@'));
  console.log('Sample matching anchors:', videoAnchors.slice(0, 10));

  await browser.close();
}

testTikTokPage().catch(console.error);
