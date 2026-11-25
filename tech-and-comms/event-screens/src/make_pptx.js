// Editable PowerPoint of the event screens, in programme order.
// usage: NODE_PATH=<dir with pptxgenjs> node make_pptx.js <out.pptx>
const path = require('path');
const pptxgen = require('pptxgenjs');
const IMG = (f) => path.join(__dirname, 'pptx-img', f);
const out = process.argv[2];

const C = { deep: '071566', royal: '022394', blue: '5379F6', ink: '131838', paper: 'F2F5FC', yellow: 'FFD60A', muted: '4B537A', white: 'FFFFFF', soft: 'DFE6FF', line: 'E2E8F8' };
const HEAD = 'Arial Black', BODY = 'Arial';
const W = 13.333, H = 7.5;

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'The Comms Boardroom Technologies';
pres.title = 'Tech and Comms Event Screens';
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

pres.defineSlideMaster({ title: 'LIGHT', background: { path: IMG('tc-grid.png') },
  objects: [{ image: { path: IMG('tc-logo.png'), x: 0.5, y: 0.4, w: 1.6, h: 0.71 } },
    { rect: { x: 0, y: 7.0, w: W, h: 0.5, fill: { color: C.royal } } },
    { text: { text: 'TECH & COMMS · 26TH NOV. 2026 · MULTIPURPOSE HALL, CRAWFORD UNIVERSITY', options: { x: 0.5, y: 7.0, w: 9.5, h: 0.5, fontFace: BODY, fontSize: 11, bold: true, color: C.white, charSpacing: 2, valign: 'middle', margin: 0 } } },
    { text: { text: '#TECHANDCOMMS', options: { x: 10.3, y: 7.0, w: 2.53, h: 0.5, fontFace: BODY, fontSize: 11, bold: true, color: C.white, charSpacing: 2, align: 'right', valign: 'middle', margin: 0 } } }] });
pres.defineSlideMaster({ title: 'DARK', background: { path: IMG('tc-grid-dark.png') }, objects: [] });
pres.defineSlideMaster({ title: 'PLAIN', background: { path: IMG('tc-grid.png') }, objects: [] });

let section = '';
const add = (master, notes) => { const s = pres.addSlide({ masterName: master, sectionTitle: section }); if (notes) s.addNotes(notes); return s; };
const sec = (t) => { section = t; pres.addSection({ title: t }); };
const T = (s, text, o) => s.addText(Array.isArray(text) ? text.map((r) => (typeof r === 'string' ? { text: r } : r)) : text, { isTextBox: true, margin: 0, fontFace: BODY, color: C.ink, ...o });
const pill = (s, text, x, y, o = {}) => T(s, text.toUpperCase(), { x, y, w: o.w || 3.2, h: 0.42, fontSize: 12, bold: true, charSpacing: 3, align: 'center', valign: 'middle',
  color: o.color || C.white, fill: { color: o.fill || C.royal }, rectRadius: 0.21, shape: pres.ShapeType.roundRect });
const h1 = (s, runs, o) => T(s, runs, { fontFace: HEAD, fontSize: 48, color: C.ink, valign: 'top', ...o });
const em = (text, color) => ({ text, options: { fontFace: 'Georgia', italic: true, bold: false, color: color || C.royal } });
const body = (s, text, o) => T(s, text, { fontSize: 20, color: C.muted, valign: 'top', paraSpaceAfter: 6, ...o });
const ast = (s, x, y, size, rot = 14, transparency = 0) => s.addImage({ path: IMG('tc-ast.png'), x, y, w: size, h: size, rotate: rot, transparency });
const card = (s, f, x, y, w) => s.addImage({ path: IMG(f), x, y, w, h: w * 1.25 });
const box = (s, x, y, w, h, fill = C.white) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.18, fill: { color: fill }, line: { color: C.line, width: 1 },
  shadow: { type: 'outer', color: '071566', opacity: 0.12, blur: 12, offset: 4, angle: 90 } });
const placeholder = (s, x, y, w, h, label) => { s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.18, fill: { color: C.soft }, line: { color: C.blue, width: 2, dashType: 'dash' } });
  T(s, label, { x, y, w, h, fontSize: 16, bold: true, color: C.royal, align: 'center', valign: 'middle' }); };

