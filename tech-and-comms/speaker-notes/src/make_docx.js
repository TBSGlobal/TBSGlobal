// Word versions of the speaker concept notes, on the TCBR letterhead (header + footer bars from the concept note).
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, LevelFormat, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType } = d;

const dir = process.argv[2], outDir = process.argv[3];
fs.mkdirSync(outDir, { recursive: true });
const C = JSON.parse(fs.readFileSync(path.join(dir, 'content.json'), 'utf8'));
const head = fs.readFileSync(path.join(dir, 'lh/head.png')), foot = fs.readFileSync(path.join(dir, 'lh/foot.png'));

const NAVY = '131838', BLUE = '5A7BFE', MUTED = '4B537A', LINE = 'CFD7F0', SOFT = 'F2F5FC';
const FONT = 'Arial';
const MM = 56.6929;                      // twips per mm
const PAGE_W = 210, MARGIN = 20, CONTENT_W = Math.round((PAGE_W - 2 * MARGIN) * MM);
const EMU_MM = 36000;

function unesc(s) { return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"); }
// "<b>x</b> y" → runs
function runs(html, base = {}) {
  const out = []; const re = /<b>(.*?)<\/b>/g; let last = 0, m;
  while ((m = re.exec(html))) {
    if (m.index > last) out.push(new TextRun({ text: unesc(html.slice(last, m.index)), ...base }));
    out.push(new TextRun({ text: unesc(m[1]), bold: true, color: NAVY, ...base }));
    last = re.lastIndex;
  }
  if (last < html.length) out.push(new TextRun({ text: unesc(html.slice(last)), ...base }));
  return out;
}
const P = (html, opt = {}) => new Paragraph({ children: runs(html, opt.run || {}), spacing: { after: 120, line: 300 }, ...opt.p });
const bullet = (html, keep) => new Paragraph({ children: runs(html), numbering: { reference: 'dots', level: 0 }, spacing: { after: 70, line: 290 }, keepNext: !!keep, keepLines: true });
const list = (items) => items.map((x, i) => bullet(x, i < items.length - 1));
function H(num, text) {
  return new Paragraph({ heading: d.HeadingLevel.HEADING_2, keepNext: true, keepLines: true,
    children: [new TextRun({ text: num + '  ', color: BLUE }), new TextRun({ text: unesc(text) })] });
}
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const hair = { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F8' };
function cell(children, w, opt = {}) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, children,
    margins: { top: 70, bottom: 70, left: opt.left ?? 0, right: 120 },
    borders: { top: none, left: none, right: none, bottom: hair }, shading: opt.shade, verticalAlign: d.VerticalAlign.TOP });
}
function factsTable(rows) {
  const w1 = Math.round(32 * MM), w2 = CONTENT_W - w1;
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [w1, w2],
    rows: rows.map(([k, v]) => new TableRow({ cantSplit: true, children: [
      cell([new Paragraph({ children: [new TextRun({ text: k.toUpperCase(), bold: true, size: 14, color: MUTED, characterSpacing: 30 })] })], w1),
      cell([new Paragraph({ children: runs(v, { size: 18 }) })], w2)] })) });
}
function flowTable(rows) {
  const w0 = Math.round(9 * MM), w1 = Math.round(36 * MM), w2 = CONTENT_W - w0 - w1;
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [w0, w1, w2],
    rows: rows.map(([a, b], i) => new TableRow({ cantSplit: true, children: [
      cell([new Paragraph({ children: [new TextRun({ text: String(i + 1), bold: true, color: BLUE, size: 18 })] })], w0, { left: 80 }),
      cell([new Paragraph({ children: [new TextRun({ text: unesc(a), bold: true, color: NAVY, size: 18 })] })], w1),
      cell([new Paragraph({ children: runs(b, { size: 18 }) })], w2)] })) });
}
function shadedBox(paras) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: CONTENT_W, type: WidthType.DXA }, children: paras, shading: { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' },
      margins: { top: 140, bottom: 100, left: 200, right: 200 },
      borders: { top: none, right: none, bottom: none, left: { style: BorderStyle.SINGLE, size: 18, color: BLUE } } })] })] });
}

function letterhead() {
  const w = Math.round(PAGE_W / 25.4 * 96);           // px at 96 dpi, Word's unit for ImageRun
  const img = (data, hpx, yMm) => new ImageRun({ type: 'png', data, transformation: { width: w, height: Math.round(w * hpx / 1414) },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
      verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yMm * EMU_MM) },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } });
  return new Header({ children: [new Paragraph({ children: [img(head, 360, 0), img(foot, 60, 1860 / 2000 * 297)] })] });
}

