import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const leg = PNG.sync.read(fs.readFileSync('reports/screenshots/legacy_about_ar_mobile.png'));
const mig = PNG.sync.read(fs.readFileSync('reports/screenshots/migrated_about_ar_mobile.png'));

console.log('Legacy:', leg.width, 'x', leg.height);
console.log('Migrated:', mig.width, 'x', mig.height);

const maxW = Math.max(leg.width, mig.width);
const maxH = Math.max(leg.height, mig.height);
const diff = new PNG({ width: maxW, height: maxH });

// Normalize
function norm(img) {
  const n = new PNG({ width: maxW, height: maxH });
  for (let i = 0; i < n.data.length; i += 4) {
    n.data[i] = 247; n.data[i+1] = 249; n.data[i+2] = 252; n.data[i+3] = 255;
  }
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const s = (img.width * y + x) << 2;
      const d = (maxW * y + x) << 2;
      n.data[d] = img.data[s];
      n.data[d+1] = img.data[s+1];
      n.data[d+2] = img.data[s+2];
      n.data[d+3] = img.data[s+3];
    }
  }
  return n;
}

const n1 = norm(leg);
const n2 = norm(mig);

const num = pixelmatch(n1.data, n2.data, diff.data, maxW, maxH, { threshold: 0.15 });
console.log('Mismatched pixels:', num, 'percent:', ((num / (maxW * maxH)) * 100).toFixed(2));
