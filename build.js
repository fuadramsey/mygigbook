// MyGigBook build script — no minification (safe mode)
const fs = require('fs');

const src = fs.readFileSync('index.html', 'utf8');

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', src);

['sw.js', 'manifest.json', 'icon192.png', 'icon512.png'].forEach(f => {
  if (fs.existsSync(f)) { fs.copyFileSync(f, `dist/${f}`); console.log(`Copied: ${f}`); }
});

console.log(`Output: dist/index.html (${src.length} bytes, unminified)`);
