// Renders screens.html: node render.js <outdir> [preview]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const out = process.argv[2], preview = process.argv[3] === 'preview'; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: preview ? 0.25 : 1 });
  await p.goto('file://' + path.join(__dirname, 'screens.html')); await p.evaluate(() => document.fonts.ready);
  const list = await p.evaluate(() => SLIDES); const names = [];
  for (let i = 0; i < list.length; i++) {
    await p.evaluate(i => show(i), i); await p.evaluate(() => Promise.all([...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r; }))));
    await p.waitForTimeout(60);
    const f = `${String(i + 1).padStart(2, '0')} - ${list[i][1]}.png`; await p.screenshot({ path: path.join(out, f) }); names.push([list[i][0], f]);
  }
  fs.writeFileSync(path.join(out, 'order.json'), JSON.stringify(names, null, 1)); await b.close(); console.log(list.length, 'slides');
})();
