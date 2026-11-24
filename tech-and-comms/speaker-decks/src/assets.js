// grid paper background + asterisk, rendered once
const { chromium } = require('playwright');
(async () => { const out = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2560, height: 1440 } });
  await p.setContent(`<body style="margin:0;width:2560px;height:1440px;background-color:#f2f5fc;background-image:linear-gradient(#e2e8f8 3px,transparent 3px),linear-gradient(90deg,#e2e8f8 3px,transparent 3px);background-size:160px 160px;background-position:-1px -1px"></body>`);
  await p.screenshot({ path: out + '/tc-grid.png' });
  await p.setViewportSize({ width: 600, height: 600 });
  await p.setContent(`<body style="margin:0;background:transparent"><svg viewBox="-50 -50 100 100" width="600" height="600"><g fill="#5379F6"><rect x="-10" y="-48" width="20" height="96" rx="10"/><rect x="-10" y="-48" width="20" height="96" rx="10" transform="rotate(60)"/><rect x="-10" y="-48" width="20" height="96" rx="10" transform="rotate(120)"/></g></svg></body>`);
  await p.screenshot({ path: out + '/tc-ast.png', omitBackground: true }); await b.close(); })();
