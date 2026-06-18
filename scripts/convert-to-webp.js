/**
 * convert-to-webp.js
 * Run once: node scripts/convert-to-webp.js
 * Converts all PNG/JPG assets to WebP (quality 82) for massive size reduction.
 * Originals are kept — only WebP versions are added.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets');
const QUALITY = 82;

async function convertAll() {
  const files = fs.readdirSync(ASSETS_DIR).filter(f =>
    (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')) &&
    !f.endsWith('.webp') &&
    f !== 'test_1781771525437.png'  // skip empty test file
  );

  console.log(`\nConverting ${files.length} images to WebP (quality ${QUALITY})...\n`);

  let totalOriginal = 0;
  let totalWebP = 0;

  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const outName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(ASSETS_DIR, outName);

    const originalSize = fs.statSync(inputPath).size;

    try {
      await sharp(inputPath)
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(outputPath);

      const webpSize = fs.statSync(outputPath).size;
      const saving = Math.round((1 - webpSize / originalSize) * 100);

      totalOriginal += originalSize;
      totalWebP += webpSize;

      console.log(
        `  ✓ ${file.padEnd(45)} ${(originalSize/1024).toFixed(0).padStart(5)} KB  →  ${(webpSize/1024).toFixed(0).padStart(5)} KB  (${saving}% smaller)`
      );
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  const totalSaving = Math.round((1 - totalWebP / totalOriginal) * 100);
  console.log('\n' + '─'.repeat(70));
  console.log(`  TOTAL  ${(totalOriginal/1024/1024).toFixed(1)} MB  →  ${(totalWebP/1024/1024).toFixed(1)} MB  (${totalSaving}% saved)\n`);
}

convertAll().catch(console.error);
