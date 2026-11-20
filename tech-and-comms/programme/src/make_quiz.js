// Printable quiz slips (cut along the dashed lines) + host answer sheet, on the TCBR letterhead.
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, VerticalAlign, AlignmentType, PageBreak } = d;
const dir = process.argv[2], out = process.argv[3];
const head = fs.readFileSync(path.join(dir, 'lh/head.png')), foot = fs.readFileSync(path.join(dir, 'lh/foot.png'));
const NAVY = '131838', BLUE = '5A7BFE', MUTED = '4B537A', YELLOW = 'FFD60A', FONT = 'Arial', MM = 56.6929, CW = Math.round(170 * MM), EMU_MM = 36000;

const SETS = [
  { code: 'Topic 01', title: 'Communications: School vs Reality', q: [
    ['Apart from customers, name two groups a company\'s communications team talks to.', 'Any two: employees, investors or shareholders, regulators or government, the media, the local community, partners or suppliers.'],
    ['What is the difference between PR and advertising?', 'Advertising is paid space the brand controls. PR earns attention and coverage, and manages reputation and relationships.'],
    ['What is a press release? Name one thing every press release should include.', 'An official news statement sent to the media. Any one: a clear headline, date and place, the who/what/when/where/why, a quote, a contact person, an "about the company" paragraph.'],
    ['What is a "holding statement" in a crisis?', 'A short first statement that acknowledges the issue and says more will follow, released while the facts are still being gathered.'],
    ['What is internal communications?', 'Communicating with a company\'s own employees.'],
    ['What is a brand\'s "tone of voice"?', 'The consistent personality and style of the language a brand uses.'],
    ['Name one way technology has changed how brands communicate in Nigeria.', 'Any reasonable answer: social media, real-time responses, WhatsApp channels, influencers and creators, data and analytics, online customer service.'],
    ['In a crisis, why should a brand respond quickly?', 'If it stays silent, others fill the gap with rumours and the story runs without the brand\'s side.'],
  ]},
  { code: 'Topic 02', title: 'Media Monitoring, Intelligence and AI', q: [
    ['What is media monitoring?', 'Tracking what is said about a brand, person or issue across news, broadcast and social media.'],
    ['How is social listening different from media monitoring?', 'Monitoring tracks mentions. Listening analyses the wider conversation (sentiment, themes, trends) to understand why people are talking and what to do next.'],
    ['What does "sentiment" mean in media analysis?', 'Whether coverage or comments are positive, negative or neutral.'],
    ['What is "share of voice"?', 'A brand\'s share of the conversation or coverage compared with its competitors.'],
    ['Give one example of an output and one example of an outcome.', 'Output: number of articles, posts or impressions. Outcome: a change in awareness, attitude or behaviour, for example more sign-ups or better reviews.'],
    ['What is AVE, and why do practitioners no longer recommend it?', 'Advertising Value Equivalency: valuing coverage at what the same space would cost as an ad. It says nothing about the impact of the coverage, so industry principles reject it.'],
    ['Name one task AI can help a communicator with.', 'Any one: summarising coverage, monitoring mentions at scale, sorting sentiment, drafting first versions, translating, spotting trends.'],
    ['Name one thing AI should not do alone in communications.', 'Any one: sign off a crisis statement, make ethical calls, publish without fact-checking, replace relationships with journalists or stakeholders.'],
  ]},
  { code: 'Topic 03', title: 'Building a Personal Brand', q: [
    ['Name three parts of a LinkedIn profile people see first.', 'Profile photo, headline, name. Also accepted: banner image, the About section.'],
    ['What makes a good LinkedIn headline for a student?', 'It says who you are and what you are working towards (for example "Mass Comm student | Writing about PR and brand storytelling"), not just "Student".'],
    ['Finish the line: "The story worth telling isn\'t \'I made it.\' It\'s…"', '"…here\'s who I\'m becoming."'],
    ['Name two things a student can post about before they have "made it".', 'Any two: class projects, events attended, lessons learned, opinions on industry news, internships, volunteering, books or courses.'],
    ['Why does consistency matter more than perfection?', 'Showing up regularly builds visibility and trust over time; waiting for perfect means not showing up at all.'],
    ['What is a portfolio? Name one thing a Mass Comm student could put in it.', 'A collection of your work. Any one: articles, press releases, campaign ideas, designs, videos, podcasts, social media work.'],
    ['Name one mistake to avoid when building a personal brand online.', 'Any one: posting carelessly or offensively, an unprofessional photo, copying others, long silences, saying one thing and doing another.'],
    ['What is networking? Name one place a student can do it.', 'Building professional relationships. Any one: events like this one, LinkedIn, alumni associations, internships, student associations.'],
  ]},
  { code: 'Panel', title: 'You Media and the New Landscape', q: [
    ['What does "You Media" mean?', 'Individuals with their own platforms now act as media, alongside newspapers and broadcasters.'],
    ['Who were the traditional "gatekeepers" of news?', 'Editors, publishers and broadcasters, who decided what became news.'],
    ['Name two platforms people use to stream or go live.', 'Any two: YouTube, TikTok, Instagram Live, Facebook Live, X Spaces, Twitch.'],
    ['What is user-generated content?', 'Content created by ordinary users rather than by brands or media houses.'],
    ['Name one risk of everyone being their own media.', 'Any one: misinformation, no fact-checking, rumours spreading fast, harassment.'],
  ]},
  { code: 'Panel', title: 'Communications in Humanitarian Work', q: [
    ['Name one way communications is used in humanitarian work.', 'Any one: raising awareness, fundraising, informing affected communities, reporting to donors, advocacy, crisis information.'],
    ['What does "informed consent" mean when telling someone\'s story?', 'The person understands how their story or photo will be used and agrees to it freely.'],
    ['Name one career path for Mass Comm graduates outside media and PR agencies.', 'Any one: NGOs and humanitarian work, development, government, health communication, tech companies, corporate communications.'],
  ]},
];

