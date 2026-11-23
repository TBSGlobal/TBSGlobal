// Practice data for the live listening dashboard: used when the hall's internet drops
// (or when the presenter presses S). Posts arrive over time and get views, likes and reposts,
// so the dashboard behaves the way it does with real students.
(function () {
  const P = [
    ['social', 'data', null, 'MTN data finishing faster than my patience. 50% tariff hike and the bundle is still not lasting #DataPrices'],
    ['social', 'asuu', null, 'My cousin in UNILAG has been home for weeks again. ASUU strike is stealing years from students #ASUUStrike'],
    ['social', 'data', null, 'I understand telcos need to invest in the network, but the NCC should make them show better quality first'],
    ['blog', 'data', 'Why the tariff hike hits students hardest', 'Most of us study online now. Lecture notes, research, even registration. When data prices go up by 50%, it is not a luxury that gets cut, it is learning. MTN, Airtel and Glo should consider student bundles.'],
    ['social', 'asuu', null, 'Honestly both ASUU and the FG need to sit down and fix the 2009 agreement once and for all. Students are tired'],
    ['social', 'data', null, 'Airtel 1.5GB used to last me a week. Now e no reach 3 days. Something is not adding up #TariffHike'],
    ['social', 'asuu', null, 'Lecturers deserve good pay. Fund the universities properly and the strikes will stop'],
    ['blog', 'asuu', 'No work, no pay is not a solution', 'Every time there is a strike, government says no work no pay, ASUU digs in, and students lose a session. A real solution needs dialogue, a timeline and funding that is actually released.'],
    ['social', 'data', null, 'Glo is still the cheapest but the network is poor where I stay. Choose your wahala'],
    ['social', 'asuu', null, 'Grateful I am in a private university right now, but my friends in public schools are suffering #EndASUUStrike'],
    ['social', 'data', null, 'NCC approved the hike, so NCC should also protect subscribers. Where is the audit on data depletion?'],
    ['social', 'data', null, 'Good move by the telcos to explain the cost of diesel and forex. Communication helps people understand #DataPrices'],
    ['blog', 'data', 'Telcos lost the narrative before the price went up', 'The tariff increase may be justified on cost, but the story reached people as greed. If MTN and Airtel had explained it early with facts and empathy, the backlash would have been smaller. This is a comms lesson.'],
    ['social', 'asuu', null, 'Strike again? Four year course becoming six years. This is not fair to anybody'],
    ['social', 'data', null, 'Data price na wahala but I still prefer MTN network. Fast and reliable for my classes'],
    ['social', 'asuu', null, 'The FG should invest in education the way they invest in elections. Respect lecturers, respect students'],
    ['social', 'data', null, 'Recharged ₦2,000 this morning and data finish before night. Tariff hike is too much'],
    ['social', 'asuu', null, 'Hopeful that the renegotiated agreement will hold this time. Students need stability'],
    ['blog', 'asuu', 'What a strike really costs a student', 'It is not just the months at home. It is internships you miss, NYSC timelines that shift, parents paying rent for empty hostels, and the motivation you slowly lose. We should measure strikes in lost futures, not lost days.'],
    ['social', 'data', null, 'Airtel customer care actually resolved my complaint today. Credit where it is due'],
    ['social', 'data', null, 'Unfair to increase prices when service quality is still poor. NCC should fix this'],
    ['social', 'asuu', null, 'ASUU strike headlines again. Nobody wins this, everybody loses'],
    ['social', 'data', null, 'Student data plans would be a smart PR move for MTN or Glo right now. Win the next generation'],
    ['social', 'asuu', null, 'Proud of lecturers who still teach well despite everything. But the system has failed them'],
  ];
  const NAMES = ['Tolu', 'Ada', 'Chidi', 'Zainab', 'Femi', 'Ngozi', 'Tunde', 'Amaka', 'Seyi', 'Halima', 'Kemi', 'Emeka', 'Bisi', 'Uche', 'Musa', 'Ife', 'Dayo', 'Ruth'];
  const COMMENTS = ['So true', 'This is exactly my experience', 'Nah, I think they had no choice', 'The FG needs to act', 'Facts!', 'MTN should see this', 'Well said', 'Too expensive honestly', 'I disagree, lecturers deserve better'];
  let S;
  const iso = (ms) => new Date(ms).toISOString();
  window.SIM = {
    start() {
      const now = Date.now(), people = NAMES.map((n, i) => ({ id: 'u' + i, name: n, handle: n.toLowerCase() + '_' + (11 + i * 3) }));
      S = { now, people, posts: [], comments: [], views: {}, viewers: {}, likes: {}, reposts: {}, shares: {}, seen: new Set(), queue: P.slice(), n: 0 };
      // a few posts already in when the slide opens
      for (let i = 0; i < 6; i++) this.add(now - (6 - i) * 70000);
    },
    add(at) {
      const t = S.queue.shift(); if (!t) return;
      const u = S.people[S.n++ % S.people.length], id = 'p' + S.n;
      S.posts.push({ id, profile_id: u.id, channel: t[0], topic: t[1], title: t[2], body: t[3], image_url: null, created_at: iso(at), hidden: false, handle: u.handle, name: u.name });
      S.views[id] = 0; S.viewers[id] = new Set(); S.likes[id] = 0; S.reposts[id] = 0; S.shares[id] = 0;
    },
    step() {
      if (!S) this.start();
      if (Math.random() < 0.55) this.add(Date.now());
      S.posts.forEach((p) => {
        const boost = 1 + S.reposts[p.id] * 0.6;
        const v = Math.floor(Math.random() * 4 * boost);
        for (let k = 0; k < v; k++) { const u = S.people[Math.floor(Math.random() * S.people.length)]; if (u.id === p.profile_id) continue; S.views[p.id]++; S.viewers[p.id].add(u.id); S.seen.add(u.id + '|' + p.topic + '|' + p.channel); }
        if (Math.random() < 0.25) S.likes[p.id]++;
        if (Math.random() < 0.06) S.reposts[p.id]++;
        if (Math.random() < 0.04) S.shares[p.id]++;
        if (Math.random() < 0.05) S.comments.push({ id: S.comments.length, post_id: p.id, body: COMMENTS[Math.floor(Math.random() * COMMENTS.length)], created_at: iso(Date.now()), hidden: false });
      });
      const reach = (topic, channel) => { const u = new Set(); S.seen.forEach((k) => { const [id, t, c] = k.split('|'); if ((!topic || t === topic) && (!channel || c === channel)) u.add(id); }); return u.size; };
      const rows = [{ topic: null, channel: null, reach: reach() }];
      ['data', 'asuu'].forEach((t) => rows.push({ topic: t, channel: null, reach: reach(t) }));
      ['social', 'blog'].forEach((c) => rows.push({ topic: null, channel: c, reach: reach(null, c) }));
      const stats = {};
      S.posts.forEach((p) => { stats[p.id] = { views: S.views[p.id], viewers: S.viewers[p.id].size, likes: S.likes[p.id], comments: S.comments.filter((c) => c.post_id === p.id).length, reposts: S.reposts[p.id], shares: S.shares[p.id] }; });
      return { posts: S.posts.slice(), comments: S.comments.slice(), stats, reach: rows, people: S.people.length };
    },
  };
})();
