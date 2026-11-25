// "Mass Communication Curricula in Nigeria and Africa: What Exists Today" — research report on the TCBR letterhead.
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, VerticalAlign, AlignmentType, LevelFormat, PageBreak, ExternalHyperlink } = d;
const [notesDir, coursesJson, out] = process.argv.slice(2);
const head = fs.readFileSync(path.join(notesDir, 'lh/head.png')), foot = fs.readFileSync(path.join(notesDir, 'lh/foot.png'));
const C = JSON.parse(fs.readFileSync(coursesJson, 'utf8'));
const NAVY = '131838', BLUE = '5A7BFE', MUTED = '4B537A', SOFT = 'F2F5FC', YEL = 'FFF3C4', RED = 'FBE3E3', GRN = 'E3F4EA', FONT = 'Arial', MM = 56.6929, CW = Math.round(170 * MM), EMU_MM = 36000;
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, hair = { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F8' };
const T = (t, o = {}) => new TextRun({ text: t, ...o });
const P = (c, o = {}) => new Paragraph({ children: Array.isArray(c) ? c : [T(c)], spacing: { after: 100, line: 290 }, ...o });
const H1 = t => new Paragraph({ heading: d.HeadingLevel.TITLE, children: [T(t)] });
const H2 = (n, t) => new Paragraph({ heading: d.HeadingLevel.HEADING_2, keepNext: true, children: [T(n ? n + '  ' : '', { color: BLUE }), T(t)] });
const H3 = t => new Paragraph({ keepNext: true, spacing: { before: 200, after: 80 }, children: [T(t, { bold: true, size: 20, color: NAVY })] });
const B = items => items.map(x => new Paragraph({ numbering: { reference: 'dots', level: 0 }, spacing: { after: 60, line: 280 }, children: Array.isArray(x) ? x : [T(x)] }));
const bold = (a, b) => [T(a, { bold: true, color: NAVY }), T(b)];
const link = (text, url) => new ExternalHyperlink({ link: url, children: [T(text, { style: 'Hyperlink', size: 16 })] });
function cell(children, w, o = {}) {
  return new TableCell({ width: { size: w, type: WidthType.DXA }, children, verticalAlign: VerticalAlign.TOP,
    margins: { top: 60, bottom: 60, left: 90, right: 90 }, shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
    borders: { top: none, left: none, right: none, bottom: hair } });
}
const txt = (s, o = {}) => [new Paragraph({ spacing: { after: 0 }, children: [T(String(s), { size: o.size || 16, bold: o.bold, color: o.color })] })];
function table(widths, header, rows, fills) {
  const tr = [new TableRow({ tableHeader: true, cantSplit: true, children: header.map((h, i) => cell(txt(h.toUpperCase(), { bold: true, color: 'FFFFFF', size: 13 }), widths[i], { fill: NAVY })) })];
  rows.forEach((r, ri) => tr.push(new TableRow({ cantSplit: true, children: r.map((c, i) => cell(Array.isArray(c) ? c : txt(c), widths[i], { fill: fills && fills[ri] && fills[ri][i] })) })));
  return new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: widths, rows: tr });
}
const mm = n => Math.round(n * MM);
const clean = s => s.replace(/\s*Total\s*\d+.*$/i, '').replace(/Majo\s*r\b/gi, '').replace(/\s+[A-Z]\s*$/, '').replace(/\s+/g, ' ').replace(/not-for -Profit/, 'not-for-profit').trim();

// ---------- content ----------
const kids = [];
kids.push(P([T('TCBR RESEARCH BRIEF · NOVEMBER 2026', { bold: true, size: 15, color: BLUE, characterSpacing: 40 })], { spacing: { after: 80 } }),
  H1('Mass Communication Curricula in Nigeria and Africa: What Exists Today'),
  P([T('A review of the national curriculum for communication degrees in Nigeria, before and after the 2022 split of Mass Communication, compared with programmes elsewhere in Africa. Prepared as the evidence base for Tech & Comms and TCBR\'s call for curriculum reform.', { italics: true, size: 21, color: MUTED })], { spacing: { after: 200 } }));

