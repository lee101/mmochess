const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// CSS files in load order
const cssFiles = [
  'gameon/static/bower_components/bootstrap/dist/css/bootstrap.min.css',
  'gameon/static/bower_components/font-awesome/css/font-awesome.min.css',
  'gameon/static/js/lib/loopj-jquery-simple-slider-fa64f59/css/simple-slider.css',
  'gameon/static/js/lib/loopj-jquery-simple-slider-fa64f59/css/simple-slider-volume.css',
  'gameon/static/css/gameon.css',
  'static/css/style.css',
];

// Ensure dist directory exists
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

// Read and concatenate all CSS files
let bundledCss = '/* MMOChess Desktop Bundle */\n/* Generated: ' + new Date().toISOString() + ' */\n\n';

for (const file of cssFiles) {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix font-awesome paths for desktop (paths relative to dist folder)
    if (file.includes('font-awesome')) {
      content = content.replace(/url\(['"]?\.\.\/fonts\//g, 'url(\'../gameon/static/bower_components/font-awesome/fonts/');
    }

    bundledCss += `\n/* === ${file} === */\n`;
    bundledCss += content;
    bundledCss += '\n';
    console.log(`✓ Added: ${file}`);
  } else {
    console.warn(`⚠ Missing: ${file}`);
  }
}

// Write bundled CSS
const outputPath = path.join(DIST, 'bundle.css');
fs.writeFileSync(outputPath, bundledCss);
console.log(`\n✓ Bundle written to: ${outputPath}`);
console.log(`  Size: ${(bundledCss.length / 1024).toFixed(2)} KB`);
