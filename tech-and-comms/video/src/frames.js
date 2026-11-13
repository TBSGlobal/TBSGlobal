const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.argv[2]+'/reel.html');await p.evaluate(()=>document.fonts.ready);
const N=31*30;for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/30);await p.screenshot({path:`${process.argv[2]}/frames/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});}
console.log('done',N);await b.close()})();
