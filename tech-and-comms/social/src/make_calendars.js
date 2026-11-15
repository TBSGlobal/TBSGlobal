// Builds "Tech and Comms Design Content Calendar.docx" and "Tech and Comms Video Content Calendar.docx".
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, VerticalAlign, AlignmentType, LevelFormat, PageBreak } = d;
const { DESIGN_POSTS, REELS, VIDEOS } = require('./calendar_content.js');
const dir = process.argv[2], outDir = process.argv[3];
const head = fs.readFileSync(path.join(dir, 'lh/head.png')), foot = fs.readFileSync(path.join(dir, 'lh/foot.png'));
const NAVY = '131838', BLUE = '5A7BFE', MUTED = '4B537A', SOFT = 'F2F5FC', YELLOW = 'FFD60A', FONT = 'Arial', MM = 56.6929, CW = Math.round(170 * MM), EMU_MM = 36000;
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, hair = { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F8' };
const T = (t, o = {}) => new TextRun({ text: t, ...o });
const P = (c, o = {}) => new Paragraph({ children: Array.isArray(c) ? c : [T(c)], spacing: { after: 80, line: 280 }, ...o });
// multi-line text → paragraphs (keeps \n as separate lines)
const lines = (text, run = {}) => text.split('\n').map((l, i, a) => new Paragraph({ spacing: { after: i === a.length - 1 ? 100 : 0, line: 280 }, children: [T(l, run)] }));
function cell(children, w, o = {}) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, children, verticalAlign: VerticalAlign.TOP, columnSpan: o.span,
    margins: { top: 80, bottom: 80, left: 110, right: 110 }, shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
    borders: { top: none, left: none, right: none, bottom: hair } });
}
function table(widths, rows, header) {
  const tr = [];
  if (header) tr.push(new TableRow({ tableHeader: true, cantSplit: true, children: header.map((h, i) => cell([P([T(h.toUpperCase(), { bold: true, size: 14, color: 'FFFFFF', characterSpacing: 25 })], { spacing: { after: 0 } })], widths[i], { fill: NAVY })) }));
  rows.forEach(r => tr.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(Array.isArray(c) ? c : [P([T(c, { size: 17 })], { spacing: { after: 0 } })], widths[i])) })));
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: widths, rows: tr });
}
const H1 = t => new Paragraph({ heading: d.HeadingLevel.TITLE, children: [T(t)] });
const H2 = (n, t) => new Paragraph({ heading: d.HeadingLevel.HEADING_2, keepNext: true, children: [T(n ? n + '  ' : '', { color: BLUE }), T(t)] });
const H3 = t => new Paragraph({ keepNext: true, spacing: { before: 140, after: 50 }, children: [T(t.toUpperCase(), { bold: true, size: 15, color: BLUE, characterSpacing: 30 })] });
const bullets = items => items.map(x => new Paragraph({ numbering: { reference: 'dots', level: 0 }, spacing: { after: 50, line: 270 }, children: [T(x, { size: 18 })] }));
const kicker = t => P([T(t.toUpperCase(), { bold: true, size: 15, color: BLUE, characterSpacing: 40 })], { spacing: { after: 80 } });
function postHeader(date, title, sub) {
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [Math.round(32 * MM), CW - Math.round(32 * MM)], rows: [new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: Math.round(32 * MM), type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' }, verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 140, right: 100 }, borders: { top: none, bottom: none, left: none, right: none }, children: [P([T(date, { bold: true, color: 'FFFFFF', size: 20 })], { spacing: { after: 0 } })] }),
    new TableCell({ width: { size: CW - Math.round(32 * MM), type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' }, verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 160, right: 100 }, borders: { top: none, bottom: none, left: none, right: none },
      children: [P([T(title, { bold: true, color: NAVY, size: 22 })], { spacing: { after: sub ? 20 : 0 } }), ...(sub ? [P([T(sub, { size: 16, color: MUTED })], { spacing: { after: 0 } })] : [])] })] })] });
}
function letterhead() {
  const w = Math.round(210 / 25.4 * 96);
  const img = (data, hpx, yMm) => new ImageRun({ type: 'png', data, transformation: { width: w, height: Math.round(w * hpx / 1414) },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yMm * EMU_MM) },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } });
  return new Header({ children: [new Paragraph({ children: [img(head, 360, 0), img(foot, 60, 1860 / 2000 * 297)] })] });
}
function build(title, children) {
  return new Document({ creator: 'The Comms Boardroom', title,
    styles: { default: { document: { run: { font: FONT, size: 19, color: '1B2140' } } }, paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 40, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 60 }, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 22, bold: true, color: NAVY }, paragraph: { spacing: { before: 300, after: 120 }, keepNext: true } }] },
    numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 340, hanging: 220 } }, run: { color: BLUE } } }] }] },
    sections: [{ properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
      margin: { top: Math.round(62 * MM), bottom: Math.round(26 * MM), left: Math.round(20 * MM), right: Math.round(20 * MM), header: Math.round(5 * MM), footer: Math.round(5 * MM) } } },
      headers: { default: letterhead() }, children }] });
}

