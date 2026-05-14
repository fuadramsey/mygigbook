// MyGigBook build script
const fs = require('fs');
const { execSync } = require('child_process');

const src = fs.readFileSync('index.html', 'utf8');

// ── Extract and minify CSS ──
const cssMatch = src.match(/<style>([\s\S]*?)<\/style>/);
if (!cssMatch) { console.error('No <style> found'); process.exit(1); }
const rawCSS = cssMatch[1];
fs.writeFileSync('/tmp/mgb.css', rawCSS);
execSync('cleancss -o /tmp/mgb.min.css /tmp/mgb.css');
const minCSS = fs.readFileSync('/tmp/mgb.min.css', 'utf8');
console.log(`CSS: ${rawCSS.length} → ${minCSS.length} bytes (${Math.round((1-minCSS.length/rawCSS.length)*100)}% reduction)`);

// ── Extract largest <script> block ──
const scriptMatches = [...src.matchAll(/<script(?! type)(?![^>]*type)[^>]*>([\s\S]*?)<\/script>/g)];
const largest = scriptMatches.reduce((a, b) => b[1].length > a[1].length ? b : a);
const rawJS = largest[1];
fs.writeFileSync('/tmp/mgb.js', rawJS);

// ── Minify JS — compress only, NO name mangling ──
// Mangling renames functions but HTML onclick= handlers use original names
execSync([
  'terser /tmp/mgb.js',
  '--compress',
  '--no-rename',
  '--output /tmp/mgb.min.js'
].join(' '));

const minJS = fs.readFileSync('/tmp/mgb.min.js', 'utf8');
console.log(`JS:  ${rawJS.length} → ${minJS.length} bytes (${Math.round((1-minJS.length/rawJS.length)*100)}% reduction)`);

// ── Reassemble ──
let out = src;
out = out.replace(cssMatch[0], `<style>${minCSS}</style>`);
out = out.replace(largest[0], `<script>${minJS}</script>`);

// ── Write output ──
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', out);

['sw.js', 'manifest.json', 'icon192.png', 'icon512.png'].forEach(f => {
  if (fs.existsSync(f)) { fs.copyFileSync(f, `dist/${f}`); console.log(`Copied: ${f}`); }
});

const original = src.length;
const result = out.length;
console.log(`\nTotal: ${original} → ${result} bytes (${Math.round((1-result/original)*100)}% reduction)`);
console.log('Output: dist/');
