// Tech & Comms live social listening: shared config, text analysis and metrics.
// Used by the student app (join.html) and the presenter dashboard (dashboard.html).
window.TC = {
  url: 'https://afgalrslvmvmjkfardru.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ2FscnNsdm12bWprZmFyZHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMTExOTUsImV4cCI6MjEwMzc4NzE5NX0.5gllMGq6NiweXQYYSgVMHMG9LuTXK4klxbA8pJqUmCE',
  bucket: 'tc-live',
};

TC.TOPICS = {
  data: { label: 'Data prices', color: '#5379F6', tags: ['#DataPrices', '#TariffHike', '#NCC'],
    keywords: ['MTN', 'Airtel', 'Glo', 'NCC', 'data bundle', 'tariff hike', '50%', 'data finishing'],
    prompts: ['How has the data price increase affected you as a student?', 'Is a 50% tariff hike fair? What should MTN, Airtel or Glo do?', 'What should the NCC tell subscribers?'] },
  asuu: { label: 'ASUU strikes', color: '#FFB020', tags: ['#ASUUStrike', '#EndASUUStrike', '#2009Agreement'],
    keywords: ['ASUU', 'strike', 'lecturers', 'FG', '2009 agreement', 'no work no pay', 'students at home'],
    prompts: ['What do ASUU strikes cost a student?', 'Who should fix it: ASUU, the FG, or both?', 'A friend in a public university just went home. What would you tell them?'] },
  elnino: { label: 'El Niño heat', color: '#F0662B', tags: ['#ElNino', '#Heatwave', '#ScorchingSun'],
    keywords: ['El Niño', 'heatwave', 'scorching sun', 'NiMet', 'heat stroke', 'no light', 'stay hydrated', 'climate change'],
    prompts: ['How is this heat affecting your classes, sleep or health?', 'What should NiMet or the government be telling people right now?', 'Which brand could win hearts in this heat, and how?'] },
};
TC.TOPIC_KEYS = Object.keys(TC.TOPICS);
// light badge colours per topic (student app + dashboard)
TC.TOPICS.data.bg = '#e8eeff'; TC.TOPICS.data.fg = '#022394';
TC.TOPICS.asuu.bg = '#fff4dc'; TC.TOPICS.asuu.fg = '#8a5a00';
TC.TOPICS.elnino.bg = '#ffe9df'; TC.TOPICS.elnino.fg = '#b3400f';

// tracked entities (what a monitoring tool would be set up to catch)
TC.ENTITIES = [
  ['MTN', /\bmtn\b/i], ['Airtel', /\bairtel\b/i], ['Glo', /\bglo\b|\bglobacom\b/i], ['9mobile', /\b9mobile\b/i],
  ['NCC', /\bncc\b/i], ['ASUU', /\basuu\b/i], ['FG', /\bfg\b|federal government/i], ['NLC', /\bnlc\b/i],
  ['NiMet', /\bnimet\b/i], ['El Niño', /\bel ?ni[nñ]o\b/i],
];
TC.TOPIC_RX = {
  data: /\b(data|tariff|bundle|mtn|airtel|glo|9mobile|ncc|recharge|airtime|subscription|network|telco|hike)\b|50%/i,
  asuu: /\b(asuu|strike|strikes|lecturers?|fg|union|2009|ippis|utas|salar(y|ies)|no work)\b/i,
  elnino: /\b(el ?ni[nñ]o|heat|heatwave|hot|sun|scorching|temperature|nimet|climate|weather|sweat|hydrat\w*)\b/i,
};

const POS = 'good great love fair happy thanks thank better improve improved support agree sweet nice solution hope hopeful progress win resolved enjoy valid respect best affordable cheap reasonable fix fixed sensible understand understandable calm peace proud grateful kudos commend dialogue invest investment benefit benefits upgrade quality reliable'.split(' ');
const NEG = 'bad terrible expensive scam ripoff unfair hate angry wicked frustrated frustrating wahala suffering suffer suffered poor slow waste wasted robbery greedy sad tired nonsense useless cheat cheating problem problems insensitive failed fail failure shame disappointed disappointing worst painful pain broke stranded wicked exploit exploitation outrageous ridiculous annoying annoyed crazy jobless idle delay delayed setback hardship hardships unfortunate sorry cry crying protest neglect neglected heartless lazy greed corrupt corruption backward abandoned unbearable scorching suffocating dehydrated exhausted sweating stroke'.split(' ');
const NEG_PHRASES = [/data (dey|is) finish(ing)?/i, /too (much|high|expensive)/i, /e no (make|dey make) sense/i, /no work,? no pay/i, /at home (again|for months)/i, /\bstrike again\b/i, /\bfinish(es|ing)? (too )?(fast|quick)/i, /\bdata finishing\b/i, /\bnot (fair|lasting|normal)\b/i, /\bno light\b/i, /\btoo hot\b/i];
const POS_PHRASES = [/well done/i, /makes? sense/i, /good (move|decision|news)/i];
const NEGATORS = new Set(['not', 'no', 'never', "don't", 'dont', "isn't", 'isnt', "wasn't", "won't", 'cannot', "can't", 'cant', 'nor', 'without']);
const SWEAR = /\b(f+u+c+k\w*|sh[i1]t\w*|bitch\w*|bastard\w*|ashawo|werey|mumu|idiot\w*|stupid|ode|olodo|dick\w*|pussy|asshole|motherf\w*|nigga\w*|cunt\w*)\b/i;