kids.push(H2('', 'Key findings'), ...B([
  bold('Nigeria has one national standard. ', 'The National Universities Commission\'s Core Curriculum and Minimum Academic Standards (CCMAS) for Communication and Media Studies, dated 2022, replaced the older Benchmark Minimum Academic Standards (BMAS). It sets 70% of each programme; universities design the other 30%.'),
  bold('Mass Communication was split into nine programmes: ', 'Advertising, Broadcasting, Development Communication Studies, Film and Multimedia, Information and Media Studies, Journalism and Media Studies, Mass Communication (still allowed), Public Relations, and Strategic Communication.'),
  bold('The document promises AI, but the courses do not deliver it. ', 'Its introduction says the curriculum will "promote Artificial Intelligence". Across all nine programmes, AI appears only in the general entrepreneurship course (ENT 312 Venture Creation), in a list of new technologies. No communication course teaches AI.'),
  bold('Social listening appears nowhere; media monitoring appears once. ', '"Social listening" is not mentioned in any programme. "Media monitoring" appears once, as an example of work a Strategic Communication student might put in a placement portfolio (STC 402).'),
  bold('Measurement is thin and has no standard. ', 'The Public Relations core mentions evaluation once, as the last stage of campaign planning (PRS 401). No programme references a recognised measurement framework such as the AMEC Barcelona Principles.'),
  bold('The PR degree\'s only digital course is already dated. ', 'PRS 203 Digital and Social Media for Public Relations names Photoshop, InDesign, iMovie, Dreamweaver and Flash (Flash was discontinued in 2020) and focuses on Facebook, Twitter, LinkedIn and YouTube.'),
  bold('The closest thing to analytics is in Strategic Communication. ', 'STC 403 Digital Strategic Communication Analytics is the only course in the nine programmes dedicated to analysing digital communication data. Public Relations students do not take it.'),
  bold('Elsewhere in Africa, some universities are ahead. ', 'Misr International University (Egypt) offers "Public Relations and Artificial Intelligence", "Web Analytics" and "Data for Integrated Marketing Communication". The University of Botswana\'s revised PR degree includes "Social Media Management for PR" and "Understanding Behaviours of Media Consumers". These are individual universities, not national standards.'),
]));

kids.push(H2('01', 'How communication degrees are governed in Nigeria'), ...B([
  bold('Before 2022: BMAS. ', 'Universities taught a single Mass Communication degree under the NUC\'s Benchmark Minimum Academic Standards, with local course codes (for example MAC at the University of Nigeria, Nsukka).'),
  bold('2022: CCMAS. ', 'The NUC reviewed every discipline between March and November 2021 and published the CCMAS (the Communication and Media Studies volume is dated 2022). Highlights: 70% core set nationally, 30% set by each university; blended learning; General Studies cut from 36 to 12 credit units; programme-specific entrepreneurship; a new discipline of Communication and Media Studies.'),
  bold('Implementation has been slow and uneven. ', 'Press reports put the planned start at 2023. By the earlier target date, only four of 67 universities offering Mass Communication had begun to unbundle. The University of Lagos has since unbundled into five programmes under a new Faculty of Communication and Media Studies, and the NUC approved the University of Nigeria, Nsukka\'s split into five programmes from the 2026/2027 session.'),
  bold('Debate continues. ', 'ASUU criticised the split, arguing it would give graduates narrow specialisations. The NUC has confirmed that Mass Communication remains a valid degree.'),
]));

