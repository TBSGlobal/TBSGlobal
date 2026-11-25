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
  [4, '4', 'Welcome, opening prayer, recognition of guests and what to expect', 'Compere: Kyrian Benita', 'Sets the tone: honest conversations, not a lecture. All questions are held for the panel at the end.', 'open'],
  [2, '2', 'Opening message', 'Head of Department, Mass Communication (or a representative)', 'A short welcome on behalf of the department.', 'open'],
  [2, '2', 'Announcement 1: Certificates, the raffle and a gift for posting', 'Compere', 'Register at the front desk for your certificate; how the raffle works; post about the event for a chance to receive a gift from the founder of P+ Measurement. Script A1 below.', 'ann'],
  [20, '20–25', 'Talk 1: Communications: School vs Reality (joining virtually)', 'Gabriel Ntoka', 'Streamed live on the hall screen. Test the link and sound before 10:00.', 'talk'],
  [2, '2', 'Announcement 2: Free CV revamp with Zofu', 'Compere', 'One month of Zofu Pro free for every attendee. Short Zofu video if received (to be confirmed). Script A2 below.', 'ann'],
  [20, '20–25', 'Talk 2: Media Monitoring, Evaluation, Intelligence & Social Listening, and AI in Communications', 'Samuel Ogundeji', 'Includes the live TC Live social listening demo.', 'talk'],
  [2, '2', 'Announcement 3: Scan the survey QR code', 'Compere', 'Survey QR code on screen, 5 to 10 questions. Script A3 below.', 'ann'],
  [5, '5', 'Raffle draw, round 1: 5 questions', 'Compere', 'Students pick a number from 1 to 10; a correct answer wins that hand fan plus airtime or data.', 'fun'],
  [5, '5', 'Short talk: The relevance of building a good CV/portfolio for early career builders', 'Opemipo [surname]', 'A quick, practical talk on CVs and portfolios.', 'talk'],
  [20, '20–25', 'Talk 3: Building Your Professional Presence', 'Onaopemipo Famori', 'Ends with the one-week challenge.', 'talk'],
  [2, '2', 'Announcement 4: P+ Measurement book offer', 'Compere', 'The Science of Public Relations at ₦10,000 instead of ₦15,000. Script A4 below.', 'ann'],
  [30, '30', 'Panel session and open Q&A', 'All speakers and panelists: Barnabas Inumidun, Samuel Jegede, Samuel Ogundeji, Onaopemipo Famori (Gabriel Ntoka if still online). Moderator: a student (to be confirmed)', 'The only Q&A of the day. The panel discussion first, then questions from the floor before the panelists leave.', 'panel'],
  [5, '5', 'Raffle draw, round 2: the remaining 5 questions', 'Compere', 'Same rules: pick one of the numbers not yet chosen.', 'fun'],
  [3, '3', 'Announcement 5: Sponsors, offers and the posting gift', 'Compere', 'Thank sponsors and partners, the Zofu code, the two students who receive the gift for posting, certificate reminder. Script A5 below.', 'ann'],
  [2, '2', 'Vote of thanks', 'A student representative', '', 'close'],
  [5, '5', 'Group photo', 'Everyone, at the backdrop', 'Very important. Photographer ready before the vote of thanks ends.', 'close'],
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
          P([T('Students register for certificates (hand tags to be confirmed), then take a sticky note and marker and answer one of the four prompts on the backdrop. Music playing; photos at the backdrop and the Instagram placard. No raffle numbers at the door. The programme starts at 10:00 on the dot, however full the hall is.', { size: 16, color: MUTED })], { spacing: { after: 0 } })], W[2], { fill: SOFT }),
    cell([P([T('Front desk / TCBR team', { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: SOFT })] })];
  ROWS.forEach(([m, ml, item, who, note, kind]) => {
    const tag = { talk: 'TALK', panel: 'PANEL + Q&A', qa: 'Q&A', fun: 'RAFFLE', ann: 'NOTICE', open: '', close: '' }[kind];
    const tagFill = kind === 'fun' ? YELLOW : kind === 'ann' ? NAVY : BLUE;
    rows.push(new TableRow({ cantSplit: true, children: [
      cell([P([T(`${fmt(t)}–${fmt(t + m)}`, { bold: true, size: 17, color: NAVY })], { spacing: { after: 0 } })], W[0], { fill: fill[kind] }),
      cell([P([T(ml, { size: 17, color: MUTED })], { spacing: { after: 0 } })], W[1], { fill: fill[kind] }),
      cell([P([...(tag ? [T(` ${tag} `, { bold: true, size: 13, color: kind === 'fun' ? NAVY : 'FFFFFF', shading: { type: ShadingType.CLEAR, fill: tagFill, color: 'auto' } }), T('  ')] : []),
              T(item, { bold: true, size: 18, color: NAVY })], { spacing: { after: note ? 30 : 0 } }),
            ...(note ? [P([T(note, { size: 16, color: MUTED })], { spacing: { after: 0 } })] : [])], W[2], { fill: fill[kind] }),
      cell([P([T(who, { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: fill[kind] })] }));
    t += m;
  });
  rows.push(new TableRow({ cantSplit: true, children: [
    cell([P([T(`${fmt(START)}–${fmt(t)}`, { bold: true, size: 17, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[0], { fill: BLUE }),
    cell([P([T(String(total), { bold: true, size: 17, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[1], { fill: BLUE }),
    cell([P([T('Total: about ' + TOTAL_LABEL + ' (talks at 20 minutes; 2 hours 30 at most)', { bold: true, size: 18, color: 'FFFFFF' })], { spacing: { after: 0 } })], W[2], { fill: BLUE }),
    cell([P([T('', { size: 17 })], { spacing: { after: 0 } })], W[3], { fill: BLUE })] }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
}

// ---- raffle question cards: [number, field (hand fan), fan title, question, answer]
const QUIZ = [
  [1, 'Public Relations', 'PR Lead', 'In the RACE model of public relations, what do the four letters stand for?', 'Research, Action (planning), Communication, Evaluation.'],
  [2, 'Advertising', 'Creative Director', 'What does the advertising model AIDA stand for?', 'Attention, Interest, Desire, Action.'],
  [3, 'Journalism', 'Newsroom Editor', 'What are the "5 Ws and H" every news story should answer?', 'Who, What, When, Where, Why and How.'],
  [4, 'Broadcasting', 'Broadcast Icon', 'Which government body regulates radio and television broadcasting in Nigeria?', 'The National Broadcasting Commission (NBC).'],
  [5, 'Media Monitoring & Evaluation', 'Media Intelligence Analyst', 'What is the name of the global set of principles for measuring PR and communication, first agreed in 2010 and named after a Spanish city?', 'The Barcelona Principles.'],
  [6, 'Digital & New Media', 'Digital Strategist', 'What does SEO stand for?', 'Search Engine Optimisation.'],
  [7, 'Film & Multimedia', 'Film Director', 'In film production, what is a storyboard?', 'A sequence of drawings or images that plans each shot or scene before filming.'],
  [8, 'Development Communication', 'Change Maker', 'What do the letters SDGs stand for, and how many goals are there?', 'Sustainable Development Goals; there are 17.'],
  [9, 'Personal Branding', 'Brand Builder', 'On LinkedIn, what is the short line under your name that tells people what you do called?', 'Your headline.'],
  [10, 'Strategic Communication', 'Comms CEO', 'What does SWOT stand for?', 'Strengths, Weaknesses, Opportunities, Threats.'],
];
const SPARE = [
  ['Spare', 'What does "social listening" mean?', 'Tracking what people say online about a brand, topic or issue, and analysing it to understand sentiment and act on it.'],
  ['Spare', 'Name a question you should ask before sharing any news online.', 'Any sensible answer, e.g. "What is the source?" or "Is it reported by credible outlets?"'],
];

function quizTable() {
  const W = [Math.round(36 * MM), Math.round(72 * MM)]; W.push(CONTENT_W - W[0] - W[1]);
  const hdr = ['No. · field · fan', 'Question', 'Answer'];
  const rows = [new TableRow({ tableHeader: true, cantSplit: true, children: hdr.map((h, i) => cell([P([T(h.toUpperCase(), { bold: true, size: 14, color: 'FFFFFF', characterSpacing: 30 })], { spacing: { after: 0 } })], W[i], { fill: NAVY })) })];
  QUIZ.forEach(([n, field, fan, q, a]) => rows.push(new TableRow({ cantSplit: true, children: [
    cell([P([T(`${n}. ${field}`, { bold: true, size: 17, color: NAVY })], { spacing: { after: 20 } }), P([T('Fan: Future ' + fan, { size: 15, color: MUTED, italics: true })], { spacing: { after: 0 } })], W[0]),
    cell([P([T(q, { size: 17 })], { spacing: { after: 0 } })], W[1]),
    cell([P([T(a, { size: 17 })], { spacing: { after: 0 } })], W[2])] })));
  rows.push(new TableRow({ cantSplit: true, children: [new TableCell({ columnSpan: 3, width: { size: CONTENT_W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: SOFT, color: 'auto' },
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, borders: { top: none, left: none, right: none, bottom: hair },
    children: [P([T('SPARE QUESTIONS · if nobody answers correctly, or for a tie', { bold: true, size: 15, color: NAVY, characterSpacing: 30 })], { spacing: { after: 0 } })] })] }));
  SPARE.forEach(([field, q, a]) => rows.push(new TableRow({ cantSplit: true, children: [
    cell([P([T(field, { bold: true, size: 17, color: NAVY })], { spacing: { after: 0 } })], W[0]),
    cell([P([T(q, { size: 17 })], { spacing: { after: 0 } })], W[1]),
    cell([P([T(a, { size: 17 })], { spacing: { after: 0 } })], W[2])] })));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: W, rows });
}

// ---- announcements: [code, when, title, script]
const ANN = [
  ['A1', 'After the opening message', 'Certificates, the raffle and a gift for posting',
    'Good morning, everyone. Three quick things before we start. First, every one of you will get a certificate of participation, so if you have not registered at the front desk, please do so before you leave, with your name spelt exactly as you want it on the certificate. Second, the raffle: later today we will ask ten questions on different fields of Mass Communication, PR, journalism, broadcasting and more. When we call for a volunteer, pick a number from 1 to 10. Answer that question correctly and you win the hand fan for that field, plus airtime or data. Third, post about Tech & Comms on your page today with #TechAndComms and tag [@thecommsboardroom]. Two students who post will receive a gift from the founder of one of our sponsors, P+ Measurement. We will name them at the end.'],
  ['A2', 'After Talk 1', 'Free CV revamp with Zofu',
    'Our partner Zofu is giving every student here one month of Zofu Pro free. Zofu is an AI tool that tailors your CV to each job you apply for, and you get their newest update. [If received: here is a short video from Zofu.] The access code is only for people in this hall, so we will share it at the end of the programme. Please do not post it online. Stay till the end to get it.'],
  ['A3', 'After Talk 2', 'Scan the survey QR code',
    'Please bring out your phones and scan the QR code on the screen. You do not need to go anywhere. It is a short, anonymous survey of 5 to 10 questions on what you are learning and what you wish you were learning. Your answers will help us push for a curriculum that matches the industry. Then stay with us: the first raffle round is next.'],
  ['A4', 'After Talk 3', 'P+ Measurement book offer',
    'Our sponsor, Mr. Phillip Odiakose of P+ Measurement, has written The Science of Public Relations: A Comprehensive Guide to Measurement and Evaluation. It normally sells for ₦15,000. If ten of us in this hall want a copy, he will let it go for ₦10,000 each. If you are interested, give your name at the front desk [or: raise your hand / see the P+ table]. Three copies are also being donated to the Department of Mass Communication.'],
  ['A5', 'In the closing', 'Sponsors, offers, the posting gift and certificates',
    'Thank you to our sponsors, P+ Measurement and Zofu, and to our partners, the Department of Mass Communication, AMACOS and the Crawford University Alumni Association. Here is your Zofu code: [read out or show the code]. Redeem it at zofu.quest by [last redemption date]. Thank you to everyone who posted about today. The gift from the founder of P+ Measurement goes to: [student 1] and [student 2]. Please come forward. If you want a copy at ₦10,000, see [the front desk]. If you have not registered for your certificate, the front desk is open now. And before you go, add your sticky note to the prompt wall and join us for the group photo. See you online with #TechAndComms.'],
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
    children: [T('Thursday, 26 November 2026', { bold: true, color: NAVY }), T('   ·   Multipurpose Hall, Crawford University   ·   10:00 AM', { color: MUTED })] }),
  P([T('Times assume 20 minutes per talk. Each speaker may take up to 25 minutes; if all three do, the programme ends about 15 minutes later (around 12:25 PM, 2 hours 30 at most). ', { size: 17, color: MUTED, italics: true }),
     T('There are no questions after individual talks; all questions go to the panel session.', { size: 17, color: MUTED, italics: true })], { spacing: { after: 160 } }),
  programmeTable(),
  H('01', 'Instructions and announcements to students'),
  P('Five short announcements, spread through the programme so no single one runs long. The compere reads them as written or in their own words. Text highlighted in yellow still needs to be filled in or confirmed.'),
  ...annBlocks(),
  H('02', 'Raffle draw'),
  P('Two rounds of 5 minutes, with 5 questions each (10 in total). Each question is on one field of Mass Communication, and the prize is the hand fan for that field, plus airtime or data.'),
  ...bullets([
    'No raffle numbers at the door. The compere asks for a volunteer; the student picks a number from 1 to 10 and answers that question.',
    'Correct answer: they win that field’s hand fan plus airtime or data. Wrong answer: ask another volunteer to try the same question, or move on.',
    'Round 1 (after the survey) uses five numbers; round 2 (after the panel) uses the five numbers that are left. Tick each number off as it is chosen.',
    'Keep the ten fans in number order on a table by the stage, with the airtime or data ready, so prizes go out quickly.',
    'The gift for posting is separate from the raffle: two students who post about the event receive a gift from the founder of P+ Measurement (announced in A1, named in A5). Do not say what the gift is.',
  ]),
  P([T('Host answer sheet', { bold: true, color: NAVY })], { spacing: { before: 160, after: 80 }, keepNext: true }),
  quizTable(),
  H('03', 'Notes for the day'),
  ...bullets([
    'Start at 10:00 on the dot, whatever the number in the hall. Registration continues at the front desk while the programme runs.',
    'Each talk is 20 minutes, with up to 25. Show the speaker a "round up" card at 20 minutes and "time" at 25.',
    'No questions after individual talks. All questions go to the panel session, where every speaker and panelist sits.',
    'Gabriel Ntoka joins virtually: test the video link, screen and sound before 10:00, and have a backup (his slides as a PDF on the laptop).',
    'The panel is moderated by a student (to be confirmed with Jessica), not the compere.',
    'If the programme runs late, shorten the panel discussion before the open questions, and keep both raffle rounds to 5 minutes.',
    'Load all slides and display screens on one laptop before the start and test the screen, clicker and microphones.',
    'Collect the post links during the programme so the two students who receive the posting gift can be named in A5.',
    'The front desk stays open for certificate registration until the hall clears. Group photo straight after the vote of thanks.',
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