// ---------------- ARRIVAL LOOP ----------------
sec('Arrival loop (9:30 to 10:00)');
let s = add('PLAIN', 'Loop these slides during arrival and registration.');
ast(s, 11.2, 0.6, 2.0); ast(s, -0.6, 5.0, 1.8, 0, 40);
T(s, 'WELCOME TO', { x: 0, y: 0.75, w: W, h: 0.4, fontSize: 16, bold: true, color: C.muted, charSpacing: 8, align: 'center' });
s.addImage({ path: IMG('tc-logo.png'), x: 4.0, y: 1.3, w: 5.33, h: 2.37 });
T(s, 'Where comms meets tech', { x: 4.3, y: 4.0, w: 4.7, h: 0.65, fontSize: 24, bold: true, italic: true, align: 'center', valign: 'middle', fill: { color: C.yellow }, rotate: -2 });
T(s, 'THURSDAY, 26TH NOVEMBER 2026 · MULTIPURPOSE HALL, CRAWFORD UNIVERSITY', { x: 0, y: 5.05, w: W, h: 0.45, fontSize: 18, bold: true, align: 'center', charSpacing: 1 });
T(s, '#TechAndComms', { x: 0, y: 5.6, w: W, h: 0.6, fontFace: 'Georgia', italic: true, fontSize: 28, color: C.royal, align: 'center' });

s = add('DARK');
s.addImage({ path: IMG('tc-logo-white.png'), x: 0.6, y: 0.45, w: 1.8, h: 0.8 }); ast(s, 11.0, 0.6, 1.6);
pill(s, 'Before you sit down', 0.9, 1.9, { fill: C.yellow, color: C.ink });
h1(s, ['Get your ', em('certificate', C.yellow), { text: '\nof participation' }], { x: 0.9, y: 2.55, w: 10, h: 2.0, color: C.white, fontSize: 54 });
body(s, 'Register at the front desk with your name spelt exactly as you want it on your certificate.', { x: 0.9, y: 4.8, w: 9, h: 1.0, color: 'D6DCF5', fontSize: 22 });

s = add('PLAIN'); ast(s, 11.6, 0.4, 1.4);
s.addImage({ path: IMG('flyer.jpg'), x: 0.8, y: 0.45, w: 5.2, h: 6.5 });
pill(s, "Today's line-up", 6.7, 1.3);
h1(s, ['Three talks.\nOne panel.\n', em('Your questions.')], { x: 6.7, y: 1.95, w: 6, h: 2.6, fontSize: 40 });
body(s, 'Communications: School vs Reality · Media Monitoring, Intelligence and AI in Comms · Building Your Professional Presence', { x: 6.7, y: 4.8, w: 5.9, h: 1.3 });

s = add('LIGHT', 'Opemipo card: replace the dashed placeholder with the speaker card.');
pill(s, 'Meet the voices', 10.1, 0.55);
[['host.jpg'], ['gabriel.jpg'], ['onaopemipo.jpg'], ['jegede.jpg'], ['barnabas.jpg'], ['kyrian.jpg']].forEach(([f], i) => card(s, f, 0.55 + i * 1.85, 1.55, 1.7));
placeholder(s, 0.55 + 6 * 1.85, 1.55, 1.7, 2.125, 'Opemipo\n[photo]');
T(s, 'Host, speakers, panelists and compere', { x: 0.55, y: 4.0, w: 12.2, h: 0.6, fontFace: HEAD, fontSize: 26 });
body(s, 'Samuel Ogundeji · Gabriel Ntoka · Onaopemipo Famori · Samuel Jegede · Barnabas Inumidun · Kyrian Benita · Opemipo [surname]', { x: 0.55, y: 4.65, w: 12.2, h: 0.8, fontSize: 16 });

s = add('PLAIN');
s.addImage({ path: IMG('partners.jpg'), x: 0.8, y: 0.45, w: 5.2, h: 6.5 });
pill(s, 'Thank you', 6.7, 1.5);
h1(s, ['Our partners\nand ', em('sponsors')], { x: 6.7, y: 2.15, w: 6, h: 1.8, fontSize: 40 });
body(s, 'Department of Mass Communication · AMACOS · Unicorn, Crawford University Alumni · P+ Measurement Services · Zofu', { x: 6.7, y: 4.2, w: 5.9, h: 1.3 });
ast(s, 11.6, 5.4, 1.3);

