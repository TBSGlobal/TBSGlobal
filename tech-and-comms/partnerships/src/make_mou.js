// MOU between The Comms Boardroom Technologies and Zofu.Quest for Tech & Comms, on the TCBR letterhead.
const fs = require('fs'), path = require('path');
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, LevelFormat,
  HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, PageNumber, VerticalAlign } = d;
const [dir, out] = process.argv.slice(2);
const head = fs.readFileSync(path.join(dir, 'lh/head.png')), foot = fs.readFileSync(path.join(dir, 'lh/foot.png'));
const NAVY = '131838', BLUE = '5A7BFE', MUTED = '4B537A', FONT = 'Arial', MM = 56.6929, CW = Math.round(170 * MM), EMU_MM = 36000;
const T = (t, o = {}) => new TextRun({ text: t, ...o });
// [bracketed] = to fill in, highlighted
const runs = (text, base = {}) => text.split(/(\[[^\]]*\])/).filter(Boolean).map(p => p.startsWith('[') ? T(p, { ...base, highlight: 'yellow' }) : T(p, base));
const P = (text, o = {}) => new Paragraph({ spacing: { after: 120, line: 300 }, alignment: AlignmentType.JUSTIFIED, ...o, children: runs(text, o.run || {}) });

const PARTY_A = 'The Comms Boardroom Technologies (TCBR), a communications technology company with its office at 22, Simpson Street, Ebute-Metta, Lagos, Nigeria [and RC number, if registered: RC ______]';
const PARTY_B = '[Registered name of the company that owns Zofu.Quest], the owner and operator of Zofu.Quest (https://www.zofu.quest), an AI tool that helps job seekers tailor their CVs to each job, with its office at [address] [and RC number: RC ______]';

const CLAUSES = [
  ['Purpose', [
    'This Memorandum of Understanding ("MOU") records how TCBR and Zofu will work together on Tech & Comms, a campus seminar series and an initiative of TCBR, starting with its first edition at Crawford University.',
    'Its aim is to give Mass Communication students practical tools for their careers. Zofu will support attendees with free access to its CV revamp tool, and TCBR will recognise Zofu as an official partner of the event.',
  ]],
  ['The event', [
    'Name: Tech & Comms. Date: Thursday, 26 November 2026. Venue: Legacy Hall, Crawford University. Partners: the Department of Mass Communication, Crawford University, and the Crawford University Alumni Association. Audience: Mass Communication students, lecturers and alumni.',
  ]],
  ["Zofu's commitments", [
    'Zofu will give every attendee of the event one (1) month of free access to a Zofu Pro account.',
    'Zofu will provide TCBR with an event-specific access code before 26 November 2026, on or before [date], together with simple instructions for redeeming it.',
    'The Pro access will run for one month from the date each attendee redeems the code. Attendees must redeem the code by [last redemption date].',
    'Zofu intends this offer to feature its newest product update. Zofu will tell TCBR if the update is not live by the event date, so that instructions given to students are accurate.',
    'Zofu will provide its logo files and brand guidelines for use on event materials, and will approve or comment on any material that shows its brand within [two (2)] working days of receiving it.',
    'Zofu will co-publish the partnership announcement as a collaboration post on [Instagram and LinkedIn].',
    'If Zofu agrees, it will share with TCBR, after the event, the total number of codes redeemed. This will be aggregate figures only, with no personal data.',
  ]],
  ["TCBR's commitments", [
    'TCBR will share the access code exclusively with attendees of the event. For example, it will reveal the code in the hall or on materials given only to attendees, and will not publish it on social media, the event website or any public channel.',
    'TCBR will ask attendees not to share the code, and will tell Zofu promptly if it becomes aware the code has been shared publicly, so that Zofu can deactivate or replace it.',
    'TCBR will feature Zofu\'s logo and name as a partner on the event flyer and partnership designs, on event screens, and in TCBR\'s press materials about the event, in the form approved by Zofu.',
    'TCBR will publish the partnership announcement as a collaboration post with Zofu, and will mention Zofu and the Pro offer during the event, including at the close of the programme.',
    'TCBR will not describe the offer in any way that differs from what Zofu has approved, and will direct any technical or account questions from attendees to Zofu.',
  ]],
  ['No payment', [
    'This is a non-monetary partnership. Neither party will pay the other anything under this MOU. Each party will bear its own costs.',
  ]],
  ['Use of names and logos', [
    'Each party gives the other a limited, non-exclusive, royalty-free permission to use its name and logo only to promote Tech & Comms and this partnership, during the term of this MOU, and only in forms the owner has approved.',
    'Each party keeps all rights in its own names, logos, products and content. Nothing in this MOU transfers any intellectual property.',
    'After the term ends, neither party will create new materials using the other\'s brand. Materials already published, such as past social media posts and press coverage, do not need to be removed.',
  ]],
  ['Data protection', [
    'TCBR will not share attendees\' personal data with Zofu under this MOU. Attendees who redeem the code will create their own Zofu accounts and will be bound by Zofu\'s own terms and privacy policy.',
    'Each party will comply with the Nigeria Data Protection Act 2023 and any other data protection law that applies to it.',
  ]],
  ['Confidentiality', [
    'Each party will keep confidential any non-public information it receives from the other in connection with this MOU, including the access code before it is shared with attendees, and will use it only for the purpose of this MOU.',
  ]],
  ['Term and termination', [
    'This MOU starts on the date it is signed by both parties and ends on [31 December 2026], unless both parties extend it in writing.',
    'Either party may end this MOU early by giving the other [seven (7)] days\' written notice, including by email. Pro accounts already activated by attendees will continue for their full month.',
  ]],
  ['Future collaboration', [
    'TCBR plans to take Tech & Comms to five to ten universities in 2027. Both parties are willing to discuss extending this partnership to future editions, under terms to be agreed separately in writing.',
  ]],
  ['Nature of this MOU', [
    'This MOU records the parties\' good-faith intentions. The clauses on use of names and logos, data protection, confidentiality, and term and termination are binding. The other clauses are commitments the parties intend to honour but do not create a legal obligation to pay damages.',
    'Nothing in this MOU creates a partnership in law, joint venture, agency or employment relationship. Neither party may make commitments on behalf of the other.',
    'This MOU is governed by the laws of the Federal Republic of Nigeria. The parties will try to resolve any disagreement through good-faith discussion first.',
  ]],
  ['Contacts', [
    'For TCBR: Samuel Ogundeji, Founder and Lead Consultant · 08160122896 · info@thecommsboardroom.com',
    'For Zofu: [Name], [Title] · +234 811 523 5268 · [email]',
  ]],
];

