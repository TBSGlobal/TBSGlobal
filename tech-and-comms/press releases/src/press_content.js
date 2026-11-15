// Three press-release drafts for Tech & Comms. Square brackets = to confirm or fill in (highlighted yellow).
const SPONSORS = 'Tech & Comms is an initiative of The Comms Boardroom Technologies, supported by Mr. Philip Odiakose of P+ Measurement Services and Zofu.Quest, an AI tool that tailors CVs to every job.';
const ABOUT_TC = (before) => 'Tech & Comms is a campus seminar series and an initiative of The Comms Boardroom Technologies (TCBR). It takes working communications practitioners into Mass Communication departments to cover communications in the real world, media monitoring and media intelligence, and building a personal brand, with a panel and an open Q&A. The first edition ' + (before ? 'holds' : 'held') + ' at Crawford University on 26 November 2026 in partnership with the Department of Mass Communication and the Crawford University Alumni Association. The series is supported by Mr. Philip Odiakose of P+ Measurement Services and Zofu.Quest. TCBR plans to take Tech & Comms to five to ten universities in 2027, physically and virtually. Universities can register interest at tech-and-comms.vercel.app.';
const ABOUT_TCBR = 'The Comms Boardroom Technologies (TCBR) is a Lagos-based, AI-powered PR and communications technology company founded in January 2026. It works at the intersection of PR, data and strategy for African markets, with a focus on communications measurement and value. Its products include Boardroom Analytics, built to transform how campaigns are measured, and AutoMonitor [one-line description].';
const CONTACT = 'Media contact: [Name], [Title], The Comms Boardroom Technologies · 08160122896 · info@thecommsboardroom.com · www.thecommsboardroom.com';
const OUTLETS = 'Target outlets: BusinessDay, Punch, ThisDay, The Nation and Brand Communicator.';

