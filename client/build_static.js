import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 1. Copy index.html
fs.copyFileSync(path.resolve('src_static/index.html'), path.join(distDir, 'index.html'));

// 2. Copy build/ assets (compiled CSS, JS, fonts)
fs.cpSync(path.resolve('src_static/build'), path.join(distDir, 'build'), { recursive: true });

// 3. Copy public/ assets (3d_boxes, banners, logo, favicon, robots)
if (fs.existsSync(path.resolve('public'))) {
  fs.cpSync(path.resolve('public'), distDir, { recursive: true });
}

console.log('Successfully built static storefront from local version into dist/!');
