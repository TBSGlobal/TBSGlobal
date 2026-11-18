// CorelDRAW-safe export of the 8 x 8 in Agba Creator fan: node corel.js <outdir>
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch();
  for (const [id, name] of [['a8front', 'Front'], ['a8back', 'Back']]) {
    const p = await b.newPage({ viewport: { width: 792, height: 792 } });
    await p.goto('file://' + path.join(__dirname, 'print.html'));
    await p.evaluate(() => document.body.classList.add('corel'));
    await p.evaluate(id => show(id), id); await p.evaluate(() => document.fonts.ready); await p.evaluate(id => show(id), id); await p.waitForTimeout(300);
    await p.pdf({ path: path.join(out, name + '.pdf'), width: '8.25in', height: '8.25in', printBackground: true, pageRanges: '1' });
    await p.close(); console.log(name);
  }
  await b.close();
})();
