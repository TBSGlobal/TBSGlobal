// Certificates of participation.
//   node render.js <outdir>                 -> blank certificate (PDF + PNG) and a named sample
//   node render.js <outdir> names.txt       -> one PDF with a certificate per name (one name per line,
//                                              or a CSV export of the Registrations sheet: the "Name" column is used)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
function readNames(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];
  const head = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase());
  const col = head.findIndex((h) => /name/.test(h) && !/school|university/.test(h));
  const rows = col >= 0 && lines[0].includes(',') ? lines.slice(1).map((l) => (l.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || [])[col] || '') : lines;
  const seen = new Set();
  return rows.map((n) => n.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim().replace(/\s+/g, ' '))
    .filter((n) => n && !seen.has(n.toLowerCase()) && seen.add(n.toLowerCase()));
}
(async () => {
  const [out, namesFile] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: 3 });
  await p.goto('file://' + path.join(__dirname, 'certificate.html')); await p.evaluate(() => document.fonts.ready);
  const fit = () => p.evaluate(() => document.querySelectorAll('.name span').forEach((s) => { let f = 12; while (s.scrollWidth > s.parentElement.clientWidth && f > 6) { f -= .25; s.style.fontSize = f + 'mm'; } }));
  const pdf = (file) => p.pdf({ path: path.join(out, file), width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
  if (namesFile) {
    const names = readNames(namesFile); await p.evaluate((n) => build(n), names); await p.waitForTimeout(500); await fit();
    await pdf('Certificates - All Participants.pdf'); console.log(names.length, 'certificates');
  } else {
    await p.evaluate(() => build([])); await p.waitForTimeout(400);
    await pdf('Certificate of Participation - Blank.pdf'); await p.screenshot({ path: path.join(out, 'Certificate of Participation - Blank.png') });
    await p.evaluate(() => build(['Adaeze Chiamaka Okonkwo'])); await p.waitForTimeout(300); await fit();
    await pdf('Certificate of Participation - Sample.pdf'); await p.screenshot({ path: path.join(out, 'Certificate of Participation - Sample.png') });
    console.log('blank + sample');
  }
  await b.close();
})();
