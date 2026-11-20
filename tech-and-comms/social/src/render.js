const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const dir=process.argv[2];fs.mkdirSync(dir+'/out',{recursive:true});const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1080,height:1080}});await p.goto('file://'+dir+'/slides.html');await p.evaluate(()=>document.fonts.ready);
for(const k of await p.evaluate(()=>SLIDES)){await p.evaluate(k=>show(k),k);await p.waitForTimeout(120);await p.screenshot({path:`${dir}/out/${k}.png`});}
await b.close();console.log('ok')})();