function letterhead() {
  const w = Math.round(210 / 25.4 * 96);
  const img = (data, hpx, yMm) => new ImageRun({ type: 'png', data, transformation: { width: w, height: Math.round(w * hpx / 1414) },
    floating: { horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: VerticalPositionRelativeFrom.PAGE, offset: Math.round(yMm * EMU_MM) },
      behindDocument: true, allowOverlap: true, wrap: { type: TextWrappingType.NONE } } });
  return new Header({ children: [new Paragraph({ children: [img(head, 360, 0), img(foot, 60, 1860 / 2000 * 297)] })] });
}
const pageFooter = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  T('MOU · TCBR and Zofu.Quest · Tech & Comms · Page ', { size: 14, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], size: 14, color: MUTED }),
  T(' · Initials: ______ / ______', { size: 14, color: MUTED })] })] });

const kids = [
  new Paragraph({ spacing: { after: 60 }, children: [T('DRAFT FOR DISCUSSION', { bold: true, size: 15, color: BLUE, characterSpacing: 40 })] }),
  new Paragraph({ heading: d.HeadingLevel.TITLE, alignment: AlignmentType.CENTER, children: [T('Memorandum of Understanding')] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 280 }, children: [T('Tech & Comms Partnership: Pro access for attendees', { italics: true, size: 22, color: MUTED })] }),
  P('This Memorandum of Understanding is made on [date] between:'),
  P('1. ' + PARTY_A + ' ("TCBR"); and', { indent: { left: 360 } }),
  P('2. ' + PARTY_B + ' ("Zofu"),', { indent: { left: 360 } }),
  P('each a "party" and together "the parties".'),
];
CLAUSES.forEach(([h, items], i) => {
  kids.push(new Paragraph({ heading: d.HeadingLevel.HEADING_2, keepNext: true, children: [T(`${i + 1}.  `, { color: BLUE }), T(h)] }));
  items.forEach((x, j) => kids.push(P(`${i + 1}.${j + 1}  ${x}`, { indent: { left: 567, hanging: 567 }, alignment: h === 'Contacts' ? AlignmentType.LEFT : AlignmentType.JUSTIFIED })));
});

// signatures
const sigCell = (party, name, title) => new TableCell({ width: { size: CW / 2, type: WidthType.DXA }, margins: { top: 120, bottom: 120, left: 120, right: 200 },
  borders: { top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }, right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } },
  children: [
    new Paragraph({ spacing: { after: 360 }, children: [T('For and on behalf of ' + party, { bold: true, color: NAVY })] }),
    new Paragraph({ spacing: { after: 60 }, children: [T('Signature: ____________________________')] }),
    new Paragraph({ spacing: { after: 60 }, children: runs('Name: ' + name) }),
    new Paragraph({ spacing: { after: 60 }, children: runs('Title: ' + title) }),
    new Paragraph({ spacing: { after: 60 }, children: [T('Date: ____________________________')] }),
  ] });
kids.push(new Paragraph({ heading: d.HeadingLevel.HEADING_2, keepNext: true, spacing: { before: 400 }, children: [T('Signatures')] }),
  P('Signed by the authorised representatives of the parties. This MOU may be signed in counterparts and by electronic signature, and a scanned or PDF copy is as valid as the original.', { keepNext: true }),
  new Table({ width: { size: CW, type: WidthType.DXA }, columnWidths: [CW / 2, CW / 2], rows: [new TableRow({ cantSplit: true, children: [
    sigCell('The Comms Boardroom Technologies', 'Samuel Ogundeji', 'Founder and Lead Consultant'),
    sigCell('Zofu.Quest ([company name])', '[Name]', '[Title]')] })] }));

const doc = new Document({ creator: 'The Comms Boardroom Technologies', title: 'MOU - The Comms Boardroom Technologies and Zofu.Quest',
  styles: { default: { document: { run: { font: FONT, size: 20, color: '1B2140' } } }, paragraphStyles: [
    { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 38, bold: true, color: NAVY }, paragraph: { spacing: { before: 0, after: 80 }, keepNext: true } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', run: { font: FONT, size: 21, bold: true, color: NAVY }, paragraph: { spacing: { before: 240, after: 100 }, keepNext: true } }] },
  sections: [{ properties: { page: { size: { width: Math.round(210 * MM), height: Math.round(297 * MM) },
    margin: { top: Math.round(62 * MM), bottom: Math.round(36 * MM), left: Math.round(20 * MM), right: Math.round(20 * MM), header: Math.round(5 * MM), footer: Math.round(25 * MM) } } },
    headers: { default: letterhead() }, footers: { default: pageFooter }, children: kids }] });
Packer.toBuffer(doc).then(b => { fs.writeFileSync(out, b); console.log(out); });