TC.clean = (s) => SWEAR.test(s || '');
TC.mask = (s) => (s || '').replace(new RegExp(SWEAR.source, 'gi'), (w) => w[0] + '*'.repeat(Math.max(1, w.length - 1)));

TC.sentiment = (text) => {
  const t = (text || '').toLowerCase();
  const words = t.replace(/[^a-z0-9%'#@\s]/g, ' ').split(/\s+/).filter(Boolean);
  let s = 0;
  words.forEach((w, i) => {
    const flip = NEGATORS.has(words[i - 1]) || NEGATORS.has(words[i - 2]);
    if (POS.includes(w)) s += flip ? -1 : 1;
    else if (NEG.includes(w)) s += NEGATORS.has(words[i - 1]) ? 0.5 : -1;
  });
  NEG_PHRASES.forEach((r) => { if (r.test(t)) s -= 1; });
  POS_PHRASES.forEach((r) => { if (r.test(t)) s += 1; });
  if (/!{2,}/.test(t) && s < 0) s -= 0.5;
  return s > 0.25 ? 'positive' : s < -0.25 ? 'negative' : 'neutral';
};

const STOP = new Set(('a an the and or but if then so to of in on at for from by with as is are was were be been being it its this that these those i me my we our you your he she they them their his her im i\'m dont do does did done have has had not no yes just very too can could will would should may might must also about into over than more most some any all one two get got go going come make made want need like know think say said see one us who what when where why how which there here because while still even only really now new our out up down off again ever every each much many such own same other dey na e go wey make sef o abeg oo don am una dem wetin no be student students people test post article comment ' +
    'data asuu el nino niño').split(' '));
TC.words = (text) => (text || '').toLowerCase().replace(/https?:\S+/g, ' ').replace(/[^a-z0-9#@%\s]/g, ' ').split(/\s+/)
  .filter((w) => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w) && !w.startsWith('@'));
TC.entities = (text) => TC.ENTITIES.filter(([, r]) => r.test(text || '')).map(([n]) => n);

TC.ago = (iso) => { const s = Math.max(1, (Date.now() - new Date(iso)) / 1000); return s < 60 ? Math.floor(s) + 's' : s < 3600 ? Math.floor(s / 60) + 'm' : Math.floor(s / 3600) + 'h'; };
TC.esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
TC.fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e4 ? (n / 1e3).toFixed(0) + 'k' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : String(n);

// ---- metrics: everything below comes from what students actually did ----
// input: posts [{id, profile_id, channel, topic, title, body, image_url, created_at, hidden, handle}],
//        comments [{post_id, body, created_at, hidden}], stats {post_id: {views, viewers, likes, comments, reposts, shares}},
//        reach rows [{topic, channel, reach}], profiles count
TC.metrics = ({ posts, comments, stats, reach, people }) => {
  const live = posts.filter((p) => !p.hidden);
  const byId = Object.fromEntries(live.map((p) => [p.id, p]));
  const cms = comments.filter((c) => !c.hidden && byId[c.post_id]);
  const items = [
    ...live.map((p) => ({ kind: 'post', topic: p.topic, channel: p.channel, text: (p.title ? p.title + ' ' : '') + p.body, at: p.created_at, post: p })),
    ...cms.map((c) => ({ kind: 'comment', topic: byId[c.post_id].topic, channel: byId[c.post_id].channel, text: c.body, at: c.created_at })),
  ];
  items.forEach((i) => { i.sent = TC.sentiment(i.text); i.ents = TC.entities(i.text); });
  const st = (p) => stats[p.id] || { views: 0, viewers: 0, likes: 0, comments: 0, reposts: 0, shares: 0 };
  const sum = (arr, k) => arr.reduce((a, p) => a + (st(p)[k] || 0), 0);
  const rget = (topic, channel) => (reach.find((r) => (r.topic ?? null) === topic && (r.channel ?? null) === channel) || {}).reach || 0;
  const sentOf = (arr) => { const c = { positive: 0, neutral: 0, negative: 0 }; arr.forEach((i) => c[i.sent]++); const n = arr.length || 1;
    return { ...c, n: arr.length, pos: Math.round(c.positive / n * 100), neu: Math.round(c.neutral / n * 100), neg: Math.round(c.negative / n * 100), net: Math.round((c.positive - c.negative) / n * 100) }; };
  const group = (key, val) => items.filter((i) => i[key] === val);
  const impressions = sum(live, 'views');
  const engagement = sum(live, 'likes') + sum(live, 'comments') + sum(live, 'reposts') + sum(live, 'shares');

  const ent = {}; TC.ENTITIES.forEach(([n]) => { ent[n] = 0; }); items.forEach((i) => i.ents.forEach((n) => ent[n]++));
  const kw = {}; items.forEach((i) => new Set(TC.words(i.text)).forEach((w) => { kw[w] = (kw[w] || 0) + 1; }));
  const keywords = Object.entries(kw).sort((a, b) => b[1] - a[1]).slice(0, 14);

  // mentions over time: one bucket per minute, last 20 minutes
  const now = Date.now(), B = 20, buckets = Array.from({ length: B }, (_, k) => ({ t: now - (B - 1 - k) * 60000, data: 0, asuu: 0, elnino: 0 }));
  items.forEach((i) => { const k = B - 1 - Math.floor((now - new Date(i.at)) / 60000); if (k >= 0 && k < B) buckets[k][i.topic]++; });

  const per = (topic) => { const ps = live.filter((p) => p.topic === topic), its = group('topic', topic);
    return { mentions: its.length, posts: ps.length, impressions: sum(ps, 'views'), reach: rget(topic, null), sentiment: sentOf(its),
      engagement: sum(ps, 'likes') + sum(ps, 'comments') + sum(ps, 'reposts') + sum(ps, 'shares') }; };
  const chan = (channel) => { const ps = live.filter((p) => p.channel === channel), its = group('channel', channel);
    return { mentions: its.length, posts: ps.length, impressions: sum(ps, 'views'), reach: rget(null, channel), sentiment: sentOf(its) }; };
  const scored = live.map((p) => ({ p, s: st(p), score: st(p).likes + st(p).comments * 2 + st(p).reposts * 3 + st(p).shares * 2 }))
    .sort((a, b) => b.score - a.score || b.s.views - a.s.views);
  return {
    people, posts: live.length, comments: cms.length, mentions: items.length, impressions, reach: rget(null, null), engagement,
    er: impressions ? Math.round(engagement / impressions * 1000) / 10 : 0,
    likes: sum(live, 'likes'), reposts: sum(live, 'reposts'), shares: sum(live, 'shares'),
    sentiment: sentOf(items), topics: Object.fromEntries(TC.TOPIC_KEYS.map((t) => [t, per(t)])), channels: { social: chan('social'), blog: chan('blog') },
    entities: Object.entries(ent).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]), keywords, buckets, top: scored.slice(0, 3), items,
  };
};

// rule-based analyst brief: the fallback when the AI read-out is unavailable
TC.ruleBrief = (m) => {
  if (!m.mentions) return null;
  const lead = TC.TOPIC_KEYS.slice().sort((a, b) => m.topics[b].mentions - m.topics[a].mentions)[0];
  const tone = m.sentiment.neg >= 55 ? 'mostly negative' : m.sentiment.pos >= 55 ? 'mostly positive' : 'mixed';
  const themes = TC.TOPIC_KEYS.map((t) => { const kw = {}; m.items.filter((i) => i.topic === t).forEach((i) => new Set(TC.words(i.text)).forEach((w) => { kw[w] = (kw[w] || 0) + 1; }));
    const top = Object.entries(kw).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);
    return top.length ? { name: TC.TOPICS[t].label, topic: t, note: 'Most used words: ' + top.join(', ') } : null; }).filter(Boolean);
  const risks = [];
  TC.TOPIC_KEYS.forEach((t) => { const s = m.topics[t].sentiment; if (s.n >= 3 && s.neg >= 50) risks.push(`${s.neg}% of the ${TC.TOPICS[t].label.toLowerCase()} conversation is negative`); });
  const ent = m.entities[0]; if (ent) risks.push(`${ent[0]} is the most-mentioned name (${ent[1]} mentions)`);
  const t = m.top[0];
  return {
    summary: `${TC.TOPICS[lead].label} leads the conversation with ${m.topics[lead].mentions} of ${m.mentions} mentions; overall tone is ${tone}.`,
    tone, themes, risks,
    standout: t ? [{ handle: t.p.handle, quote: (t.p.title || t.p.body).slice(0, 110), why: `${t.s.likes} likes, ${t.s.reposts} reposts, ${t.s.comments} comments` }] : [],
    recommendation: tone === 'mostly negative' ? 'Respond early with facts and empathy before the negative frame hardens.' : 'Keep listening and amplify the constructive voices.',
    source: 'rule-based',
  };
};
