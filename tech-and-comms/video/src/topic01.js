  // TOPIC 01 · SCENE 1+2: the exam (0 - 10.5)
  if(t<10.6){
    const a=eo(lin(t,0.15,0.7)), o=1-lin(t,10.0,10.5);
    const left=Math.max(0,Math.ceil(6.5-t));
    const pick=t>3.6, sel=eo(lin(t,3.6,3.9));
    const OPTS=['Sender → Message → Channel → Receiver','Press release → Newspaper → Reader','Brand → Billboard → Customer','None of the above'];
    let opts=OPTS.map((x,i)=>{const on=pick&&i===0;return `<div class="opt${on?' on':''}" style="${on?`transform:scale(${1+.03*sel})`:''}"><span class="l">${'ABCD'[i]}</span>${x}${on?'<span class="tick">✓</span>':''}</div>`}).join('');
    h+=el('exam',`<div class="eh"><span>Mass Comm 301 · Final exam</span><span class="${left<=2&&t<6.5?'red':''}">Time left 00:0${left}</span></div>
      <div class="q">Q14. Which of these best describes the communication process?</div>${opts}`,
      `opacity:${a*o};transform:translateY(${(1-a)*60}px) scale(${1-.04*lin(t,7,10)})`);
    const st=back(clamp(lin(t,5.2,5.6)));
    if(t>5.2) h+=el('stamp',`A<small>+</small>`,`opacity:${clamp(st)*o};transform:rotate(${-14+10*(1-st)}deg) scale(${1.6-.6*st})`);
    if(t>=7.2){
      const c1=eo(lin(t,7.2,7.7)), c2=eo(lin(t,7.9,8.4)), oo=1-lin(t,10,10.4);
      h+=el('caption',`<div class="s" style="opacity:${c1}">You know the textbook answer.</div><div class="b" style="opacity:${c2};transform:translateY(${(1-c2)*40}px)">Full marks.</div>`,`top:1400px;opacity:${oo}`);
    }
  }
  // TOPIC 01 · SCENE 3: the job at 11:47pm (10.4 - 14.8)
  if(t>=10.4 && t<15){
    const a=eo(lin(t,10.4,10.9)), o=1-lin(t,14.4,14.8);
    const shake = t>14.0 ? `translateX(${(Math.sin(t*95)*16).toFixed(1)}px)` : '';
    const NOTES=[['CEO','We\'re trending for the wrong reasons. Statement in 30 mins?','#e5484d'],['Journalist','Can we get a comment before midnight?','#ffd60a'],
      ['Social team','Negative mentions up 340% in the last hour','#e5484d'],['Legal','Don\'t post anything until we review it','#9aa5cf'],['Agency','Which channel do we respond on first?','#5a7bfe']];
    let notes=NOTES.map((n,i)=>{const k=back(clamp(lin(t,10.8+i*.45,11.15+i*.45)));return `<div class="note" style="opacity:${clamp(k)};transform:translateY(${(1-clamp(k))*-40}px) scale(${.9+.1*k})"><i style="background:${n[2]}"></i><div><b>${n[0]}</b>${n[1]}</div></div>`}).join('');
    h+=el('phone',`<div class="clock">11:47<small>PM</small></div><div class="notes">${notes}</div>`,`opacity:${a*o};transform:translateY(${(1-a)*80}px) ${shake}`);
    const c1=eo(lin(t,11.4,11.9)), c2=eo(lin(t,12.1,12.6));
    h+=el('caption',`<div class="s" style="opacity:${c1}">Then the job hands you</div><div class="b" style="opacity:${c2};transform:translateY(${(1-c2)*40}px)">this.</div>`,`top:1470px;opacity:${o}`);
  }
  // TOPIC 01 · SCENE 4: model vs reality (14.6 - 18.8)
  if(t>=14.6 && t<18.8){
    const a=eo(lin(t,14.6,15.1)), b=eo(lin(t,14.9,15.4)), o=1-lin(t,18.2,18.6);
    const L1=['Sender','Message','Channel','Receiver'].map(x=>`<span class="pill">${x}</span>`).join('<span class="arr">↓</span>');
    const L2=['Crisis at midnight','Data on every mention','Five people need answers','Your name on the statement'].map((x,i)=>`<span class="pill hot" style="transform:rotate(${[-3,2,-2,3][i]}deg)">${x}</span>`).join('');
    h+=el('vs',`<div class="col" style="opacity:${a};transform:translateX(${(1-a)*-60}px)"><div class="k">In class</div>${L1}</div><div class="col job" style="opacity:${b};transform:translateX(${(1-b)*60}px)"><div class="k">On the job</div>${L2}</div>`,`opacity:${o}`);
    const c1=eo(lin(t,15.4,15.9)), c2=eo(lin(t,16.0,16.5));
    h+=el('caption',`<div class="s" style="opacity:${c1}">School taught you the model.</div><div class="b" style="opacity:${c2};transform:translateY(${(1-c2)*40}px)">Nobody taught you the reality.</div>`,`top:1380px;opacity:${o}`);
  }
  // TOPIC 01 · SCENE 5 (18.6 - 21.6)
  if(t>=18.6 && t<21.8){
    const a=eo(lin(t,18.8,19.3)), o=1-lin(t,21.2,21.6);
    h+=el('caption',`<div class="s" style="font-size:76px;color:var(--navy)">Hear it from the people<br>doing the work.</div>`,`top:840px;opacity:${a*o};transform:scale(${.94+.06*a})`);
  }