// ---------------- OPENING ----------------
sec('Opening (10:00)');
s = add('DARK'); ast(s, 11.1, 0.7, 1.9);
T(s, 'THE COMMS BOARDROOM TECHNOLOGIES PRESENTS', { x: 0, y: 0.9, w: W, h: 0.4, fontSize: 15, bold: true, color: 'B9C3EE', charSpacing: 6, align: 'center' });
s.addImage({ path: IMG('tc-logo-white.png'), x: 3.67, y: 1.5, w: 6.0, h: 2.67 });
T(s, 'Where comms meets tech', { x: 4.2, y: 4.55, w: 4.93, h: 0.7, fontSize: 26, bold: true, italic: true, align: 'center', valign: 'middle', fill: { color: C.yellow }, rotate: -2 });
T(s, '26TH NOVEMBER 2026 · CRAWFORD UNIVERSITY', { x: 0, y: 5.7, w: W, h: 0.45, fontSize: 18, bold: true, color: C.white, align: 'center', charSpacing: 2 });

s = add('LIGHT'); ast(s, 11.3, 1.0, 1.6);
pill(s, 'Opening message', 0.9, 2.2);
h1(s, 'Dr. Dayo Odigie', { x: 0.9, y: 2.85, w: 10, h: 1.0, fontSize: 54 });
body(s, 'Head of Department, Mass Communication\nCrawford University', { x: 0.9, y: 4.0, w: 9, h: 1.0, fontSize: 22 });

s = add('LIGHT', 'Announcement 1. Read the script in the Order of Programme.');
pill(s, 'Announcement', 0.6, 1.45);
h1(s, 'Certificates', { x: 0.6, y: 2.0, w: 3.9, h: 0.7, fontSize: 30 });
body(s, 'Register at the front desk to get your certificate of participation. Spell your name exactly as you want it printed.', { x: 0.6, y: 2.8, w: 3.9, h: 2.4, fontSize: 20 });
box(s, 4.75, 1.45, 4.05, 5.2);
T(s, 'How the raffle works', { x: 5.05, y: 1.7, w: 3.6, h: 0.5, fontFace: HEAD, fontSize: 20 });
T(s, [{ text: '1. When we call for a volunteer, raise your hand', options: { breakLine: true } }, { text: '2. Pick a number from 1 to 10', options: { breakLine: true } },
  { text: '3. Answer that question', options: { breakLine: true } }, { text: '4. Get it right and win a hand fan + airtime or data' }],
  { x: 5.05, y: 2.4, w: 3.55, h: 3.9, fontSize: 19, color: C.ink, paraSpaceAfter: 14, valign: 'top' });
box(s, 9.05, 1.45, 3.75, 5.2, C.deep);
T(s, 'Post about today', { x: 9.35, y: 1.7, w: 3.3, h: 0.5, fontFace: HEAD, fontSize: 20, color: C.white });
T(s, [{ text: 'Share Tech & Comms on your page with ', options: {} }, { text: '#TechAndComms', options: { bold: true, color: C.yellow } }, { text: ' and tag ' }, { text: '@thecommsboardroom', options: { bold: true, color: C.yellow } },
  { text: '.\n\nTwo students who post receive a gift from the founder of one of our sponsors, P+ Measurement.' }],
  { x: 9.35, y: 2.4, w: 3.25, h: 3.9, fontSize: 18, color: 'E4E9FB', valign: 'top' });

// ---------------- TALK 1 ----------------
sec('Talk 1 (10:08)');
s = add('PLAIN', 'Up next: Gabriel Ntoka, joining virtually on Google Meet.'); ast(s, -0.5, 5.4, 1.6, 0, 40);
card(s, 'gabriel.jpg', 0.9, 0.55, 5.0);
pill(s, 'Up next · Talk 1', 6.6, 1.5, { fill: C.yellow, color: C.ink });
h1(s, 'Communications: School vs Reality', { x: 6.6, y: 2.15, w: 6.2, h: 1.9, fontSize: 38 });
T(s, 'Gabriel Ntoka', { x: 6.6, y: 4.2, w: 6, h: 0.5, fontSize: 24, bold: true, color: C.royal });
T(s, 'Joining virtually', { x: 6.6, y: 4.75, w: 6, h: 0.4, fontSize: 18, italic: true, color: C.muted });

