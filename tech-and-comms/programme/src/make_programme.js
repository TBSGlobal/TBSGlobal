// Order of Programme for Tech & Comms at Crawford University, on the TCBR letterhead.
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Table, TableRow, TableCell, WidthType, ShadingType,
  BorderStyle, AlignmentType, LevelFormat, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, VerticalAlign } = d;

const dir = process.argv[2], out = process.argv[3];
const head = fs.readFileSync(path.join(dir, 'lh/head.png')), foot = fs.readFileSync(path.join(dir, 'lh/foot.png'));
const NAVY = '131838', BLUE = '5A7BFE', MUTED = '4B537A', LINE = 'CFD7F0', SOFT = 'F2F5FC', YELLOW = 'FFD60A';
const FONT = 'Arial', MM = 56.6929, CONTENT_W = Math.round(170 * MM), EMU_MM = 36000;

const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const hair = { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F8' };
const T = (text, o = {}) => new TextRun({ text, ...o });
const P = (children, o = {}) => new Paragraph({ children: Array.isArray(children) ? children : [T(children)], spacing: { after: 100, line: 290 }, ...o });
const H = (num, text) => new Paragraph({ heading: d.HeadingLevel.HEADING_2, keepNext: true, children: [T(num + '  ', { color: BLUE }), T(text)] });
const bullets = (items) => items.map((x, i) => new Paragraph({ numbering: { reference: 'dots', level: 0 }, keepNext: i < items.length - 1, keepLines: true,
  spacing: { after: 60, line: 280 }, children: Array.isArray(x) ? x : [T(x)] }));

function cell(children, w, o = {}) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, children, verticalAlign: VerticalAlign.TOP,
    margins: { top: 80, bottom: 80, left: 100, right: 100 }, shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
    borders: { top: none, left: none, right: none, bottom: hair } });
}