function doc(s) {
  const E = C.EVENT;
  const facts = [['Date', E.date], ['Venue', E.venue], ['Your role', s.role], ['Your session', s.topic],
    ['Length', s.length + ' (final timings to be confirmed)'], ['Audience', E.audience], ['Format', E.format], ['Partners', E.partners]];
  const body = [
    new Paragraph({ children: [new TextRun({ text: ('Tech & Comms · Speaker concept note · ' + s.kicker).toUpperCase(), bold: true, size: 15, color: BLUE, characterSpacing: 40 })], spacing: { after: 80 } }),
    new Paragraph({ heading: d.HeadingLevel.TITLE, children: [new TextRun(unesc(s.topic))] }),
    new Paragraph({ children: [new TextRun({ text: 'Where Communications Meet Technology', italics: true, size: 24, color: MUTED, font: 'Georgia' })], spacing: { after: 160 } }),
    new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 6 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } },
      spacing: { after: 160 }, children: [new TextRun({ text: s.name, bold: true, size: 24, color: NAVY }), new TextRun({ text: '     ' + s.role.toUpperCase(), bold: true, size: 15, color: BLUE, characterSpacing: 30 })] }),
    factsTable(facts),
    H('01', 'About Tech & Comms'), P(C.ABOUT),
  ];
  if (s.host) { body.push(shadedBox([P(s.host, { p: { spacing: { after: 0 } } })])); }
  let n = 2; const num = () => String(n++).padStart(2, '0');
  const isTalk = !!s.flow;
  body.push(H(num(), isTalk ? 'Why this session matters' : 'Why you are on the panel'), ...s.why.map(x => P(x)));
  body.push(H(num(), isTalk ? 'What we would love you to cover' : 'Your angle on the panel'), ...list(s.cover));
  if (isTalk) {
    body.push(H(num(), 'Suggested flow'), flowTable(s.flow),
      P('A suggestion only. Shape it around your own stories.', { run: { size: 17, color: MUTED, italics: true }, p: { spacing: { before: 80, after: 120 } } }));
  } else {
    body.push(H(num(), 'Questions the moderator may ask you'),
      P("The host moderates. You won't be asked every question; they're here so you can prepare."),
      ...s.panel_q.map(([t, q]) => new Paragraph({ numbering: { reference: 'nums', level: 0 }, spacing: { after: 80, line: 290 }, keepLines: true,
        children: [new TextRun({ text: ' ' + t.toUpperCase() + ' ', bold: true, size: 14, color: NAVY, shading: { type: ShadingType.CLEAR, fill: 'FFD60A', color: 'auto' }, characterSpacing: 20 }), new TextRun({ text: '  ' + unesc(q) })] })));
  }
  body.push(H(num(), 'What students should leave with'), shadedBox(list(s.takeaways)));
  if (s.questions) body.push(H(num(), 'Questions students may ask you'), ...list(s.questions));
  body.push(H(num(), 'Tone and approach'), ...list(C.TONE));
  body.push(H(num(), 'What we need from you'), ...list(C.NEEDS));
  body.push(new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 8 } }, spacing: { before: 360, after: 160 }, keepNext: true,
      children: [new TextRun('Thank you for giving your time to the next generation of communicators.')] }),
    new Paragraph({ keepNext: true, children: [new TextRun({ text: 'Samuel Ogundeji', bold: true, color: NAVY })] }),
    new Paragraph({ keepNext: true, children: [new TextRun('Founder & Lead Strategist, The Comms Boardroom Technologies (TCBR)')] }),
    new Paragraph({ children: [new TextRun('08160122896 · info@thecommsboardroom.com · www.thecommsboardroom.com')] }));

  return new Document({
    creator: 'Samuel Ogundeji, The Comms Boardroom', title: 'Tech and Comms Speaker Concept Note - ' + s.name,
    styles: {
      default: { document: { run: { font: FONT, size: 19, color: '1B2140' } } },
      paragraphStyles: [
        { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 38, bold: true, color: NAVY },
          paragraph: { spacing: { before: 0, after: 60 }, keepNext: true } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 22, bold: true, color: NAVY },
          paragraph: { spacing: { before: 300, after: 120 }, keepNext: true } },
      ],
    },
    numbering: { config: [
      { reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } }, run: { color: BLUE } } }] },
      { reference: 'nums', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 400, hanging: 400 } }, run: { bold: true, color: BLUE } } }] },
    ] },
    sections: [{
      properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
        margin: { top: Math.round(62 * MM), bottom: Math.round(26 * MM), left: Math.round(MARGIN * MM), right: Math.round(MARGIN * MM), header: Math.round(5 * MM), footer: Math.round(5 * MM) } } },
      headers: { default: letterhead() },
      children: body,
    }],
  });
}

(async () => {
  for (const s of C.SPEAKERS) {
    const file = path.join(outDir, `Tech and Comms Speaker Concept Note - ${s.name}.docx`);
    fs.writeFileSync(file, await Packer.toBuffer(doc(s)));
    console.log(file);
  }
})();