s = add('DARK', 'Holding slide while the Google Meet link connects.');
s.addImage({ path: IMG('tc-logo-white.png'), x: 5.17, y: 1.2, w: 3.0, h: 1.33 });
T(s, 'Connecting to Gabriel Ntoka…', { x: 0, y: 3.3, w: W, h: 0.9, fontFace: HEAD, fontSize: 40, color: C.white, align: 'center' });
T(s, 'Joining us live, virtually. Stay with us.', { x: 0, y: 4.35, w: W, h: 0.6, fontFace: 'Georgia', italic: true, fontSize: 24, color: C.yellow, align: 'center' });

s = add('DARK', 'Announcement 2: Zofu.');
s.addImage({ path: IMG('tc-logo-white.png'), x: 0.6, y: 0.45, w: 1.8, h: 0.8 });
pill(s, 'Free for every attendee', 0.9, 1.7, { fill: C.yellow, color: C.ink, w: 3.6 });
h1(s, ['Revamp your CV\nwith ', em('Zofu Pro', C.yellow)], { x: 0.9, y: 2.35, w: 7.4, h: 2.2, color: C.white, fontSize: 48 });
body(s, '1 month of Zofu Pro free: AI that tailors your CV to every job you apply for.', { x: 0.9, y: 4.75, w: 7.2, h: 1.0, color: 'D6DCF5', fontSize: 20 });
s.addShape(pres.ShapeType.roundRect, { x: 8.8, y: 2.0, w: 3.7, h: 3.1, rectRadius: 0.2, fill: { color: C.white } });
s.addImage({ path: IMG('zofu.png'), x: 9.25, y: 2.55, w: 2.8, h: 1.08 });
T(s, 'zofu.one', { x: 8.8, y: 4.0, w: 3.7, h: 0.6, fontSize: 26, bold: true, color: C.royal, align: 'center', hyperlink: { url: 'https://www.zofu.one/' } });

// ---------------- TALK 2 ----------------
sec('Talk 2 (10:30)');
s = add('PLAIN', 'Up next: Samuel Ogundeji. His own deck runs from tc-live-session.vercel.app.'); ast(s, -0.5, 5.4, 1.6, 0, 40);
card(s, 'host.jpg', 0.9, 0.55, 5.0);
pill(s, 'Up next · Talk 2', 6.6, 1.5, { fill: C.yellow, color: C.ink });
h1(s, 'Media Monitoring, Intelligence and AI in Comms', { x: 6.6, y: 2.15, w: 6.2, h: 1.9, fontSize: 36 });
T(s, 'Samuel Ogundeji', { x: 6.6, y: 4.2, w: 6, h: 0.5, fontSize: 24, bold: true, color: C.royal });

s = add('LIGHT', 'Announcement 3: survey. Leave this up during raffle round 1 if needed.');
pill(s, '3 minutes · anonymous', 0.9, 1.6, { w: 3.4 });
h1(s, ['Scan for our\n', em('student survey')], { x: 0.9, y: 2.25, w: 7.2, h: 2.0, fontSize: 48 });
body(s, 'What are you learning, and what do you wish you were learning? Your answers help shape a curriculum that matches the industry.', { x: 0.9, y: 4.45, w: 6.8, h: 1.4 });
box(s, 8.6, 1.3, 3.9, 5.2);
s.addImage({ path: IMG('qr-survey.png'), x: 8.9, y: 1.6, w: 3.3, h: 3.3 });
T(s, 'tech-and-comms.vercel.app/survey', { x: 8.6, y: 5.2, w: 3.9, h: 0.5, fontSize: 14, bold: true, color: C.muted, align: 'center' });

// ---------------- RAFFLE ----------------
sec('Raffle round 1 (10:52)');
s = add('DARK'); ast(s, 11.0, 0.6, 1.8);
pill(s, 'Raffle draw', 5.07, 1.5, { fill: C.yellow, color: C.ink });
T(s, 'Round 1', { x: 0, y: 2.2, w: W, h: 1.6, fontFace: HEAD, fontSize: 96, color: C.white, align: 'center' });
T(s, 'Pick a number from 1 to 10. Get it right, win a hand fan + airtime or data.', { x: 1, y: 4.1, w: W - 2, h: 0.7, fontFace: 'Georgia', italic: true, fontSize: 24, color: C.yellow, align: 'center' });

