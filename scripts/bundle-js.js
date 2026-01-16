const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// JS files in load order
const jsFiles = [
  // GameOn framework
  'gameon/static/js/jquery-1.9.1.min.js',
  'gameon/static/js/jquery.blockUI.js',
  'gameon/static/bower_components/bootstrap/dist/js/bootstrap.min.js',
  'gameon/static/js/lib/soundmanager/script/soundmanager2-nodebug-jsmin.js',
  'gameon/static/js/lib/loopj-jquery-simple-slider-fa64f59/js/simple-slider.min.js',
  'gameon/static/js/Queue.js',
  'gameon/static/js/utils.js',
  'gameon/static/js/wordutils.js',
  'gameon/static/js/gameon.js',
  // MMOChess dependencies
  'static/bower_components/underscore/underscore.js',
  'static/bower_components/backbone/backbone.js',
  'static/bower_components/nunjucks/browser/nunjucks.js',
  // MMOChess app
  'static/js/templates.js',
  'static/js/router.js',
  'static/js/evutils.js',
  'static/js/views/views.js',
  'static/js/game.js',
];

// Ensure dist directory exists
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

// Read and concatenate all JS files
let bundledJs = '// MMOChess Desktop Bundle\n// Generated: ' + new Date().toISOString() + '\n\n';

// Add fixtures inline (from jsvars macro)
bundledJs += `
window.fixtures = (function () {
    "use strict";
    var self = {};
    self.pieces = {
        'queen': '♚',
        'king': '♛',
        'castle': '♜',
        'bishop': '♝',
        'horse': '♞',
        'pawn': '♟'
    };
    self.piecesPower = {
        'king': 200,
        'queen': 9,
        'castle': 5,
        'bishop': 4.5,
        'horse': 4,
        'pawn': 1
    };
    return self;
})();

`;

for (const file of jsFiles) {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    bundledJs += `\n// === ${file} ===\n`;
    bundledJs += content;
    bundledJs += '\n';
    console.log(`✓ Added: ${file}`);
  } else {
    console.warn(`⚠ Missing: ${file}`);
  }
}

// Configure SoundManager for desktop
bundledJs += `
// SoundManager2 Desktop Configuration
if (typeof soundManager !== 'undefined') {
  soundManager.setup({
    url: './gameon/static/js/lib/soundmanager/swf/',
    flashVersion: 9,
    preferFlash: false,
    useHTML5Audio: true
  });
}
`;

// Write bundled JS
const outputPath = path.join(DIST, 'bundle.js');
fs.writeFileSync(outputPath, bundledJs);
console.log(`\n✓ Bundle written to: ${outputPath}`);
console.log(`  Size: ${(bundledJs.length / 1024).toFixed(2)} KB`);
