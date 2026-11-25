// Letter to the Registrar, Crawford University: request to use the Multipurpose Hall. On the TCBR letterhead.
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, AlignmentType, LevelFormat, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType } = d;
const [dir, out] = process.argv.slice(2);
const head = fs.readFileSync(path.join(dir, 'lh/head.png')), foot = fs.readFileSync(path.join(dir, 'lh/foot.png'));
const NAVY = '131838', FONT = 'Arial', MM = 56.6929, EMU_MM = 36000;
const T = (t, o = {}) => new TextRun({ text: t, ...o });
const runs = (text, base = {}) => text.split(/(\[[^\]]*\])/).filter(Boolean).map(p => p.startsWith('[') ? T(p, { ...base, highlight: 'yellow' }) : T(p, base));
const P = (text, o = {}) => new Paragraph({ spacing: { after: o.after ?? 160, line: 300 }, alignment: o.align || AlignmentType.JUSTIFIED, keepNext: o.keepNext, children: runs(text, o.run || {}) });
const L = (text, o = {}) => P(text, { align: AlignmentType.LEFT, after: 0, ...o });
const bullet = text => new Paragraph({ numbering: { reference: 'dots', level: 0 }, spacing: { after: 70, line: 290 }, children: runs(text) });

const kids = [
  L('Our ref: TCBR/TC/CU/001'),
  L('16 November 2026', { after: 240 }),
  L('The Registrar'),
  L('Crawford University'),
  L('Igbesa, Ogun State', { after: 240 }),
  L('Through: The Head of Department, Department of Mass Communication', { after: 240 }),
  L('Dear Sir/Ma,', { after: 200 }),
  new Paragraph({ spacing: { after: 200 }, children: [T('REQUEST FOR THE USE OF THE UNIVERSITY MULTIPURPOSE HALL FOR TECH & COMMS SEMINAR ON THURSDAY, 26 NOVEMBER 2026', { bold: true, underline: {}, color: NAVY })] }),
  P('We write to request the use of the University Multipurpose Hall for Tech & Comms, a practical seminar for students of the Department of Mass Communication, holding on Thursday, 26 November 2026.'),
  P('Tech & Comms is an initiative of The Comms Boardroom Technologies (TCBR), a Lagos-based communications technology company, organised in partnership with the Department of Mass Communication, under the leadership of the Head of Department, Dr. Dayo Odigie, and the Crawford University Alumni Association, led by its President, Mr. Victor Oluwafemi Adeniji. The seminar will bring practitioners to speak with students on communications in the real world, media monitoring and media intelligence, and building a personal brand, followed by a panel session and questions from students.'),
  P('The event was earlier planned for Legacy Hall. However, we have been informed that the number of Mass Communication students expected to attend may exceed its capacity. We are grateful that the Vice-Chancellor has given verbal approval for the event, and we now seek the Registry\'s formal approval for the use of the Multipurpose Hall.'),
  P('The details of our request are as follows:', { keepNext: true, after: 100 }),
  bullet('Date: Thursday, 26 November 2026.'),
  bullet('Programme time: [10:00 a.m.] to [12:00 noon].'),
  bullet('Access for set-up from [8:00 a.m.]; the hall will be cleared and handed back by [1:30 p.m.].'),
  bullet('Expected attendance: about [number] students, lecturers and guests.'),
  bullet('Facilities required: air-conditioning, the public address system, a projector and screen, at least two wireless microphones for questions from the floor, and power supply (with back-up) for the duration of the event.'),
  new Paragraph({ spacing: { after: 100 }, children: [] }),
  P('We will work with Mr. Victor Oluwafemi Adeniji and [full name of the multimedia officer] on air-conditioning and multimedia arrangements, as advised.'),
  P('We undertake to use the hall in line with University rules, to keep it clean and in good order, to restore any arrangement of seats and equipment after the event, and to bear any charges that may apply to its use [if applicable].'),
  P('We would be grateful for your written approval and for any guidance on the procedures we should follow. For further information, please contact the undersigned on 08160122896 or at info@thecommsboardroom.com.'),
  P('Thank you for your continued support for the development of our students.', { after: 280 }),
  L('Yours faithfully,', { after: 720 }),
  L('______________________________'),
  new Paragraph({ children: [T('Samuel Ogundeji', { bold: true, color: NAVY })] }),
  L('Founder and Lead Consultant, The Comms Boardroom Technologies'),
  L('Alumnus, Political Science and International Relations, Crawford University [Class of ____]', { after: 280 }),
  L('cc:', { run: { bold: true }, after: 60 }),
  L('The Vice-Chancellor, Crawford University', { after: 40 }),
  L('The Dean, [Faculty name]', { after: 40 }),
  L('The Head of Department, Mass Communication (Dr. Dayo Odigie)', { after: 40 }),
  L('The President, Crawford University Alumni Association (Mr. Victor Oluwafemi Adeniji)', { after: 40 }),
  L('The Director, Works and Services', { after: 40 }),
  L('The Head, [ICT / Media unit]', { after: 40 }),
];
function letterhead() {
  const w = Math.round(210 / 25.4 * 96);
  const img = (data, hpx, yMm) => new ImageRun({ type: 'png', data, transformation: { width: w, height: Math.round(w * hpx / 1414) },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yMm * EMU_MM) },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } });
  return new Header({ children: [new Paragraph({ children: [img(head, 360, 0), img(foot, 60, 1860 / 2000 * 297)] })] });
}
const doc = new Document({ creator: 'The Comms Boardroom Technologies', title: 'Letter to the Registrar - Use of the Multipurpose Hall',
  styles: { default: { document: { run: { font: FONT, size: 21, color: '1B2140' } } } },
  numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }] },
  sections: [{ properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
    margin: { top: Math.round(60 * MM), bottom: Math.round(30 * MM), left: Math.round(22 * MM), right: Math.round(22 * MM), header: Math.round(5 * MM), footer: Math.round(5 * MM) } } },
    headers: { default: letterhead() }, children: kids }] });
Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log(out); });