// number board: each number links to its question slide
const BOARD = pres.slides.length + 1, Q0 = BOARD + 1;
s = add('LIGHT', 'Number board. Click a number to open its question. After a question is used, select its tile and change the fill to grey so everyone sees it is taken.');
T(s, 'Pick a number', { x: 0.6, y: 1.35, w: 8, h: 0.8, fontFace: HEAD, fontSize: 36 });
for (let i = 0; i < 10; i++) {
  const x = 1.05 + (i % 5) * 2.35, y = 2.5 + Math.floor(i / 5) * 2.1;
  T(s, [{ text: String(i + 1), options: { hyperlink: { slide: Q0 + i * 2, tooltip: 'Question ' + (i + 1) } } }],
    { x, y, w: 2.0, h: 1.75, fontFace: HEAD, fontSize: 60, color: C.white, align: 'center', valign: 'middle', fill: { color: i % 2 ? C.blue : C.royal }, shape: pres.ShapeType.roundRect, rectRadius: 0.2, objectName: 'Number ' + (i + 1) });
}

sec('Raffle questions (open from the number board)');
const QUIZ = [
  ['Public Relations', 'In the RACE model of public relations, what do the four letters stand for?', 'Research, Action, Communication, Evaluation'],
  ['Advertising', 'What does the advertising model AIDA stand for?', 'Attention, Interest, Desire, Action'],
  ['Journalism', 'What are the "5 Ws and H" every news story should answer?', 'Who, What, When, Where, Why and How'],
  ['Broadcasting', 'Which government body regulates radio and television broadcasting in Nigeria?', 'The National Broadcasting Commission (NBC)'],
  ['Media Monitoring & Evaluation', 'Which global principles for measuring PR and communication, first agreed in 2010, are named after a Spanish city?', 'The Barcelona Principles'],
  ['Digital & New Media', 'What does SEO stand for?', 'Search Engine Optimisation'],
  ['Film & Multimedia', 'In film production, what is a storyboard?', 'Drawings that plan each shot or scene before filming'],
  ['Development Communication', 'What do the letters SDGs stand for, and how many goals are there?', 'Sustainable Development Goals. There are 17.'],
  ['Personal Branding', 'On LinkedIn, what is the short line under your name that tells people what you do called?', 'Your headline'],
  ['Strategic Communication', 'What does SWOT stand for?', 'Strengths, Weaknesses, Opportunities, Threats'],
];
const back = (s) => T(s, [{ text: '← Back to the number board', options: { hyperlink: { slide: BOARD } } }], { x: 0.6, y: 6.35, w: 4.5, h: 0.4, fontSize: 14, bold: true, color: C.royal });
QUIZ.forEach(([field, q, a], i) => {
  let s = add('LIGHT', `Question ${i + 1}: ${field}. Answer: ${a}`);
  pill(s, `Question ${i + 1} · ${field}`, 0.6, 1.4, { w: 5.6 });
  T(s, q, { x: 0.6, y: 2.05, w: 7.6, h: 3.6, fontFace: HEAD, fontSize: q.length > 100 ? 30 : 34, valign: 'top' });
  s.addImage({ path: IMG(`fan${i + 1}.jpg`), x: 8.7, y: 1.3, w: 4.0, h: 4.0, rotate: 3 });
  T(s, 'THE PRIZE + AIRTIME OR DATA', { x: 8.7, y: 5.5, w: 4.0, h: 0.4, fontSize: 13, bold: true, color: C.muted, align: 'center', charSpacing: 3 });
  back(s);
  s = add('LIGHT', `Answer to question ${i + 1}.`);
  pill(s, `Question ${i + 1} · ${field}`, 0.6, 1.4, { w: 5.6 });
  body(s, q, { x: 0.6, y: 2.0, w: 7.6, h: 1.4, fontSize: 18 });
  pill(s, 'Answer', 0.6, 3.5, { fill: C.yellow, color: C.ink, w: 1.8 });
  T(s, a, { x: 0.6, y: 4.05, w: 7.6, h: 2.0, fontFace: HEAD, fontSize: a.length > 40 ? 30 : 36, color: C.royal, valign: 'top' });
  s.addImage({ path: IMG(`fan${i + 1}.jpg`), x: 8.7, y: 1.3, w: 4.0, h: 4.0, rotate: 3 });
  back(s);
});
s = add('DARK', 'Show after each correct answer.'); ast(s, 0.8, 0.7, 1.6); ast(s, 10.9, 4.6, 1.9, 20);
T(s, 'WINNER!', { x: 0, y: 1.9, w: W, h: 1.9, fontFace: HEAD, fontSize: 120, color: C.yellow, align: 'center' });
T(s, 'You got it right. Keep winning.', { x: 0, y: 3.9, w: W, h: 0.7, fontFace: 'Georgia', italic: true, fontSize: 30, color: C.white, align: 'center' });
T(s, 'Collect your hand fan and airtime or data by the stage', { x: 0, y: 4.8, w: W, h: 0.5, fontSize: 20, bold: true, color: 'D6DCF5', align: 'center' });

