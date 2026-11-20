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

// ---- programme rows: [minutes, minutes label, item, who, note, kind]
const ROWS = [
  [4, '4', 'Welcome, opening prayer and recognition of guests', 'Host: Samuel Ogundeji', 'Sets the tone: honest conversations, not a lecture. All questions are held for the open Q&A at the end.', 'open'],
  [2, '2', 'Opening message', 'Head of Department, Mass Communication (or a representative)', 'A short welcome on behalf of the department.', 'open'],
  [2, '2', 'Announcement 1: Certificates and the raffle', 'Host', 'Register at the front desk for a certificate of participation; how the raffle works. Script A1 below.', 'ann'],
  [20, '20–25', 'Talk 1: Communications: School vs Reality', 'Gabriel Ntoka', 'Topic 01.', 'talk'],
  [2, '2', 'Announcement 2: Free CV revamp with Zofu', 'Host', 'One month of Zofu Pro free for every attendee. Script A2 below.', 'ann'],
  [20, '20–25', 'Talk 2: Media Monitoring, Evaluation, Intelligence & Social Listening, and AI in Communications', 'Samuel Ogundeji', 'Topic 02. A team member introduces Samuel and keeps time during this talk.', 'talk'],
  [2, '2', 'Announcement 3: Scan the survey QR code', 'Team member', 'Survey QR code on screen; students scan and fill it in while the raffle runs. Script A3 below.', 'ann'],
  [5, '5', 'Raffle draw, round 1: 5 questions', 'Host', 'PR, Advertising, Journalism, Broadcasting, Media Monitoring & Evaluation. Winners get the matching hand fan and airtime.', 'fun'],
  [20, '20–25', 'Talk 3: Building a Personal Brand', 'Onaopemipo Famori', 'Topic 03. Ends with the one-week challenge.', 'talk'],
  [2, '2', 'Announcement 4: Book discount from P+ Measurement', 'Host', 'Book offer for attendees. Script A4 below.', 'ann'],
  [25, '25', 'Panel session', 'Barnabas (You Media: the new media landscape) and Samuel Jegede (communications in humanitarian work); moderated by the host', 'From traditional media to You Media, and where a communications career can lead.', 'panel'],
  [5, '5', 'Raffle draw, round 2: 5 questions', 'Host', 'Digital & New Media, Film & Multimedia, Development Communication, Personal Branding, Strategic Communication.', 'fun'],
  [15, '15', 'Open Q&A (in the hall)', 'All speakers and panelists; host moderates', 'Questions from the floor with a roving microphone, taken in groups of three. The best question wins the Agba Creator fan.', 'qa'],
  [6, '6', 'Closing: sponsor announcements, vote of thanks and group photo', 'Host; vote of thanks by a student representative', 'Script A5 below (sponsors, Zofu code, certificate reminder), then the vote of thanks and the group photo at the backdrop.', 'close'],
];
const START = 10 * 60;   // 10:00 AM; change here if the start time moves
const fmt = (m) => { const h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, '0')}`; };
const total = ROWS.reduce((a, r) => a + r[0], 0);
const TOTAL_LABEL = `${Math.floor(total / 60)} hours ${total % 60} minutes`;

function programmeTable() {
  const W = [Math.round(25 * MM), Math.round(15 * MM), Math.round(70 * MM)]; W.push(CONTENT_W - W[0] - W[1] - W[2]);
  const hdr = ['Time', 'Mins', 'Item', 'Led by'];
  const header = new TableRow({ tableHeader: true, cantSplit: true, children: hdr.map((h, i) => cell([P([T(h.toUpperCase(), { bold: true, size: 14, color: 'FFFFFF', characterSpacing: 30 })], { spacing: { after: 0 } })], W[i], { fill: NAVY })) });
  let t = START;
  const fill = { talk: 'FFFFFF', panel: 'FFFFFF', qa: 'FFFFFF', open: 'FFFFFF', close: 'FFFFFF', fun: 'FFF8D6', ann: 'EEF2FF' };
  const rows = [header, new TableRow({ cantSplit: true, children: [
    cell([P([T(`${fmt(START - 30)}–${fmt(START)}`, { bold: true, size: 17, color: NAVY })], { spacing: { after: 0 } })], W[0], { fill: SOFT }),
    cell([P([T('30', { size: 17, color: MUTED })], { spacing: { after: 0 } })], W[1], { fill: SOFT }),
    cell([P([T('Arrival and registration at the front desk', { bold: true, size: 18, color: NAVY })], { spacing: { after: 30 } }),
          P([T('Students register for certificates and get a raffle number. Music playing; photos at the backdrop and Instagram placard; sticky notes on the prompt wall.', { size: 16, color: MUTED })], { spacing: { after: 0 } })], W[2], { fill: SOFT }),
    cell([P([T('Front desk / TCBR team', { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: SOFT })] })];
  ROWS.forEach(([m, ml, item, who, note, kind]) => {
    const tag = { talk: 'TALK', panel: 'PANEL', qa: 'Q&A', fun: 'RAFFLE', ann: 'NOTICE', open: '', close: '' }[kind];
    const tagFill = kind === 'fun' ? YELLOW : kind === 'ann' ? NAVY : BLUE;
    rows.push(new TableRow({ cantSplit: true, children: [
      cell([P([T(`${fmt(t)}–${fmt(t + m)}`, { bold: true, size: 17, color: NAVY })], { spacing: { after: 0 } })], W[0], { fill: fill[kind] }),
      cell([P([T(ml, { size: 17, color: MUTED })], { spacing: { after: 0 } })], W[1], { fill: fill[kind] }),
      cell([P([...(tag ? [T(` ${tag} `, { bold: true, size: 13, color: kind === 'fun' ? NAVY : 'FFFFFF', shading: { type: ShadingType.CLEAR, fill: tagFill, color: 'auto' } }), T('  ')] : []),
              T(item, { bold: true, size: 18, color: NAVY })], { spacing: { after: 30 } }),
            P([T(note, { size: 16, color: MUTED })], { spacing: { after: 0 } })], W[2], { fill: fill[kind] }),
      cell([P([T(who, { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: fill[kind] })] }));
    t += m;
  });
  rows.push(new TableRow({ cantSplit: true, children: [
    cell([P([T(`${fmt(START)}–${fmt(t)}`, { bold: true, size: 17, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[0], { fill: BLUE }),
    cell([P([T(String(total), { bold: true, size: 17, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[1], { fill: BLUE }),
    cell([P([T('Total: ' + TOTAL_LABEL + ' (talks at 20 minutes)', { bold: true, size: 18, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[2], { fill: BLUE }),
    cell([P([T('', { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: BLUE })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
}

// ---- raffle questions: [round, field (hand fan), question, answer]
const QUIZ = [
  [1, 'Public Relations', 'PR Lead', 'In the RACE model of public relations, what do the four letters stand for?', 'Research, Action (planning), Communication, Evaluation.'],
  [1, 'Advertising', 'Creative Director', 'What does the advertising model AIDA stand for?', 'Attention, Interest, Desire, Action.'],
  [1, 'Journalism', 'Newsroom Editor', 'What are the "5 Ws and H" every news story should answer?', 'Who, What, When, Where, Why and How.'],
  [1, 'Broadcasting', 'Broadcast Icon', 'Which government body regulates radio and television broadcasting in Nigeria?', 'The National Broadcasting Commission (NBC).'],
  [1, 'Media Monitoring & Evaluation', 'Media Intelligence Analyst', 'What is the name of the global set of principles for measuring PR and communication, first agreed in 2010 and named after a Spanish city?', 'The Barcelona Principles.'],
  [2, 'Digital & New Media', 'Digital Strategist', 'What does SEO stand for?', 'Search Engine Optimisation.'],
  [2, 'Film & Multimedia', 'Film Director', 'In film production, what is a storyboard?', 'A sequence of drawings or images that plans each shot or scene before filming.'],
  [2, 'Development Communication', 'Change Maker', 'What do the letters SDGs stand for, and how many goals are there?', 'Sustainable Development Goals; there are 17.'],
  [2, 'Personal Branding', 'Brand Builder', 'On LinkedIn, what is the short line under your name that tells people what you do called?', 'Your headline.'],
  [2, 'Strategic Communication', 'Comms CEO', 'What does SWOT stand for?', 'Strengths, Weaknesses, Opportunities, Threats.'],
];
const SPARE = [
  ['Any field', 'What does "social listening" mean?', 'Tracking what people say online about a brand, topic or issue, and analysing it to understand sentiment and act on it.'],
  ['Any field', 'Name the fact-checking question you should ask before sharing any news online.', 'Any sensible answer, e.g. "What is the source?" or "Is it reported by credible outlets?"'],
];

function quizTable() {
  const W = [Math.round(36 * MM), Math.round(72 * MM)]; W.push(CONTENT_W - W[0] - W[1]);
  const hdr = ['Field · fan', 'Question', 'Answer'];
  const rows = [new TableRow({ tableHeader: true, cantSplit: true, children: hdr.map((h, i) => cell([P([T(h.toUpperCase(), { bold: true, size: 14, color: 'FFFFFF', characterSpacing: 30 })], { spacing: { after: 0 } })], W[i], { fill: NAVY })) })];
  let last = 0;
  QUIZ.forEach(([round, field, fan, q, a], i) => {
    if (round !== last) {
      last = round;
      rows.push(new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 3, width: { size: CONTENT_W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: YELLOW, color: 'auto' },
        margins: { top: 60, bottom: 60, left: 100, right: 100 }, borders: { top: none, left: none, right: none, bottom: hair },
        children: [P([T(round === 1 ? 'ROUND 1 · after Talk 2' : 'ROUND 2 · after the panel', { bold: true, size: 15, color: NAVY, characterSpacing: 30 })], { spacing: { after: 0 } })] })] }));
    }
    rows.push(new TableRow({ cantSplit: true, children: [
      cell([P([T(`${i + 1}. ${field}`, { bold: true, size: 17, color: NAVY })], { spacing: { after: 20 } }), P([T('Fan: Future ' + fan, { size: 15, color: MUTED, italics: true })], { spacing: { after: 0 } })], W[0]),
      cell([P([T(q, { size: 17 })], { spacing: { after: 0 } })], W[1]),
      cell([P([T(a, { size: 17, color: '1B2140' })], { spacing: { after: 0 } })], W[2])] }));
  });
  rows.push(new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 3, width: { size: CONTENT_W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' },
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, borders: { top: none, left: none, right: none, bottom: hair },
    children: [P([T('SPARE QUESTIONS · use if a question is answered before it is asked, or for a tie', { bold: true, size: 15, color: NAVY, characterSpacing: 30 })], { spacing: { after: 0 } })] })] }));
  SPARE.forEach(([field, q, a]) => rows.push(new TableRow({ cantSplit: true, children: [
    cell([P([T(field, { bold: true, size: 17, color: NAVY })], { spacing: { after: 0 } })], W[0]),
    cell([P([T(q, { size: 17 })], { spacing: { after: 0 } })], W[1]),
    cell([P([T(a, { size: 17 })], { spacing: { after: 0 } })], W[2])] })));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
}

// ---- announcements: [code, when, title, script]
const ANN = [
  ['A1', 'After the opening message', 'Certificates and the raffle',
    'Good morning, everyone. Two quick things before we start. First, if you want a certificate of participation, please register at the front desk before you leave. Make sure your name is spelt exactly as you want it on the certificate. Second, the raffle: when you registered you got a raffle number. In two rounds today we will draw numbers. If your number is called, you answer one question on a field of Mass Communication, PR, journalism, broadcasting and more. Get it right and you win the hand fan for that field, plus airtime. So stay in the hall and keep your number safe.'],
  ['A2', 'After Talk 1', 'Free CV revamp with Zofu',
    'Our partner Zofu is giving every student here one month of Zofu Pro free. Zofu is an AI tool that tailors your CV to each job you apply for, and you get their newest update. The access code is only for people in this hall, so we will share it at the end of the programme. Please do not post it online. Stay till the end to get it.'],
  ['A3', 'After Talk 2', 'Scan the survey QR code',
    'Please bring out your phones. Scan the QR code on the screen. It is a short, anonymous survey, about three minutes, on what you are learning and what you wish you were learning. Your answers will help us push for a curriculum that matches the industry. The code will stay on the screen while we run the first raffle round.'],
  ['A4', 'After Talk 3', 'Book discount from P+ Measurement',
    'Our sponsor, P+ Measurement, is offering students here a discount on [book title] by [author]. You get [discount] off when you [how to claim: code, link or desk]. The offer runs until [end date]. Details are on the screen and at the front desk.'],
  ['A5', 'In the closing', 'Sponsors, Zofu code and certificates',
    'Thank you to our sponsors, P+ Measurement and Zofu, and to our partners, the Department of Mass Communication, AMACOS and the Crawford University Alumni Association. Here is your Zofu code: [read out or show the code]. Redeem it at zofu.quest by [last redemption date]. [Any other sponsor offer or giveaway.] If you have not registered for your certificate, the front desk is open now. And before you go, add your sticky note to the prompt wall and take a picture at the backdrop. See you online with #TechAndComms.'],
];

function annBlocks() {
  const out = [];
  ANN.forEach(([code, when, title, script]) => {
    out.push(new Paragraph({ keepNext: true, spacing: { before: 200, after: 60 }, children: [
      T(` ${code} `, { bold: true, size: 15, color: 'FFFFFF', shading: { type: ShadingType.CLEAR, fill: NAVY, color: 'auto' } }), T('  '),
      T(title, { bold: true, size: 20, color: NAVY }), T('   ' + when, { size: 16, color: MUTED, italics: true })] }));
    out.push(new Paragraph({ spacing: { after: 80, line: 300 }, indent: { left: 200 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 8 } },
      children: script.split(/(\[[^\]]*\])/).filter(Boolean).map(p => p.startsWith('[') ? T(p, { size: 18, highlight: 'yellow' }) : T(p, { size: 18 })) }));
  });
  return out;
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
    children: [T('Thursday, 26 November 2026', { bold: true, color: NAVY }), T('   ·   Multipurpose Hall, Crawford University   ·   about ' + TOTAL_LABEL, { color: MUTED })] }),
  P([T('Times assume a 10:00 AM start and 20 minutes per talk. Each speaker may take up to 25 minutes; if all three do, the programme ends 15 minutes later (about 12:25 PM). ', { size: 17, color: MUTED, italics: true }),
     T('There are no questions after individual talks; all questions are taken from the floor in the open Q&A.', { size: 17, color: MUTED, italics: true })], { spacing: { after: 160 } }),
  programmeTable(),
  H('01', 'Instructions and announcements to students'),
  P('Five short announcements, spread through the programme so no single one runs long. The host reads them as written or in their own words. Text highlighted in yellow still needs to be filled in.'),
  ...annBlocks(),
  H('02', 'Raffle draw'),
  P('Two rounds of 5 minutes, with 5 questions each (10 in total). Each question is on one field of Mass Communication, and the prize is the hand fan for that field, plus airtime.'),
  ...bullets([
    'At registration, every student gets a raffle number (a numbered ticket, or the number they register under at the front desk).',
    'Draw a number, call the student up, and read the question for the next field. About one minute per question.',
    'Correct answer: they win that field’s hand fan and airtime. Wrong answer: draw another number for the same question.',
    'The 11th fan, Agba Creator, goes to the best question in the open Q&A, chosen by the speakers.',
    'Keep fans and airtime ready on a table beside the stage, in question order, so prizes go out quickly.',
  ]),
  P([T('Host answer sheet', { bold: true, color: NAVY })], { spacing: { before: 160, after: 80 }, keepNext: true }),
  quizTable(),
  H('03', 'Notes for the day'),
  ...bullets([
    'Each talk is 20 minutes, with up to 25. Show the speaker time cards at 15 minutes ("5 left"), 20 minutes ("wrap up") and 25 minutes ("time").',
    'No questions after individual talks; all questions are taken from the floor in the open Q&A.',
    'Two roving microphones for the Q&A; ushers bring them to students. Repeat each question into the main microphone so everyone hears it.',
    'A team member introduces Samuel Ogundeji before Talk 2, keeps time while he speaks and reads Announcement 3.',
    'If the programme runs late, cut the raffle rounds to 3 questions each and use the rest at the close, then shorten the Q&A. Keep the talks and panel whole.',
    'Load all slides and display creatives on one laptop before the start and test the screen, clicker and microphones.',
    'The front desk stays open for certificate registration until the hall clears.',
  ]),
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