// ---- programme rows: [minutes, item, who, note, kind]
const ROWS = [
  [5, 'Welcome, opening prayer and recognition of guests', 'Host: Samuel Ogundeji', 'Sets the tone: honest conversations, not a lecture. Explains that all questions are held for the open Q&A at the end, and how the quiz draws work.', 'open'],
  [2, 'Opening message', 'Head of Department, Mass Communication (or a representative)', 'A short welcome on behalf of the department.', 'open'],
  [20, 'Talk 1: Communications: School vs Reality', 'Gabriel Ntoka', 'Topic 01.', 'talk'],
  [2, 'Quiz draw: Topic 01', 'Host', 'Two students each draw a question slip from the Topic 01 bowl and answer for a prize.', 'fun'],
  [20, 'Talk 2: Media Monitoring, Evaluation, Intelligence & Social Listening, and AI in Communications', 'Samuel Ogundeji', 'Topic 02. A team member introduces Samuel and keeps time during this talk.', 'talk'],
  [2, 'Quiz draw: Topic 02', 'Team member', 'Two students draw from the Topic 02 bowl.', 'fun'],
  [20, 'Talk 3: Building a Personal Brand', 'Onaopemipo Famori', 'Topic 03. Ends with the one-week challenge.', 'talk'],
  [2, 'Quiz draw: Topic 03', 'Host', 'Two students draw from the Topic 03 bowl.', 'fun'],
  [25, 'Panel session', 'Barnabas (You Media: the new media landscape) and Samuel Jegede (communications in humanitarian work); moderated by the host', 'From traditional media to You Media, and where a communications career can lead.', 'panel'],
  [15, 'Open Q&A (in the hall)', 'All speakers and panelists; host moderates', 'Students ask from the floor with a roving microphone. Take questions in groups of three, keep answers short, and give the "Best question" prize.', 'qa'],
  [7, 'Closing: recap, raffle, vote of thanks and group photo', 'Host; vote of thanks by a student representative', "Recap the takeaways, invite students to register their friends' schools at tech-and-comms.vercel.app, draw the raffle, then the group photo.", 'close'],
];
const START = 10 * 60;   // 10:00 AM; change here if the start time moves
const fmt = (m) => { const h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, '0')}`; };
const total = ROWS.reduce((a, r) => a + r[0], 0);
if (total !== 120) throw new Error('programme is ' + total + ' minutes');

function programmeTable() {
  const W = [Math.round(25 * MM), Math.round(13 * MM), Math.round(72 * MM)]; W.push(CONTENT_W - W[0] - W[1] - W[2]);
  const hdr = ['Time', 'Mins', 'Item', 'Led by'];
  const header = new TableRow({ tableHeader: true, cantSplit: true, children: hdr.map((h, i) => cell([P([T(h.toUpperCase(), { bold: true, size: 14, color: 'FFFFFF', characterSpacing: 30 })], { spacing: { after: 0 } })], W[i], { fill: NAVY })) });
  let t = START;
  const fill = { talk: 'FFFFFF', panel: 'FFFFFF', qa: 'FFFFFF', open: 'FFFFFF', close: 'FFFFFF', fun: 'FFF8D6' };
  const rows = [new TableRow({ cantSplit: true, children: [
    cell([P([T(`${fmt(START - 30)}–${fmt(START)}`, { bold: true, size: 17, color: NAVY })], { spacing: { after: 0 } })], W[0], { fill: SOFT }),
    cell([P([T('30', { size: 17, color: MUTED })], { spacing: { after: 0 } })], W[1], { fill: SOFT }),
    cell([P([T('Arrival, registration and photo wall', { bold: true, size: 18, color: NAVY })], { spacing: { after: 30 } }),
          P([T('Before the 2-hour programme. Music playing; students take photos at the backdrop and drop raffle slips.', { size: 16, color: MUTED })], { spacing: { after: 0 } })], W[2], { fill: SOFT }),
    cell([P([T('Ushers / TCBR team', { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: SOFT })] })];
  ROWS.forEach(([m, item, who, note, kind]) => {
    const tag = { talk: 'TALK', panel: 'PANEL', qa: 'Q&A', fun: 'QUIZ', open: '', close: '' }[kind];
    rows.push(new TableRow({ cantSplit: true, children: [
      cell([P([T(`${fmt(t)}–${fmt(t + m)}`, { bold: true, size: 17, color: NAVY })], { spacing: { after: 0 } })], W[0], { fill: fill[kind] }),
      cell([P([T(String(m), { size: 17, color: MUTED })], { spacing: { after: 0 } })], W[1], { fill: fill[kind] }),
      cell([P([...(tag ? [T(` ${tag} `, { bold: true, size: 13, color: kind === 'fun' ? NAVY : 'FFFFFF', shading: { type: ShadingType.CLEAR, fill: kind === 'fun' ? YELLOW : BLUE, color: 'auto' } }), T('  ')] : []),
              T(item, { bold: true, size: 18, color: NAVY })], { spacing: { after: 30 } }),
            P([T(note, { size: 16, color: MUTED })], { spacing: { after: 0 } })], W[2], { fill: fill[kind] }),
      cell([P([T(who, { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: fill[kind] })] }));
    t += m;
  });
  rows.push(new TableRow({ cantSplit: true, children: [
    cell([P([T(`${fmt(START)}–${fmt(t)}`, { bold: true, size: 17, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[0], { fill: BLUE }),
    cell([P([T(String(total), { bold: true, size: 17, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[1], { fill: BLUE }),
    cell([P([T('Total: 2 hours', { bold: true, size: 18, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[2], { fill: BLUE }),
    cell([P([T('', { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: BLUE })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
}

const FUN = [
  ['Tech & Comms photo wall', 'Before the start and after the close', 'A printed backdrop in the brand colours with the logo, "Where Communications Meet Technology" and the event hashtag, plus a few hand-held frames ("Future PR Lead", "Building My Brand"). Gives students something to post the same day.'],
  ['Free LinkedIn headshot corner', 'Arrival and after the close', 'One photographer, a plain wall and a ring light. Students leave with a usable profile photo, which ties straight into Talk 3.'],
  ['Raffle', 'Drawn at the close', 'Slips collected at arrival. Prize ideas: a one-on-one personal-brand or CV review, a mentorship call with a speaker, TCBR merchandise, or data bundles.'],
  ['"Best question" prize', 'Open Q&A', 'Speakers pick the best question from the floor. It encourages thoughtful questions and gets shy students talking.'],
  ['"Next campus" wall', 'Arrival and close', 'A board where students write which school Tech & Comms should visit next, with a QR code to tech-and-comms.vercel.app to register.'],
  ['Music between sessions', 'Arrival, transitions and the close', 'Upbeat Afrobeats or amapiano while speakers change over keeps the energy up.'],
];

function funTable() {
  const W = [Math.round(8 * MM), Math.round(48 * MM)]; W.push(CONTENT_W - W[0] - W[1]);
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows: FUN.map(([name, when, how], i) => new TableRow({ cantSplit: true, children: [
    cell([P([T(String(i + 1), { bold: true, color: BLUE, size: 18 })], { spacing: { after: 0 } })], W[0]),
    cell([P([T(name, { bold: true, size: 18, color: NAVY })], { spacing: { after: 30 } }), P([T(when, { size: 15, color: MUTED, italics: true })], { spacing: { after: 0 } })], W[1]),
    cell([P([T(how, { size: 17 })], { spacing: { after: 0 } })], W[2])] })) });
}

function letterhead() {
  const w = Math.round(210 / 25.4 * 96);
  const img = (data, hpx, yMm) => new ImageRun({ type: 'png', data, transformation: { width: w, height: Math.round(w * hpx / 1414) },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yMm * EMU_MM) },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } });
  return new Header({ children: [new Paragraph({ children: [img(head, 360, 0), img(foot, 60, 1860 / 2000 * 297)] })] });
}

const body = [
  P([T('TECH & COMMS · CRAWFORD UNIVERSITY', { bold: true, size: 15, color: BLUE, characterSpacing: 40 })], { spacing: { after: 80 } }),
  new Paragraph({ heading: d.HeadingLevel.TITLE, children: [T('Order of Programme')] }),
  P([T('Where Communications Meet Technology', { italics: true, size: 24, color: MUTED, font: 'Georgia' })], { spacing: { after: 160 } }),
  new Paragraph({ border: { top: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 6 }, bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 6 } }, spacing: { after: 160 },
    children: [T('Thursday, 26 November 2026', { bold: true, color: NAVY }), T('   ·   Legacy Hall, Crawford University   ·   2 hours', { color: MUTED })] }),
  P([T('Times assume a 10:00 AM start. If the start time changes, every item moves by the same amount. ', { size: 17, color: MUTED, italics: true }),
     T('There are no questions after individual talks; all questions are taken from the floor in the open Q&A at the end.', { size: 17, color: MUTED, italics: true })], { spacing: { after: 160 } }),
  programmeTable(),
  H('01', 'Notes for the day'),
  ...bullets([
    'Each talk is 20 minutes. Show the speaker a time card at 5 minutes and 1 minute remaining.',
    'No questions after individual talks; all questions are taken from the floor in the open Q&A.',
    'Two roving microphones for the Q&A; ushers bring them to students. Repeat each question into the main microphone so everyone hears it.',
    'A team member introduces Samuel Ogundeji before Talk 2, keeps time while he speaks and runs the Topic 02 quiz draw.',
    'If the programme runs late, shorten the quiz draws to one student each, then trim the closing. Keep the talks, panel and Q&A whole.',
    'Load all slides on one laptop before the start and test the screen, clicker and microphones.',
  ]),
  H('02', 'Quiz draws'),
  P('After each talk, two students come forward and each draws a folded question slip from that topic\'s bowl. A correct answer wins a small prize; if they miss it, the question goes to the floor. The question cards and the host answer sheet are in a separate document, "Tech and Comms Quiz Cards".'),
  ...bullets([
    'Before the event: print the cards, cut along the lines, fold each slip and put each topic in its own labelled bowl (Topic 01, 02, 03). The You Media and humanitarian cards can be used as extra questions after the panel if time allows.',
    'Prize ideas: TCBR stickers or merchandise, data bundles, or a free personal-brand or CV review.',
    'Pick students from different parts of the hall so everyone stays involved.',
  ]),
  H('03', 'Other fun ideas (optional)'),
  P('Extras that fit around the programme without taking time from it.'),
  funTable(),
];

const docx = new Document({
  creator: 'The Comms Boardroom', title: 'Tech and Comms Order of Programme - Crawford University',
  styles: {
    default: { document: { run: { font: FONT, size: 19, color: '1B2140' } } },
    paragraphStyles: [
      { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 40, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 60 }, keepNext: true } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 22, bold: true, color: NAVY }, paragraph: { spacing: { before: 320, after: 120 }, keepNext: true } },
    ],
  },
  numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 360, hanging: 240 } }, run: { color: BLUE } } }] }] },
  sections: [{ properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
      margin: { top: Math.round(62 * MM), bottom: Math.round(26 * MM), left: Math.round(20 * MM), right: Math.round(20 * MM), header: Math.round(5 * MM), footer: Math.round(5 * MM) } } },
    headers: { default: letterhead() }, children: body }],
});
Packer.toBuffer(docx).then(b => { fs.writeFileSync(out, b); console.log(out); });
