  // TOPIC 03 · SCENE 1+2: a recruiter scrolls past (0 - 10.5)
  const PROFILES=[['AO','#5a7bfe','Adaeze O.','PR intern · writes about brand storytelling','2.1k followers · 48 posts'],
    ['TK','#ffd60a','Tunde K.','Content creator · campus events host','5.4k followers · 120 posts'],
    ['FB','#2bb673','Funmi B.','Mass Comm \'25 · building a media portfolio','860 followers · 31 posts'],
    ['IE','#e5484d','Ifeanyi E.','Social media lead, student union','1.3k followers · 64 posts'],
    ['ZM','#5a7bfe','Zainab M.','Documenting my first year in comms','3.0k followers · 77 posts'],
    ['DA','#ffd60a','David A.','Podcast host · culture & media','2.6k followers · 52 posts']];
  if(t<10.6){
    const a=eo(lin(t,0.1,0.5)), o=1-lin(t,10.0,10.4);
    const typed='Mass Comm graduate, Lagos'.slice(0,Math.floor(lin(t,0.3,1.8)*25));
    h+=el('search',`<span class="mag">⌕</span>${typed}<span class="caret" style="opacity:${(Math.floor(t*3)%2)&&t<2?1:0}">|</span>`,`opacity:${a*o}`);
    // list scrolls up (fast in the middle), then settles on the empty profile
    const f = eio(lin(t,1.8,6.2)), settle = eo(lin(t,5.9,6.3));
    const rows=PROFILES.map((p,i)=>`<div class="prof" style="top:${i*250}px"><span class="av" style="background:${p[1]}">${p[0]}</span><div><b>${p[2]}</b><span>${p[3]}</span><small>${p[4]}</small></div></div>`).join('')
      + `<div class="prof empty" style="top:${PROFILES.length*250}px;transform:scale(${1+.05*settle})"><span class="av">?</span><div><b>Mass Comm student</b><span class="ghost">No headline</span><small>0 posts · no photo · nothing to see</small></div></div>`;
    h+=el('pview',`<div class="plist" style="top:${80 - 1120*f}px">${rows}</div>`,`opacity:${a*o}`);
    const n = Math.round(46*Math.pow(lin(t,1.8,6.0),1.4)) + (t>=6?1:0);
    h+=el('rev',`Profiles reviewed <b>${n}</b>`,`opacity:${a*(1-lin(t,6.9,7.3))}`);
    if(t>6.3){ const k=back(clamp(lin(t,6.3,6.7))); h+=el('stamp skip','SKIPPED',`opacity:${clamp(k)*o};transform:rotate(${-12+8*(1-k)}deg) scale(${1.5-.5*k})`); }
    if(t>=7.2){
      const c1=eo(lin(t,7.2,7.7)), c2=eo(lin(t,7.9,8.4)), oo=1-lin(t,10,10.4);
      h+=el('caption',`<div class="s" style="opacity:${c1}">A recruiter looked you up.</div><div class="b" style="opacity:${c2};transform:translateY(${(1-c2)*40}px)">They found nothing.</div>`,`top:1420px;opacity:${oo}`);
    }
  }
  // TOPIC 03 · SCENE 3: the profile builds itself (10.4 - 14.8)
  if(t>=10.4 && t<15){
    const a=eo(lin(t,10.4,10.9)), o=1-lin(t,14.4,14.8);
    const av=eo(lin(t,10.8,11.3)), head='Mass Comm student · documenting my journey into PR'.slice(0,Math.floor(lin(t,11.2,12.4)*51));
    const posts=Math.round(24*eo(lin(t,11.6,13.4))), fol=Math.round(1284*eo(lin(t,11.6,13.6)));
    const tiles=[...Array(6)].map((_,i)=>`<i style="opacity:${eo(lin(t,11.8+i*.2,12.2+i*.2))};background:${['#dfe6ff','#ffd60a','#dfe6ff','#5a7bfe','#dfe6ff','#131838'][i]}"></i>`).join('');
    const glitch = t>14.1 ? `translateX(${(Math.sin(t*90)*12).toFixed(1)}px)` : '';
    h+=el('pcard',`<div class="top"><span class="av big" style="background:${av>0.5?'#5a7bfe':'#cfd6ea'};transform:scale(${.8+.2*av})">${av>0.5?'YOU':'?'}</span><div><b>Your name</b><span>${head}<span class="caret">${t<12.6?'|':''}</span></span></div></div>
      <div class="stats"><div><b>${posts}</b><small>Posts</small></div><div><b>${fol.toLocaleString('en-US')}</b><small>Followers</small></div><div><b>${Math.round(312*eo(lin(t,12,13.8)))}</b><small>Profile views</small></div></div>
      <div class="tiles">${tiles}</div>`,`opacity:${a*o};transform:translateY(${(1-a)*60}px) ${glitch}`);
    const c1=eo(lin(t,11.4,11.9)), c2=eo(lin(t,12.1,12.6));
    h+=el('caption',`<div class="s" style="opacity:${c1}">You don't need to have made it.</div><div class="b" style="opacity:${c2};transform:translateY(${(1-c2)*40}px)">You need to show up.</div>`,`top:1420px;opacity:${o}`);
  }
  // TOPIC 03 · SCENE 4 (14.6 - 18.8)
  if(t>=14.6 && t<18.8){
    const o=1-lin(t,18.2,18.6);
    const CH=['Profile photo','A clear headline','Your first post','A story worth following'];
    const chips=CH.map((c,i)=>{const k=back(clamp(lin(t,14.8+i*.35,15.2+i*.35)));return `<span class="chk" style="opacity:${clamp(k)};transform:scale(${.8+.2*k})"><i>✓</i>${c}</span>`}).join('');
    h+=el('chks',chips,`opacity:${o}`);
    const c1=eo(lin(t,16.0,16.5)), c2=eo(lin(t,16.6,17.1));
    h+=el('caption',`<div class="s" style="opacity:${c1}">Start telling the story</div><div class="b" style="opacity:${c2};transform:translateY(${(1-c2)*40}px)">of who you're becoming.</div>`,`top:1300px;opacity:${o}`);
  }
  // TOPIC 03 · SCENE 5 (18.6 - 21.6)
  if(t>=18.6 && t<21.8){
    const a=eo(lin(t,18.8,19.3)), o=1-lin(t,21.2,21.6);
    h+=el('caption',`<div class="s" style="font-size:80px;color:var(--navy)">We'll show you how.</div>`,`top:880px;opacity:${a*o};transform:scale(${.94+.06*a})`);
  }