module.exports = [
  {
    file: 'Press Release 1 - Personal Brand - Samuel Ogundeji',
    angle: 'Angle 1 · Personal brand (founder feature)',
    send: 'Send after the event (from 27 November).',
    model: 'Modelled on the ThisDay CleanAce feature: the founder\'s starting point, a clear conviction, and short lines a journalist can quote.',
    headlines: [
      'Samuel Ogundeji Is Taking the PR Industry\'s Biggest Question Into Nigerian Classrooms',
      'At 25, Samuel Ogundeji Is Taking the PR Industry\'s Biggest Question Into Nigerian Classrooms',
      'Proving PR\'s Value Starts in the Classroom, Says The Comms Boardroom Founder Samuel Ogundeji',
    ],
    standfirst: 'Through Tech & Comms, the founder of The Comms Boardroom Technologies is bringing media intelligence, AI and personal branding to Mass Communication students before they graduate, starting with Crawford University.',
    body: [
      'Samuel Ogundeji did not study Mass Communication. What drew him into the classroom was a question the global PR industry keeps asking: how do you prove that communications works?',
      'As that question grew louder around the world, Ogundeji, [optional: 25,] noticed something missing. The professionals, skills and tools needed to answer it were getting little attention, especially in the curricula that train Africa\'s future communicators.',
      '"Proving the value of PR has become a global conversation," said Ogundeji, Founder and Lead Consultant of The Comms Boardroom Technologies (TCBR). "But the people, the skills and the tools that will be used to prove it are not getting the same attention, especially when you look at what is being taught in our universities."',
      'He founded TCBR in January 2026 as an AI-powered PR and communications technology company for African markets, blending his PR experience with software product management. Its products include Boardroom Analytics, built to transform how campaigns are measured, and AutoMonitor [one-line description].',
      'Before founding TCBR, Ogundeji worked as a media intelligence analyst and account manager, managing PR campaigns end to end across executive profiling, thought leadership, pan-African ESG forums and advocacy. He has led communications for major companies in highly regulated sectors, including one of the world\'s largest tobacco companies across Nigeria, Cameroon and Ghana, and leading firms in oil and gas, as well as brands in beverages, agriculture and corporate social responsibility. [Current role: the profile lists PR Consultant and Client Service Executive at Brooks and Blake. Keep, update or remove?] He writes regularly on establishing proper campaign measurement standards for African PR teams.',
      'Ogundeji believes the change has to start with perception: how African practitioners and agencies see themselves, not only in relation to their clients. "The moment we decide to see ourselves differently, we will see the need to own our own conversations and our own tools," he said. "Then we can ask the right questions: which standards are recognised, which global standards work, and how do we adapt them to fit our own context?"',
      'That conviction became Tech & Comms, a campus seminar series that takes working practitioners into Mass Communication departments. Its first edition held on 26 November 2026 at Crawford University, in partnership with the Department of Mass Communication, led by Dr. Dayo Odigie, and the Crawford University Alumni Association, led by Victor Oluwafemi Adeniji. [Add one result: attendance, a highlight or a survey finding.]',
      'Students heard what communications looks like inside Nigerian organisations, how monitoring, evaluation and social listening are used to prove the value of PR, and how to build a professional presence before they feel "ready". "The story worth telling isn\'t \'I made it\'," Ogundeji said. "It\'s \'here\'s who I\'m becoming\'."',
      'He now plans to take Tech & Comms to five to ten universities in 2027, and to more each year after, across Africa, both physically and virtually. Beyond the seminars, TCBR intends to consult for and train students who see the opportunities in this field.',
      '"The future of communications in Africa starts today," he said. "It starts with how we see ourselves, the tools we build, and what we teach the next generation."',
    ],
  },
  {
    file: 'Press Release 2 - The Initiative - Tech and Comms',
    angle: 'Angle 2 · The initiative (launch announcement)',
    send: 'Send before the event (by 20 November).',
    model: 'Modelled on the Leadership CleanAce story: a clear news hook in the first line, then the facts, the quotes and what comes next.',
    headlines: [
      'Tech & Comms Sets Out to Change How African Mass Communication Students See Technology',
      'The Comms Boardroom Partners Crawford University to Launch Tech & Comms',
      'New Campus Series Brings AI, Media Intelligence and Personal Branding to Mass Communication Students, Starting at Crawford University',
    ],
    standfirst: 'The first edition holds on 26 November at Crawford University, in partnership with the Department of Mass Communication and the Crawford University Alumni Association.',
    body: [
      'LAGOS, [date]: The Comms Boardroom Technologies (TCBR) has launched Tech & Comms, a campus seminar series designed to change how Mass Communication students in Africa see technology and the profession they are preparing to enter.',
      'The first edition holds on Thursday, 26 November 2026, at Legacy Hall, Crawford University, in partnership with the university\'s Department of Mass Communication and the Crawford University Alumni Association.',
      'Tech & Comms takes working practitioners into Mass Communication departments to cover three areas that are rarely taught before graduation: how communications really works in Nigerian organisations; media monitoring, evaluation and media intelligence, including social listening and the role of AI; and building a personal brand while still in school.',
      'Speaking on the initiative, TCBR Founder and Lead Consultant, Samuel Ogundeji, said most curricula were designed for a version of the industry that no longer fully exists. "Students come out well-versed in theory, but with very little exposure to how communications functions inside a real organisation, how much technology now shapes the work, or how they are expected to present themselves professionally," he said.',
      '"Proving the value of communications is one of the biggest conversations in the industry right now, globally, across Africa and here in Nigeria. If students never encounter media intelligence in school, they cannot join that conversation, let alone help solve it," he added.',
      'The Crawford edition features talks by Gabriel Ntoka on communications in school versus reality, Ogundeji on media monitoring, intelligence, social listening and AI, and Onaopemipo Famori on building a personal brand. A panel with Barnabas [surname], on "You Media", the shift from traditional media to individuals with their own platforms, and Samuel Jegede, on communications in humanitarian work, will be followed by an open question-and-answer session.',
      'Head of the Department of Mass Communication, Crawford University, Dr. Dayo Odigie, said: "[Proposed, to be approved by Dr. Odigie: Our students need to see how the profession works today, not only how it is described in textbooks. Partnering with practitioners on Tech & Comms gives them that view while they still have time to act on it.]"',
      'President of the Crawford University Alumni Association, Victor Oluwafemi Adeniji, said: "[Proposed, to be approved by Mr. Adeniji: As alumni, we know how much the first years after graduation shape a career. We are proud to support an initiative that prepares our students for the industry they are about to enter.]"',
      SPONSORS,
      'Beyond Crawford, TCBR plans to take Tech & Comms to five to ten universities in 2027, physically and virtually. Students and lecturers can register their institutions at tech-and-comms.vercel.app, and schools with the most registrations will be prioritised.',
      '"This is not a one-off talk," Ogundeji said. "It is an effort to bring the standards we apply with our clients into the classroom, early, and with genuine intention."',
    ],
  },
  {
    file: 'Press Release 3 - Policy Advocacy - Curriculum Update',
    angle: 'Angle 3 · Policy advocacy (curriculum and research)',
    send: 'Send after the event, once the survey results are in.',
    model: 'Modelled on the Leadership CleanAce story\'s policy ask: name the gap, name the institutions, propose specific steps, and show what the company is already doing. The institutions are named as the bodies being called on; nothing says they have been engaged.',
    headlines: [
      'Communications Expert Calls for AI, Media Intelligence and Social Listening in Mass Communication Curricula',
      'Teach It Before They Graduate: The Comms Boardroom Urges Curriculum Update for Africa\'s Communication Students',
      'Africa Needs Its Own Communication Data, Says Ogundeji as He Calls for Curriculum Reform',
    ],
    standfirst: 'TCBR Founder Samuel Ogundeji urges regulators, professional bodies and universities to update communication training, and to invest in country-by-country research that closes Africa\'s communication data gap.',
    body: [
      'LAGOS, [date]: The Founder and Lead Consultant of The Comms Boardroom Technologies (TCBR), Samuel Ogundeji, has called for an urgent update to Mass Communication and communication-studies curricula in Nigeria and across Africa to include artificial intelligence, media monitoring and evaluation, media intelligence and social listening.',
      'Ogundeji spoke after Tech & Comms, a campus seminar series held at Crawford University on 26 November, and described curriculum reform as "probably the biggest need in the PR industry today".',
      '"Technology is not a future trend in this industry; it is already here," he said. "Media monitoring, evaluation and media intelligence through social listening are real, active parts of PR practice. But the curriculum has not caught up, and that leaves graduates unprepared for the biggest conversation in our industry: how we prove the value of what we do."',
      '[Survey finding: for example, "A survey of [number] Mass Communication students at the Crawford edition found that [X]% had never used a media monitoring or social listening tool, and [Y]% said no course had taught them how to measure the value of PR."]',
      'He called on the National Universities Commission (NUC), the Nigerian Institute of Public Relations (NIPR), the Advertising Regulatory Council of Nigeria (ARCON), their counterparts across Africa and university departments to work with practitioners on practical course content. His proposals include:',
      '• Modules on AI in communications, covering what it does well, where human judgement remains essential, and its ethical use.\n• Media monitoring, measurement and evaluation, aligned with recognised global standards such as the AMEC Barcelona Principles and adapted to the African context.\n• Practical social listening and media intelligence work, using real tools and real data.\n• Structured roles for practitioners in teaching, through guest sessions, case studies and industry-supervised projects.',
      'Ogundeji also called for investment in research. He said Africa lacks reliable, country-by-country data on how people consume media and respond to communication, and that this gap limits the tools available to African communications professionals.',
      '"Most of the tools and benchmarks our industry uses were built on data from other markets," he said. "We need country-by-country behavioural research and industry research that reflects how Africans actually communicate. That is how we build better tools for African professionals and close the data gap that naturally exists in our landscape. Universities, students and lecturers should be at the centre of that work."',
      '[TCBR commitment, only if confirmed: for example, "TCBR says it is open to research partnerships with universities on [topics]."]',
      'He said the conversation must start with how the industry sees itself. "The moment we decide to see ourselves differently, we will see the need to own our own conversations and our own tools. Then we can ask which global standards work, and adapt them to fit our context."',
      'While the curriculum catches up, TCBR is taking the conversation into classrooms itself. Tech & Comms, which began at Crawford University, will reach five to ten universities in 2027, physically and virtually.',
      '"The future of communications in Africa starts today," Ogundeji said. "And it starts in the classroom."',
    ],
  },
].map(r => ({ ...r, about: [['About Tech & Comms', ABOUT_TC(r.file.includes('Release 2'))], ['About The Comms Boardroom Technologies', ABOUT_TCBR]], contact: CONTACT, outlets: OUTLETS }));