// Pre-split example: UNN four-year programme (major courses only)
kids.push(H2('02', 'Before the split: what a Mass Communication degree looked like'),
  P('Example: the University of Nigeria, Nsukka four-year Mass Communication programme (major courses, as published by the department). Technology appears as typesetting, computer science and general ICT; there is no course on digital media data, monitoring or measurement.'),
  table([mm(18), CW - mm(18)], ['Year', 'Major courses'], [
    ['Year 1', 'MAC 101 Introduction to Mass Communication · MAC 103 History of the Nigerian Mass Media · MAC 111 Elements of Journalistic Style · MAC 102 African Communication Systems · MAC 112 Writing for the Mass Media · MAC 132 Typesetting'],
    ['Year 2', 'MAC 201 Theories of Mass Communication · MAC 203 Reporting · MAC 205 Graphics of Mass Communication · MAC 211 Critical and Review Writing · MAC 221 Announcing and Performance · MAC 241 Principles of Public Relations · MAC 261 Introduction to Film · MAC 202 Media and Society · MAC 204 Information and Communication Technologies · MAC 212 News Writing · MAC 222 Principles of Broadcasting · MAC 242 Principles of Advertising · MAC 252 Media Attachment (+ COS 101 Introduction to Computer Science)'],
    ['Year 3', 'MAC 301 Development Journalism · MAC 311 Feature and Interpretative Writing · MAC 313 Magazine Article Writing · MAC 321 Radio/TV Programme Writing and Production · MAC 331 News Editing · MAC 333 Book Publishing · MAC 361 Photojournalism · MAC 302 Specialised Reporting · MAC 312 Editorial Writing · MAC 322 Broadcast Programming · MAC 332 Newspaper Production · MAC 334 Magazine Production · MAC 352 Media Attachment · MAC 382 Introduction to Mass Communication Research · MAC 384 Advertising and Public Relations Research (+ COS 304 Computer Applications)'],
    ['Year 4', 'MAC 401 Mass Communication Law and Ethics · MAC 403 International Communication · MAC 421 Advanced Radio/TV Production · MAC 431 Advanced Newspaper Production · MAC 433 Advanced Magazine Production · MAC 435 Print Seminar · MAC 441 Advanced Public Relations · MAC 402 Media Management · MAC 422 Broadcast Seminar · MAC 442 Advanced Advertising · MAC 462 Documentary Film Production · MAC 490 Project'],
  ]));

// After the split: PR core table
const levelRows = prog => C[prog].map(r => [r.level, r.code, clean(r.title), String(r.units)]);
kids.push(H2('03', 'After the split: the Public Relations degree (CCMAS core, 100 to 400 level)'),
  P(`All ${C['Public Relations'].length} core courses, ${C['Public Relations'].reduce((a, r) => a + r.units, 0)} credit units. Universities add their own 30% on top. Courses relevant to digital, data and measurement are shaded.`),
  table([mm(15), mm(22), CW - mm(52), mm(15)], ['Level', 'Code', 'Course', 'Units'], levelRows('Public Relations'),
    C['Public Relations'].map(r => /digital|data|research|planning/i.test(r.title) ? [YEL, YEL, YEL, YEL] : null)));

kids.push(H2('04', 'Gap analysis: the nine CCMAS programmes'),
  P('What the national core says about the areas Tech & Comms teaches. "Course content" means the topic is mentioned inside a course description; "dedicated course" means a course is about it.'),
  table([mm(38), mm(26), mm(24), mm(26), CW - mm(114)], ['Programme', 'AI in communication', 'Social listening', 'Media monitoring', 'Measurement, data and analytics'], [
    ['Public Relations', 'None', 'None', 'None', 'PRS 301 Public Relations Research (statistics, RACE); "evaluation" once in PRS 401; CMS 303 Data Analysis (SPSS)'],
    ['Strategic Communication', 'None', 'None', 'Once (STC 402 portfolio item)', 'STC 403 Digital Strategic Communication Analytics (dedicated); STC 303 Research Methods'],
    ['Mass Communication', 'None', 'None', 'None', 'MCM 313 Advertising and PR Research; CMS 303 Data Analysis'],
    ['Advertising', 'None', 'None', 'None', 'ADV 311 Advertising and Market Research; ADV 316 Quantitative Thinking in Advertising; ADV 221 Digital Marketing'],
    ['Journalism and Media Studies', 'None', 'None', 'None', 'JMS 303 Scientific and Data Journalism'],
    ['Broadcasting', 'None', 'None', 'None', 'CMS 303 / BCJ 402 Data Analysis in Communication Research'],
    ['Development Communication', 'None', 'None', 'None', 'DCS 404 Development Project Monitoring and Evaluation (projects, not media)'],
    ['Film and Multimedia', 'None', 'None', 'None', 'FMM 202 Digital Literacy'],
    ['Information and Media Studies', 'None', 'None', 'None', 'Strong on computing and graphics; ISM 313 Introduction to Social Media Network'],
  ], Array(9).fill([null, RED, RED, null, null]).map((r, i) => i === 1 ? [null, RED, RED, YEL, GRN] : r)),
  P([T('Across all nine programmes, the only mention of artificial intelligence is in ENT 312 Venture Creation, the general entrepreneurship course every student takes: "business applications of new technologies - Artificial Intelligence (AI), Virtual/Mixed Reality (VR), Internet of Things (IoTs), blockchain, cloud computing".', { size: 18, italics: true, color: MUTED })], { spacing: { before: 120 } }));