// ---------- 1. Design calendar ----------
const dc = [kicker('Tech & Comms · LinkedIn and Instagram'), H1('Design Content Calendar'),
  P([T('16 November to 1 December 2026. Times are Lagos time. The posting order follows the designs: flyer, partnership, speakers, topics, countdown, event day, thank you, and the 2027 call. The talking-head videos are in a separate calendar and fill the days in between.', { size: 18, color: MUTED })], { spacing: { after: 160 } }),
  H2('', 'At a glance'),
  table([Math.round(26 * MM), Math.round(62 * MM), Math.round(40 * MM), CW - Math.round(128 * MM)],
    [...DESIGN_POSTS.map(p => [p.date, p.title, p.format, p.time]), ...REELS.map(r => [r[0], r[1] + ' (existing video)', 'Video', r[3]])]
      .sort((a, b) => order(a[0]) - order(b[0])), ['Date', 'Post', 'Format', 'Platforms and time']),
  H2('', 'Before you start'),
  ...bullets([
    'LinkedIn does not post image carousels. Upload the carousel PDFs ("Tech and Comms Speakers Carousel.pdf", "Tech and Comms Topics Carousel.pdf") as a document post, and give the document a title such as "Meet the voices of Tech & Comms".',
    'Instagram: post carousels as images in the order listed. Put tech-and-comms.vercel.app in the bio.',
    'Best times: LinkedIn on weekday mornings (9 to 10 AM); Instagram in the evening (7 to 9 PM). Reply to comments in the first hour.',
    'Tag the partners and speakers in every post that features them, and ask them to reshare.',
    'Square bracket text such as [10:00 AM] must be confirmed or filled in before posting.',
  ]),
];
DESIGN_POSTS.forEach((p, i) => {
  dc.push(new Paragraph({ children: [new PageBreak()] }), postHeader(p.date, `${String(i + 1).padStart(2, '0')}  ${p.title}`, `${p.format} · ${p.time}`));
  dc.push(H3('Design'), P([T(p.asset, { size: 18 })]));
  dc.push(H3('LinkedIn caption'), ...p.li.flatMap(x => lines(x, { size: 18 })));
  dc.push(H3('Instagram caption'), ...p.ig.flatMap(x => lines(x, { size: 18 })));
  if (p.notes.length) dc.push(H3('Notes'), ...bullets(p.notes));
});
dc.push(new Paragraph({ children: [new PageBreak()] }), H2('', 'Existing videos to slot in'),
  table([Math.round(26 * MM), Math.round(46 * MM), Math.round(60 * MM), CW - Math.round(132 * MM)], REELS.map(r => [r[0], r[1], r[2], r[3]]), ['Date', 'Video', 'File', 'Where']),
  P([T('Caption idea for each topic reel: the topic title, one line from its script, and "26 Nov · Legacy Hall, Crawford University". For the register reel, reuse the 30 Nov caption.', { size: 17, color: MUTED })], { spacing: { before: 120 } }));

function order(s) { const m = s.match(/(\d+) (Nov|Dec)/); return (m[2] === 'Dec' ? 100 : 0) + (+m[1]); }

// ---------- 2. Video calendar ----------
const vc = [kicker('Tech & Comms · Daily videos'), H1('Video Content Calendar'),
  P([T('One short talking-head video a day from 16 November to 1 December, presented by Samuel Ogundeji. Each one is 40 to 60 seconds, vertical (9:16), and posted to Instagram Reels and LinkedIn. Scripts are written to be spoken; say them in your own words.', { size: 18, color: MUTED })], { spacing: { after: 160 } }),
  H2('', 'At a glance'),
  table([Math.round(24 * MM), Math.round(30 * MM), Math.round(70 * MM), CW - Math.round(124 * MM)], VIDEOS.map(v => [v.date, v.theme, v.title, v.pair]), ['Date', 'Theme', 'Video', 'Posts with']),
  H2('', 'How to film them'),
  ...bullets([
    'Say the hook in the first two seconds, before any intro or logo.',
    'Film vertically at eye level, facing a window or a ring light, with a lapel microphone if you have one.',
    'Add burned-in captions (CapCut or Instagram\'s auto-captions); most people watch on mute.',
    'Keep the on-screen text short and in the brand colours: navy, blue and yellow.',
    'Post natively on each platform rather than sharing a link. Instagram around 7 PM; LinkedIn around 9 AM the next morning works well for the same video.',
    'Square bracket text must be filled in before filming.',
  ]),
];
VIDEOS.forEach((v, i) => {
  if (i === 0) vc.push(new Paragraph({ children: [new PageBreak()] }));
  vc.push(new Paragraph({ keepNext: true, keepLines: true, spacing: { before: i === 0 ? 0 : 300, after: 60 },
    shading: { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' }, border: { left: { style: BorderStyle.SINGLE, size: 36, color: NAVY, space: 8 } },
    children: [T(v.date + '   ', { bold: true, color: BLUE, size: 20 }), T(`Day ${i + 1}  ${v.title}`, { bold: true, color: NAVY, size: 22 })] }));
  vc.push(P([T(`${v.theme} · posts with: ${v.pair}`, { size: 16, color: MUTED })], { keepNext: true }));
  vc.push(H3('Hook (first 2 seconds)'), P([T(v.hook, { bold: true, size: 20, color: NAVY })], { keepNext: true, keepLines: true }));
  vc.push(H3('Script'), P([T(v.script, { size: 19 })], { spacing: { after: 100, line: 300 }, keepNext: true, keepLines: true }));
  vc.push(P([T('ON-SCREEN TEXT   ', { bold: true, size: 14, color: MUTED, characterSpacing: 25 }), T(v.screen, { size: 17 })], { keepNext: true }));
  vc.push(P([T('CALL TO ACTION   ', { bold: true, size: 14, color: MUTED, characterSpacing: 25 }), T(v.cta, { size: 17 })]));
});

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, kids] of [['Tech and Comms Design Content Calendar', dc], ['Tech and Comms Video Content Calendar', vc]]) {
    const f = path.join(outDir, name + '.docx'); fs.writeFileSync(f, await Packer.toBuffer(build(name, kids))); console.log(f);
  }
})();
