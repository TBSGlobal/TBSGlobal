const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
(async()=>{const [,,inDir,outDir]=process.argv;fs.mkdirSync(outDir,{recursive:true});
const b=await chromium.launch();const p=await b.newPage();
for(const f of fs.readdirSync(inDir).filter(x=>x.endsWith('.html'))){
  await p.goto('file://'+path.join(inDir,f));await p.evaluate(()=>document.fonts.ready);
  const out=path.join(outDir,'Tech and Comms Speaker Concept Note - '+f.replace('.html','').replace(/-/g,' ')+'.pdf');
  await p.pdf({path:out,format:'A4',printBackground:true,preferCSSPageSize:true});console.log(out);}
await b.close()})();