// ---------------- CV TALK + TALK 3 ----------------
sec('CV talk and Talk 3 (10:57)');
s = add('PLAIN', 'Opemipo: replace the dashed placeholder with the speaker card and add the surname.'); ast(s, -0.5, 5.4, 1.6, 0, 40);
placeholder(s, 0.9, 0.55, 5.0, 6.25, 'Opemipo\n[speaker card / photo]');
pill(s, 'Up next · 5-minute talk', 6.6, 1.5, { fill: C.yellow, color: C.ink, w: 3.8 });
h1(s, 'The relevance of building a good CV/portfolio', { x: 6.6, y: 2.15, w: 6.2, h: 1.9, fontSize: 36 });
T(s, 'for early career builders', { x: 6.6, y: 4.05, w: 6, h: 0.5, fontFace: 'Georgia', italic: true, fontSize: 22, color: C.royal });
T(s, 'Opemipo [surname]', { x: 6.6, y: 4.75, w: 6, h: 0.5, fontSize: 24, bold: true, color: C.royal });

s = add('PLAIN', 'Up next: Onaopemipo Famori.'); ast(s, -0.5, 5.4, 1.6, 0, 40);
card(s, 'onaopemipo.jpg', 0.9, 0.55, 5.0);
pill(s, 'Up next · Talk 3', 6.6, 1.5, { fill: C.yellow, color: C.ink });
h1(s, 'Building Your Professional Presence', { x: 6.6, y: 2.15, w: 6.2, h: 1.9, fontSize: 38 });
T(s, 'Onaopemipo Famori', { x: 6.6, y: 4.2, w: 6, h: 0.5, fontSize: 24, bold: true, color: C.royal });

s = add('LIGHT', 'Announcement 4: the book offer.');
pill(s, 'From our sponsor · P+ Measurement', 0.6, 1.4, { w: 5.9 });
h1(s, 'The Science of Public Relations', { x: 0.6, y: 2.0, w: 7.3, h: 1.6, fontSize: 38 });
T(s, 'A Comprehensive Guide to Measurement and Evaluation · by Philip Odiakose', { x: 0.6, y: 3.6, w: 7.3, h: 0.5, fontFace: 'Georgia', italic: true, fontSize: 18, color: C.royal });
T(s, [{ text: '₦10,000', options: { fontFace: HEAD, fontSize: 40, color: C.ink } }, { text: '  instead of ₦15,000', options: { fontSize: 22, color: C.muted, bold: true } }], { x: 0.6, y: 4.3, w: 7.3, h: 0.8, valign: 'middle' });
body(s, 'When ten of us sign up. Give your name at the front desk. Three copies are also donated to the Department of Mass Communication.', { x: 0.6, y: 5.2, w: 7.3, h: 1.2, fontSize: 19 });
s.addImage({ path: IMG('book.jpg'), x: 8.4, y: 1.2, w: 4.4, h: 4.4 });

