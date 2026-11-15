// Press release drafts on the TCBR letterhead, one .docx each.
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, ShadingType, BorderStyle, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, AlignmentType, LevelFormat } = d;
const RELEASES = require('./press_content.js');
const dir = process.argv[2], outDir = process.argv[3];
const head = fs.readFileSync(path.join(dir, 'lh/head.png')), foot = fs.readFileSync(path.join(dir, 'lh/foot.png'));
const NAVY = '131838', BLUE = '5A7BFE', MUTED = '4B537A', SOFT = 'F2F5FC', FONT = 'Arial', MM = 56.6929, EMU_MM = 36000;
const T = (t, o = {}) => new TextRun({ text: t, ...o });
// split text into runs, highlighting [bracketed] placeholders in yellow
const runs = (text, base = {}) => text.split(/(\[[^\]]*\])/).filter(Boolean).map(p => p.startsWith('[') ? T(p, { ...base, highlight: 'yellow' }) : T(p, base));
function letterhead() {
  const w = Math.round(210 / 25.4 * 96);
  const img = (data, hpx, yMm) => new ImageRun({ type: 'png', data, transformation: { width: w, height: Math.round(w * hpx / 1414) },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yMm * EMU_MM) },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } });
  return new Header({ children: [new Paragraph({ children: [img(head, 360, 0), img(foot, 60, 1860 / 2000 * 297)] })] });
}
function doc(r) {
  const kids = [
    new Paragraph({ spacing: { after: 60 }, children: [T('PRESS RELEASE · DRAFT', { bold: true, size: 15, color: BLUE, characterSpacing: 40 }), T('     ' + r.angle, { size: 15, color: MUTED })] }),
    new Paragraph({ spacing: { after: 160 }, children: [T('FOR IMMEDIATE RELEASE', { bold: true, size: 17, color: NAVY })] }),
    new Paragraph({ heading: d.HeadingLevel.TITLE, children: [T(r.headlines[0])] }),
    new Paragraph({ spacing: { after: 200, line: 300 }, children: [T(r.standfirst, { italics: true, size: 22, color: MUTED })] }),
    ...r.body.flatMap(p => p.split('\n').map((line, i, a) => new Paragraph({ spacing: { after: i === a.length - 1 ? 160 : 60, line: 320 },
      indent: line.startsWith('•') ? { left: 360, hanging: 220 } : undefined, children: runs(line, { size: 21 }) }))),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 200 }, children: [T('– ENDS –', { bold: true, color: NAVY })] }),
    ...r.about.flatMap(([h, t]) => [new Paragraph({ keepNext: true, spacing: { before: 120, after: 60 }, children: [T(h, { bold: true, color: NAVY, size: 19 })] }),
      new Paragraph({ spacing: { after: 100, line: 290 }, children: runs(t, { size: 18 }) })]),
    new Paragraph({ spacing: { before: 120 }, children: runs(r.contact, { size: 18, bold: true, color: NAVY }) }),
    // editor's box: alternative headlines + how this draft was built
    new Paragraph({ spacing: { before: 360, after: 80 }, keepNext: true, border: { top: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 8 } },
      children: [T('FOR TCBR ONLY · REMOVE BEFORE SENDING', { bold: true, size: 15, color: BLUE, characterSpacing: 30 })] }),
    new Paragraph({ keepNext: true, spacing: { after: 60 }, children: [T('Alternative headlines', { bold: true, size: 18, color: NAVY })] }),
    ...r.headlines.slice(1).map(h => new Paragraph({ keepNext: true, numbering: { reference: 'dots', level: 0 }, spacing: { after: 40 }, children: [T(h, { size: 18 })] })),
    new Paragraph({ spacing: { before: 100 }, children: [T(r.model + ' Text highlighted in yellow must be filled in or confirmed.', { size: 17, color: MUTED, italics: true })] }),
  ];
  return new Document({ creator: 'The Comms Boardroom', title: r.file,
    styles: { default: { document: { run: { font: FONT, size: 21, color: '1B2140' } } }, paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 36, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 120 }, keepNext: true } }] },
    numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 340, hanging: 220 } }, run: { color: BLUE } } }] }] },
    sections: [{ properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
      margin: { top: Math.round(62 * MM), bottom: Math.round(26 * MM), left: Math.round(22 * MM), right: Math.round(22 * MM), header: Math.round(5 * MM), footer: Math.round(5 * MM) } } },
      headers: { default: letterhead() }, children: kids }] });
}
(async () => { fs.mkdirSync(outDir, { recursive: true });
  for (const r of RELEASES) { const f = path.join(outDir, r.file + '.docx'); fs.writeFileSync(f, await Packer.toBuffer(doc(r))); console.log(f); } })();