kids.push(H3('What the key courses actually say'), ...B([
  bold('PRS 203 Digital and Social Media for PR: ', '"Students will be required to build an integrated campaign and web site using software, which includes Photoshop, InDesign, iMovie, Dream weave, Flash and other applications… Emphasis will be placed on Facebook, twitter, linked-In and the YouTube."'),
  bold('PRS 301 Public Relations Research: ', 'definitions and types of research, RACE, designing research instruments, statistical software and interpreting outputs, ethics. No media monitoring, listening or measurement frameworks.'),
  bold('PRS 401 Campaign Planning and Execution: ', '"Stages of PRS planning and execution include briefs, creative strategy documents, copy platform, visuals, media planning, execution and evaluation." Evaluation is named but not taught as a method.'),
  bold('STC 403 Digital Strategic Communication Analytics: ', '"methods and principles that guide the extracting of useful information from digital communication data… a useful basis for campaign strategy". The closest course to media intelligence in the national core.'),
  bold('CMS 303 Data Analysis in Communication Research: ', 'tables, graphs, statistical techniques and software such as SPSS. Research statistics, not media data.'),
]));

kids.push(H2('05', 'Elsewhere in Africa'),
  P('These are individual universities, not national standards. "Read" means we read the university\'s own published course list; "Reported" means the information comes from news or secondary sources.'),
  table([mm(22), mm(40), CW - mm(80), mm(18)], ['Country', 'Institution and programme', 'What stands out', 'Evidence'], [
    ['Egypt', 'Misr International University: Integrated Marketing Communication major with an Advertising or PR specialisation', 'Required: Data for Integrated Marketing Communication; Social Media Marketing & Campaigns; Public Relations in Social Media Campaigns; Web Analytics. Elective: Public Relations and Artificial Intelligence; Influencer Marketing Strategies. PR track: Risk & Crisis Communication; Strategic Planning for PR.', 'Read'],
    ['Botswana', 'University of Botswana: Bachelor of Public Relations and Integrated Communication (revised)', 'Basics of Digital Media; Social Media Management for PR (optional); Understanding Behaviours of Media Consumers; Research for PR & Advertising (optional); Communication Research Methods; Public Communication Campaigns; two work placements.', 'Read'],
    ['South Africa', 'University of Johannesburg: BA in Strategic Communication', 'Strategic Communication 2D: Digital Communication; 3A: Strategic Insights. A separate short course in Digital PR covers dashboards, metrics and analytics.', 'Reported'],
    ['Ghana', 'UniMAC-GIJ (formerly Ghana Institute of Journalism)', 'Introduced a BA in Public Relations with Marketing and a Diploma in PR in 2022. Earlier BA in Communication Studies with Journalism or PR options.', 'Reported'],
    ['Kenya', 'University of Nairobi; Daystar University; Multimedia University', 'UoN has offered a BA in Journalism and Media Studies since 2006. Daystar runs a four-year BA in Public Relations with a PRSK certification partnership. Multimedia University says its PR curriculum was revised with input from PRSK.', 'Reported'],
    ['Rwanda', 'University of Rwanda; University of Kabgayi', 'UR offers a three-year BA (Hons) in Journalism and Communication. Kabgayi\'s PR modules cover PR principles, tools and techniques, rhetoric and persuasion, public speaking and PR ethics.', 'Reported'],
  ]));

