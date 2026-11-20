const {chromium}=require('playwright');const fs=require('fs');(async()=>{const [,,dir,html,out]=process.argv;fs.mkdirSync(`${dir}/${out}`,{recursive:true});
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto(`file://${dir}/${html}`);await p.evaluate(()=>document.fonts.ready);
const N=31*30;for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/30);await p.screenshot({path:`${dir}/${out}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});}
console.log('done',out);await b.close()})();
