const {chromium}=require('playwright');(async()=>{const [,,dir,font,size,out,navy,box,scale]=process.argv;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:4200,height:2600},deviceScaleFactor:+scale||1});
await p.goto('file://'+dir+'/logo.html');await p.evaluate(([f,s,n,bx])=>{const L=document.getElementById('L');L.style.fontFamily=f;L.style.setProperty('--s',s+'px');L.style.setProperty('--pad',(s*.3)+'px');L.style.setProperty('--navy',n);L.style.setProperty('--box',bx);},[font,+size,navy,box]);
await p.evaluate(()=>document.fonts.ready);const el=await p.$('#L');await el.screenshot({path:out,omitBackground:true});await b.close()})();