kids.push(H2('06', 'Global and pan-African reference points'), ...B([
  bold('UNESCO Model Curricula for Journalism Education ', '(2007, with a 2013 compendium of new syllabi): adapted in more than 60 countries. Journalism-focused, not PR.'),
  bold('UNESCO, Reporting on Artificial Intelligence: A Handbook for Journalism Educators ', '(2023): designed as a model curriculum resource on AI.'),
  bold('African Union, UNESCO and the University of Johannesburg ', '(2025): partnership to adapt at least five UNESCO journalism handbooks for Africa, including a module on reporting on AI and emerging technologies.'),
  bold('AMEC Barcelona Principles 3.0 ', '(2020): the industry\'s global standard for measuring communication. Not referenced in the CCMAS.'),
]));

kids.push(H2('07', 'What the evidence supports'),
  H3('Claims you can make with confidence'), ...B([
    'Nigeria\'s national curriculum for communication degrees (CCMAS, 2022) promises to "promote Artificial Intelligence", but none of its communication courses teaches AI; it appears only in the general entrepreneurship course.',
    'Social listening is not mentioned anywhere in the nine national communication programmes, and media monitoring appears only once, as a portfolio example.',
    'The Public Relations core has no course on measurement or evaluation and does not reference any recognised measurement standard.',
    'The only digital course in the PR core still lists Flash and Dreamweaver as its software.',
    'Some African universities already teach PR and AI, web analytics and social media management, which shows the change is possible.',
  ]),
  H3('Claims to avoid or qualify'), ...B([
    '"No Nigerian university teaches AI or social listening." Universities design 30% of each programme, so some may already teach these topics. Say "the national core curriculum does not require them".',
    '"Mass Communication has been abolished." The NUC says it remains a valid degree.',
    'Any figure for "all 54 countries". This brief covers Nigeria in depth and six other countries by example.',
  ]));

kids.push(H2('08', 'Limits and next steps'), ...B([
  'The CCMAS copy reviewed is the Communication and Media Studies volume (266 pages, dated 2022) as hosted by Trinity University; confirm against the NUC\'s official copy before citing page numbers.',
  'University course lists outside Nigeria were read where the university publishes them; others are reported from secondary sources and should be checked with the departments.',
  'A full 54-country picture would need each country\'s regulator and at least one university handbook per country. We suggest doing it in phases: West Africa, then East, Southern and North Africa.',
  'The Tech & Comms student survey will add first-hand evidence on what students have and have not been taught.',
]));

