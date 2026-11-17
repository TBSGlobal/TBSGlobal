// Renders print.html: node render.js <outdir> [preview]
// PDFs are vector (text and shapes stay sharp at any size); PNGs are for quick checks and printers who want images.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const out = process.argv[2], preview = process.argv[3] === 'preview';
const ONLY = process.argv[4];
const JOBS = [
  // id, file name, width in, height in, png dpi
  ['backdrop', 'Backdrop Banner 7ft x 5ft', 84, 60, 72],
  ['placard', 'Instagram Placard 2ft x 3ft', 24, 36, 150],
  ['fanback', 'Hand Fan - Back (all fans)', 8.25, 8.25, 300],
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(k => ['fan' + k, `Hand Fan ${k} - Front`, 8.25, 8.25, 300]),
];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  for (const [id, name, w, h, dpi] of JOBS.filter(j => !ONLY || j[0] === ONLY)) {
    const scale = preview ? 900 / (Math.max(w, h) * 96) : dpi / 96;
    const p = await b.newPage({ viewport: { width: Math.round(w * 96), height: Math.round(h * 96) }, deviceScaleFactor: scale });
    await p.goto('file://' + path.join(__dirname, 'print.html'));
    await p.evaluate(id => show(id), id); await p.evaluate(() => document.fonts.ready); await p.evaluate(id => show(id), id); await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(out, name + '.png') });
    if (!preview) await p.pdf({ path: path.join(out, name + '.pdf'), width: w + 'in', height: h + 'in', printBackground: true, pageRanges: '1' });
    await p.close(); console.log(name);
  }
  await b.close();
})();