// ---------------- PANEL ----------------
sec('Panel and Q&A (11:24)');
s = add('PLAIN', 'Panel + Q&A. Fill in the student moderator name and photo when confirmed.'); ast(s, -0.5, 5.4, 1.6, 0, 40);
card(s, 'jegede.jpg', 0.55, 0.6, 2.7); card(s, 'barnabas.jpg', 3.4, 0.6, 2.7);
placeholder(s, 6.25, 0.6, 2.7, 3.375, 'Moderator\n[photo]');
T(s, 'With Samuel Ogundeji, Onaopemipo Famori, Opemipo [surname] and Gabriel Ntoka (if online)', { x: 0.55, y: 4.25, w: 8.4, h: 0.8, fontSize: 15, color: C.muted, valign: 'top' });
T(s, 'Moderator: [name], student', { x: 0.55, y: 5.1, w: 8.4, h: 0.45, fontSize: 18, bold: true, color: C.royal });
pill(s, 'Up next · Panel + Q&A', 9.35, 1.2, { fill: C.yellow, color: C.ink, w: 3.5 });
h1(s, 'You Media: the new normal in the media landscape', { x: 9.35, y: 1.85, w: 3.6, h: 3.6, fontSize: 26 });

s = add('DARK', 'Q&A: the only question time of the day.');
s.addImage({ path: IMG('tc-logo-white.png'), x: 0.6, y: 0.45, w: 1.8, h: 0.8 }); ast(s, 10.8, 1.2, 2.0);
pill(s, 'Open Q&A', 0.9, 1.9, { fill: C.yellow, color: C.ink, w: 2.2 });
h1(s, ['Ask your\n', em('question', C.yellow)], { x: 0.9, y: 2.55, w: 9, h: 2.2, color: C.white, fontSize: 60 });
body(s, 'Raise your hand for the microphone. Every speaker and panelist is on stage to answer.', { x: 0.9, y: 4.95, w: 8.5, h: 1.0, color: 'D6DCF5', fontSize: 22 });

sec('Raffle round 2 (11:54)');
s = add('DARK', 'Round 2: click the button to open the number board. Use only the numbers not yet taken.'); ast(s, 11.0, 0.6, 1.8);
pill(s, 'Raffle draw', 5.07, 1.5, { fill: C.yellow, color: C.ink });
T(s, 'Round 2', { x: 0, y: 2.2, w: W, h: 1.6, fontFace: HEAD, fontSize: 96, color: C.white, align: 'center' });
T(s, [{ text: 'Open the number board →', options: { hyperlink: { slide: BOARD } } }], { x: 4.67, y: 4.2, w: 4.0, h: 0.7, fontSize: 22, bold: true, color: C.ink, fill: { color: C.yellow }, align: 'center', valign: 'middle', shape: pres.ShapeType.roundRect, rectRadius: 0.35 });

// ---------------- CLOSING ----------------
sec('Closing (11:59)');
s = add('PLAIN', 'Announcement 5: thank sponsors and partners.');
T(s, [{ text: 'Thank ' }, em('you!')], { x: 0.8, y: 1.6, w: 5.8, h: 1.3, fontFace: HEAD, fontSize: 60, valign: 'top' });
body(s, 'To our speakers, panelists, compere, partners and sponsors, and to every student in this hall.', { x: 0.8, y: 3.1, w: 5.5, h: 1.3, fontSize: 20 });
T(s, [{ text: 'Zofu Pro, 1 month free: ', options: { bold: true, color: C.ink } }, { text: 'zofu.one', options: { bold: true, color: C.royal, hyperlink: { url: 'https://www.zofu.one/' } } }], { x: 0.8, y: 4.6, w: 5.5, h: 0.5, fontSize: 20 });
s.addImage({ path: IMG('tc-logo.png'), x: 0.8, y: 5.4, w: 2.4, h: 1.07 });
s.addImage({ path: IMG('partners.jpg'), x: 7.2, y: 0.45, w: 5.2, h: 6.5 });