kids.push(H2('', 'Sources'), ...[
  ['NUC CCMAS, Communication and Media Studies (2022), hosted by Trinity University', 'https://trinityuniversity.edu.ng/wp-content/uploads/Communication-and-Media-Studies.pdf'],
  ['University of Nigeria, Nsukka: Four-year undergraduate programme', 'https://masscomm.unn.edu.ng/undergraduate-degree-programme'],
  ['NUC: unbundling of Mass Communication', 'https://www.nuc.edu.ng/nuc-unbundles-mass-communication/'],
  ['The Guardian: Unbundling of mass communication takes effect September 2021, says NUC', 'https://guardian.ng/news/unbundling-of-mass-communication-takes-effect-september-2021-says-nuc/'],
  ['The Guardian: UNILAG unbundles Mass Communication programme', 'https://guardian.ng/?p=2571845'],
  ['Financial Edge: NUC approves unbundling of UNN Mass Communication into five programmes', 'https://www.financialedge.com.ng/nuc-approves-unbundling-of-unn-mass-communication-into-five-programmes'],
  ['The Whistler: NUC did not abolish Mass Communication degree', 'https://thewhistler.ng/nuc-did-not-abolish-mass-communication-degree-spokesman-﻿/'],
  ['Misr International University: Faculty of Mass Communication new curriculum', 'https://miuegypt.edu.eg/academics/faculty-of-mass-communication/new-curriculum-mcm/'],
  ['University of Botswana: Bachelor of Public Relations and Integrated Communication', 'https://www.ub.bw/programmes/humanities/media-studies/bachelor-public-relations-and-integrated-communication-bpc'],
  ['University of Johannesburg: BA majoring in Strategic Communication', 'https://www.uj.ac.za/wp-content/uploads/2021/10/ba-majoring-in-strategic-communication-phased-in-2020.docx'],
  ['University of Johannesburg: Short learning programme in Digital PR', 'https://www.uj.ac.za/wp-content/uploads/2024/06/uj_hum_slp_digital_pr_2024.pdf'],
  ['Ghana News Agency: UniMAC-GIJ introduces new PR programmes', 'https://gna.org.gh/2022/12/unimac-gij-introduces-new-diploma-ba-and-ma-mphil-programmes-in-pr/'],
  ['University of Nairobi: History of the School of Journalism and Mass Communication', 'https://journalism.uonbi.ac.ke/node/83'],
  ['Daystar University: BA Public Relations', 'https://soc.daystar.ac.ke/ba-public-relations'],
  ['Multimedia University of Kenya: BSc Communication and Public Relations', 'https://is.mu.ac.ke/index.php/k2-categories/undergraduate/bsc-in-communication-and-public-relations'],
  ['University of Rwanda: Undergraduate programmes at a glance', 'https://ur.ac.rw/documents/UNDERGRADUATE PROGRAMS AT A GLANCE.pdf'],
  ['UNESCO: Model curricula for journalism education', 'https://milunesco.unaoc.org/mil-resources/model-curricula-for-journalism-education-for-developing-countries-emerging-democracies'],
  ['UNESCO: Reporting on Artificial Intelligence, a handbook for journalism educators (2023)', 'https://unesco.org.uk/site/assets/files/2266/reporting_on_artificial_intelligence-_a_handbook_for_journalism_educators_2023.pdf'],
  ['African Union: AU, UNESCO and University of Johannesburg partner to contextualise journalism training', 'https://au.int/en/pressreleases/20250812/au-unesco-and-university-johannesburg-partner-contextualise-journalism'],
].map(([t, u]) => new Paragraph({ numbering: { reference: 'dots', level: 0 }, spacing: { after: 40 }, children: [T(t + ': ', { size: 16 }), link(u, u)] })));

// Appendix: all nine programmes
kids.push(new Paragraph({ children: [new PageBreak()] }), H2('A', 'Appendix: CCMAS core courses for all nine programmes'),
  P('Extracted from the CCMAS "Global Course Structure" tables. Universities add 30% of their own courses, so a real timetable will be longer.'));
for (const prog of Object.keys(C)) {
  const units = C[prog].reduce((a, r) => a + r.units, 0);
  kids.push(H3(`B.Sc. ${prog} (${C[prog].length} courses, ${units} units)`),
    table([mm(15), mm(22), CW - mm(52), mm(15)], ['Level', 'Code', 'Course', 'Units'], levelRows(prog)));
}

function letterhead() {
  const w = Math.round(210 / 25.4 * 96);
  const img = (data, hpx, yMm) => new ImageRun({ type: 'png', data, transformation: { width: w, height: Math.round(w * hpx / 1414) },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yMm * EMU_MM) },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } });
  return new Header({ children: [new Paragraph({ children: [img(head, 360, 0), img(foot, 60, 1860 / 2000 * 297)] })] });
}
const doc = new Document({ creator: 'The Comms Boardroom', title: 'Mass Communication Curricula in Nigeria and Africa',
  styles: { default: { document: { run: { font: FONT, size: 19, color: '1B2140' } } }, paragraphStyles: [
    { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 36, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 100 }, keepNext: true } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 23, bold: true, color: NAVY }, paragraph: { spacing: { before: 320, after: 120 }, keepNext: true } }] },
  numbering: { config: [{ reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 340, hanging: 220 } }, run: { color: BLUE } } }] }] },
  sections: [{ properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
    margin: { top: Math.round(62 * MM), bottom: Math.round(26 * MM), left: Math.round(20 * MM), right: Math.round(20 * MM), header: Math.round(5 * MM), footer: Math.round(5 * MM) } } },
    headers: { default: letterhead() }, children: kids }] });
Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log(out); });
