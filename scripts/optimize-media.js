const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'assets');

function walkImages(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  items.forEach((it) => {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) return walkImages(full);
    const ext = path.extname(it.name).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const out = full + '.webp';
      console.log('Converting', full, '->', out);
      sharp(full).resize(1200).webp({ quality: 78 }).toFile(out).catch(console.error);
      const thumb = path.join(path.dirname(full), 'thumb-' + path.basename(it.name, ext) + '.webp');
      sharp(full).resize(400).webp({ quality: 60 }).toFile(thumb).catch(console.error);
    }
  });
}

console.log('Optimizing images under assets (jpg/png -> webp)');
walkImages(imagesDir);
console.log('Optimization started (async). Review output files when complete.');