const dash = { style: BorderStyle.DASHED, size: 6, color: '9AA5CF' };
const T = (t, o = {}) => new TextRun({ text: t, ...o });
function card(set, i, q) {
  return new TableCell({ width: { size: CW / 2, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
    borders: { top: dash, bottom: dash, left: dash, right: dash }, margins: { top: 200, bottom: 200, left: 240, right: 240 },
    children: [
      new Paragraph({ spacing: { after: 100 }, children: [T(` ${set.code.toUpperCase()} · Q${i + 1} `, { bold: true, size: 14, color: NAVY, shading: { type: ShadingType.CLEAR, fill: YELLOW, color: 'auto' }, characterSpacing: 20 }),
        T('   ' + set.title, { size: 14, color: MUTED })] }),
      new Paragraph({ spacing: { after: 0, line: 300 }, children: [T(q, { bold: true, size: 22, color: NAVY })] })] });
}
function cards() {
  const all = []; SETS.forEach(s => s.q.forEach((q, i) => all.push(card(s, i, q[0]))));
  const rows = [];
  for (let i = 0; i < all.length; i += 2) rows.push(new TableRow({ cantSplit: true, height: { value: Math.round(42 * MM), rule: d.HeightRule.ATLEAST },
    children: [all[i], all[i + 1] || new TableCell({ width: { size: CW / 2, type: WidthType.DXA }, borders: { top: dash, bottom: dash, left: dash, right: dash }, children: [new Paragraph('')] })] }));
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [CW / 2, CW / 2], rows });
}
function answers() {
  const out = [];
  SETS.forEach(s => {
    out.push(new Paragraph({ heading: d.HeadingLevel.HEADING_2, keepNext: true, children: [T(s.code + '  ', { color: BLUE }), T(s.title)] }));
    s.q.forEach(([q, a], i) => {
      out.push(new Paragraph({ keepNext: true, keepLines: true, spacing: { before: 80, after: 30 }, children: [T(`Q${i + 1}. `, { bold: true, color: BLUE }), T(q, { bold: true, color: NAVY })] }));
      out.push(new Paragraph({ keepLines: true, spacing: { after: 80, line: 280 }, indent: { left: 340 }, children: [T(a, { size: 18 })] }));
    });
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
const total = SETS.reduce((a, s) => a + s.q.length, 0);
const body = [
  new Paragraph({ spacing: { after: 80 }, children: [T('TECH & COMMS · CRAWFORD UNIVERSITY', { bold: true, size: 15, color: BLUE, characterSpacing: 40 })] }),
  new Paragraph({ heading: d.HeadingLevel.TITLE, children: [T('Quiz Cards')] }),
  new Paragraph({ spacing: { after: 120, line: 290 }, children: [T(`${total} question slips. Print, cut along the dashed lines, fold, and put each topic in its own bowl. After each talk, two students draw a slip from that topic's bowl. The panel cards are extras for the end if time allows. The host answer sheet follows the cards; keep it with the host and do not cut it up.`, { color: MUTED, size: 18 })] }),
  cards(),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ heading: d.HeadingLevel.TITLE, children: [T('Host Answer Sheet')] }),
  new Paragraph({ spacing: { after: 120 }, children: [T('Accept any answer that shows the right idea, in the student\'s own words.', { color: MUTED, size: 18, italics: true })] }),
  ...answers(),
];
const docx = new Document({ creator: 'The Comms Boardroom', title: 'Tech and Comms Quiz Cards',
  styles: { default: { document: { run: { font: FONT, size: 19, color: '1B2140' } } }, paragraphStyles: [
    { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 40, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 80 }, keepNext: true } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 22, bold: true, color: NAVY }, paragraph: { spacing: { before: 300, after: 100 }, keepNext: true } }] },
  sections: [{ properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
    margin: { top: Math.round(62 * MM), bottom: Math.round(26 * MM), left: Math.round(20 * MM), right: Math.round(20 * MM), header: Math.round(5 * MM), footer: Math.round(5 * MM) } } },
    headers: { default: letterhead() }, children: body }] });
Packer.toBuffer(docx).then(b => { fs.writeFileSync(out, b); console.log(out, total); });