s = add('DARK', 'Gift for posting: type the two names before showing. Do not say what the gift is.'); ast(s, 11.0, 0.7, 1.7);
pill(s, 'Thank you for posting', 4.67, 1.2, { fill: C.yellow, color: C.ink, w: 4.0 });
T(s, 'A gift from the founder of P+ Measurement goes to…', { x: 0.8, y: 1.95, w: W - 1.6, h: 0.8, fontFace: 'Georgia', italic: true, fontSize: 28, color: C.white, align: 'center' });
[0, 1].forEach((i) => T(s, `[Student ${i + 1}]`, { x: 1.4 + i * 5.5, y: 3.2, w: 5.0, h: 1.4, fontFace: HEAD, fontSize: 34, color: C.deep, align: 'center', valign: 'middle', fill: { color: C.white }, shape: pres.ShapeType.roundRect, rectRadius: 0.2 }));
T(s, 'Please come forward.', { x: 0, y: 5.1, w: W, h: 0.6, fontSize: 22, bold: true, color: 'D6DCF5', align: 'center' });

s = add('LIGHT', 'Vote of thanks by a student representative.');
pill(s, 'Vote of thanks', 0.9, 2.2);
h1(s, '[Student representative]', { x: 0.9, y: 2.85, w: 11, h: 1.0, fontSize: 48 });
body(s, 'On behalf of the students of the Department of Mass Communication', { x: 0.9, y: 4.0, w: 10, h: 0.8, fontSize: 22 });
ast(s, 11.3, 1.0, 1.6);

s = add('DARK', 'Group photo: very important.'); ast(s, 11.1, 0.7, 1.8);
pill(s, 'Before you leave', 4.87, 1.3, { fill: C.yellow, color: C.ink, w: 3.6 });
T(s, [{ text: 'Group photo\nat the ' }, { text: 'backdrop', options: { fontFace: 'Georgia', italic: true, color: C.yellow } }], { x: 0, y: 2.0, w: W, h: 2.4, fontFace: HEAD, fontSize: 60, color: C.white, align: 'center', valign: 'middle' });
T(s, 'Add your sticky note to the prompt wall, take a picture with the Instagram frame, and register for your certificate at the front desk.', { x: 1.5, y: 4.7, w: W - 3, h: 1.0, fontSize: 20, color: 'D6DCF5', align: 'center' });

s = add('LIGHT');
pill(s, 'Tech & Comms 2027', 0.9, 1.5, { w: 3.2 });
h1(s, ['Which university\nshould we visit ', em('next?')], { x: 0.9, y: 2.15, w: 7.3, h: 2.2, fontSize: 44 });
body(s, 'Scan to register your school. We are going to 5 to 10 universities across Africa in 2027.', { x: 0.9, y: 4.55, w: 6.8, h: 1.0 });
box(s, 8.6, 1.3, 3.9, 5.2);
s.addImage({ path: IMG('qr-site.png'), x: 8.9, y: 1.6, w: 3.3, h: 3.3 });
T(s, 'tech-and-comms.vercel.app', { x: 8.6, y: 5.2, w: 3.9, h: 0.5, fontSize: 15, bold: true, color: C.muted, align: 'center' });

s = add('PLAIN'); ast(s, 11.2, 0.6, 2.0); ast(s, -0.6, 5.0, 1.8, 0, 40);
s.addImage({ path: IMG('tc-logo.png'), x: 4.27, y: 1.0, w: 4.8, h: 2.13 });
T(s, 'See you online.', { x: 0, y: 3.55, w: W, h: 0.9, fontFace: 'Georgia', italic: true, fontSize: 44, color: C.royal, align: 'center' });
T(s, '#TechAndComms', { x: 0, y: 4.5, w: W, h: 0.6, fontSize: 28, bold: true, align: 'center' });
T(s, 'tech-and-comms.vercel.app · The Comms Boardroom Technologies', { x: 0, y: 5.2, w: W, h: 0.5, fontSize: 16, color: C.muted, align: 'center' });

sec('Backup');
s = add('DARK', 'For technical breaks.');
s.addImage({ path: IMG('tc-logo-white.png'), x: 4.67, y: 1.3, w: 4.0, h: 1.78 });
T(s, "We'll be right back", { x: 0, y: 3.6, w: W, h: 1.0, fontFace: HEAD, fontSize: 48, color: C.white, align: 'center' });
T(s, 'Stay with us. Where comms meets tech.', { x: 0, y: 4.7, w: W, h: 0.6, fontFace: 'Georgia', italic: true, fontSize: 24, color: C.yellow, align: 'center' });

pres.writeFile({ fileName: out }).then(() => console.log('wrote', out, pres.slides.length, 'slides; board =', BOARD));
