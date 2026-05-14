// MyGigBook build script — copy only, no minification
const fs = require('fs');
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', fs.readFileSync('index.html', 'utf8'));
['sw.js','manifest.json','icon192.png','icon512.png'].forEach(f => {
  if (fs.existsSync(f)) { fs.copyFileSync(f, `dist/${f}`); console.log(`Copied: ${f}`); }
});
console.log('Done.');
