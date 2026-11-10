import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = 'http://localhost:3100';
const targets = await (await fetch('http://localhost:9333/json')).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id) { pending.get(m.id)?.(m); pending.delete(m.id); } });
async function call(method, params = {}) { const n = ++id; const result = new Promise(resolve => pending.set(n, resolve)); ws.send(JSON.stringify({ id: n, method, params })); const r = await result; if (r.error) throw Error(JSON.stringify(r.error)); return r.result; }
async function evaluate(expression) { return (await call('Runtime.evaluate', { expression, returnByValue: true })).result.value; }
async function visit(path) { await call('Page.navigate', { url: base + path }); for (let i = 0; i < 100; i++) { if (await evaluate(`document.readyState === 'complete' && location.pathname === ${JSON.stringify(path)}`)) return; await new Promise(r => setTimeout(r, 100)); } throw Error('Navigation timeout: ' + path); }
await call('Page.enable'); await call('Network.enable'); await call('Network.setCacheDisabled', { cacheDisabled: true });
fs.mkdirSync('verification', { recursive: true });
for (const width of [1440, 820, 390, 320]) {
 await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
 await visit('/insights'); await evaluate('document.fonts.ready.then(()=>true)'); await new Promise(r=>setTimeout(r,400));
 const layout = await evaluate(`(() => { const rows=[...document.querySelectorAll('.episode-list>a')]; return { overflow:document.documentElement.scrollWidth>innerWidth, rows:rows.map(r=>{const d=r.children[0].getBoundingClientRect(),t=r.children[1].getBoundingClientRect(),a=r.children[2].getBoundingClientRect();return {date:r.children[0].textContent,clear:(d.right<=t.left||d.bottom<=t.top)&&t.right<=a.left}}), intro:document.querySelector('.episode-directory>.prose').getBoundingClientRect().top,directory:document.querySelector('.episode-list').getBoundingClientRect().top }; })()`);
 if(layout.overflow)console.log(await evaluate("JSON.stringify({width:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({cls:e.className,text:e.textContent.slice(0,100),tag:e.tagName,parent:e.parentElement.className,right:e.getBoundingClientRect().right}))})")); assert.equal(layout.overflow, false); assert.ok(layout.rows.every(r => r.clear && !r.date.includes('T00'))); if(width<=760)assert.ok(layout.directory>layout.intro);
 await evaluate("document.querySelector('.episode-directory').scrollIntoView({behavior:'instant'})");
 const shot = await call('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(`verification/insights-${width}.png`, Buffer.from(shot.data, 'base64'));
 console.log('Directory layout passed', width);
}
await visit('/insights/qa-video');
assert.equal(await evaluate("document.querySelectorAll('.episode-article h3').length"), 1);
assert.equal(await evaluate("document.querySelectorAll('.episode-article li').length"), 2);
assert.equal(await evaluate("document.querySelectorAll('.episode-article a[href=\"https://example.com\"]').length"), 1);
await visit('/insights/qa-no-article'); assert.equal(await evaluate("document.querySelectorAll('.episode-article').length"), 0);
await visit('/insights/qa-article'); assert.equal(await evaluate("document.querySelectorAll('.article-body>p').length"), 2);
await visit('/insights/saturated-market-series-pt-1');
assert.ok(await evaluate("document.querySelector('.episode-article').textContent.includes('You have seen it.')"));
assert.equal(await evaluate("[...document.querySelectorAll('main p')].filter(p=>p.textContent.startsWith('You come up with a business idea')).length"), 1);
await call('Page.reload', { ignoreCache: true });
for(const slug of ['Saturated Market Series Pt 1','How To Build a Brand That Stands Out in Nigeria']) { const r=await fetch(`${base}/insights/${encodeURIComponent(slug)}`,{redirect:'manual'}); assert.equal(r.status,308); }
await visit('/insights'); await evaluate('document.fonts.ready.then(()=>true)'); await new Promise(r=>setTimeout(r,400));
const links=await evaluate("[...document.querySelectorAll('.insight-card')].find(c=>c.textContent.includes('Why Is Every Business')).querySelector('.insight-actions').textContent");
assert.ok(links.indexOf('Listen on Spotify')<links.indexOf('Watch on Youtube')); assert.ok(links.includes('View details'));
assert.equal(await evaluate("document.querySelectorAll('a a').length"), 0);
console.log('Pass 1 browser and redirect checks passed');

for (const width of [1440, 820, 390, 320]) {
 await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
 for (const route of ['/work', '/work/qa-project', '/work/qa-project-two']) {
  await visit(route); await new Promise(r => setTimeout(r, 300));
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'), false, route + ' overflow at ' + width);
  assert.equal(await evaluate("document.querySelectorAll('#site-navigation a[href=\"/work\"]').length"), 1);
  assert.equal(await evaluate("document.querySelectorAll('a a').length"), 0);
  if(route==='/work') {
   assert.equal(await evaluate("document.querySelectorAll('.work-card').length"),2);
   const columns=await evaluate("getComputedStyle(document.querySelector('.work-grid')).gridTemplateColumns.split(' ').length"); assert.equal(columns,width<=760?1:2);
   await evaluate("document.querySelector('.work-grid').scrollIntoView({behavior:'instant'})");
  }
  const shot=await call('Page.captureScreenshot',{format:'png'}); fs.writeFileSync('verification/work-'+width+'-'+route.split('/').at(-1)+'.png',Buffer.from(shot.data,'base64'));
 }
 console.log('Work layouts passed',width);
}
await visit('/work/qa-project');
assert.equal(await evaluate("document.querySelector('link[rel=canonical]').getAttribute('href').endsWith('/work/qa-project')"),true);
assert.ok(await evaluate("document.querySelector('.work-story').textContent.includes('My contribution')"));
assert.equal(await evaluate("document.querySelectorAll('.work-metrics>div').length"),1);
assert.equal(await evaluate("document.querySelectorAll('.work-testimonial').length"),1);
assert.equal(await evaluate("document.querySelectorAll('.editorial-gallery img').length"),1);
assert.equal(await evaluate("document.querySelectorAll('.work-adjacent a').length"),1);
await visit('/work/qa-project-two');
assert.equal(await evaluate("document.querySelectorAll('.work-metrics,.work-testimonial,.editorial-gallery').length"),0);
for(const slug of ['qa-draft','qa-hidden','qa-archived','unknown','qa-draft-old','qa-hidden-old','qa-archived-old'])assert.equal((await fetch(base+'/work/'+slug)).status,404,slug);
const redirect=await fetch(base+'/work/qa-project-old',{redirect:'manual'});assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'/work/qa-project');
const filtered=await(await fetch(base+'/work?category=Operations')).text(); assert.ok(filtered.includes('qa-project-two')); assert.ok(!filtered.includes('href="/work/qa-project"'));
const sitemap=await(await fetch(base+'/sitemap.xml')).text(); assert.ok(sitemap.includes('/work/qa-project')); assert.ok(!sitemap.includes('qa-draft')&&!sitemap.includes('qa-hidden')&&!sitemap.includes('qa-archived')&&!sitemap.includes('qa-project-old'));
console.log('Pass 2 browser, filtering, privacy, sitemap and redirect checks passed');
ws.close();





