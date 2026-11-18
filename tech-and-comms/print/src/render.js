// Renders print.html: node render.js <outdir> [preview]
// PDFs are vector (text and shapes stay sharp at any size); PNGs are for quick checks and printers who want images.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const out = process.argv[2], preview = process.argv[3] === 'preview';
const ONLY = process.argv[4];
const JOBS = [
  // id, file name, width in, height in, png dpi
  ['backdrop', 'Backdrop Banner 7ft x 5ft', 84, 60, 72],
  ['placard', 'Instagram Placard 2ft x 3ft', 24, 36, 150],
  ['fanback', 'Hand Fan - Back (all fans)', 9.25, 8.65, 300],
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => ['fan' + k, `Hand Fan ${k} - Front`, 9.25, 8.65, 300]),
  ['fancut', 'Hand Fan - Cut Line Template', 9.25, 8.65, 150],
  ['a8front', 'Agba Creator/Hand Fan 8x8 - Agba Creator - Front', 8.25, 8.25, 300],
  ['a8back', 'Agba Creator/Hand Fan 8x8 - Back', 8.25, 8.25, 300],
  ['mockback', 'mock/Mockup - Back', 11, 14, 100, 'png'],
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => ['mock' + k, `mock/Mockup ${k}`, 11, 14, 100, 'png']),
];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [id, name, w, h, dpi, only] of JOBS.filter(j => !ONLY || j[0] === ONLY || (ONLY.endsWith('*') && j[0].startsWith(ONLY.slice(0, -1))))) {
    fs.mkdirSync(path.dirname(path.join(out, name)), { recursive: true });
    const scale = preview ? 900 / (Math.max(w, h) * 96) : dpi / 96;
    const p = await b.newPage({ viewport: { width: Math.round(w * 96), height: Math.round(h * 96) }, deviceScaleFactor: scale });
    await p.goto('file://' + path.join(__dirname, 'print.html'));
    await p.evaluate(id => show(id), id); await p.evaluate(() => document.fonts.ready); await p.evaluate(id => show(id), id); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, name + '.png') });
    if (!preview && only !== 'png') await p.pdf({ path: path.join(out, name + '.pdf'), width: w + 'in', height: h + 'in', printBackground: true, pageRanges: '1' });
    await p.close(); console.log(name);
  }
  await b.close();
})();
