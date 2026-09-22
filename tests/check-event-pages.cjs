const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const api=require('../events.js'),now=Date.parse('2026-09-21T18:00:00-05:00');
const context={window:{},Intl,Date,BearVisual:{markup:()=>''},BearEvents:{classify:e=>api.classify(e,now),next:e=>api.next(e,now)}};
vm.createContext(context);vm.runInContext(read('content.js'),context);
vm.runInContext(read('app.js').split('const pages=')[0],context);
const home=vm.runInContext('home()',context),events=vm.runInContext('events()',context);
assert(home.includes('BearAI General Interest Meeting'));assert(!home.includes('ECS Tailgate'));
assert(home.includes('Cashion C311'));assert(home.includes('7:30–8:30 PM'));
assert(!home.includes('America/Chicago'));
assert.equal(context.window.BEARAI.events.find(e=>e.id==='general-interest').timeZone,'America/Chicago');
assert(home.includes('assets/gim-september-2026.png'));assert(home.includes('Shorty'));
assert(events.indexOf('ECS Tailgate')>events.indexOf('Past events'));
assert(events.includes('Event photos coming soon.'));assert(events.includes('Promotional flyer'));
for(const e of context.window.BEARAI.events.filter(e=>!e.hidden&&!e.cancelled)){
 const html=vm.runInContext(`eventDetail(${JSON.stringify(e.id)})`,context);
 assert(!html.includes('Event not found.'));assert(html.includes('← All events'));
}
const example=JSON.parse(read('docs/events.md').match(/```json\s*([\s\S]*?)```/)[1]);
assert.deepEqual(example,JSON.parse(JSON.stringify(context.window.BEARAI.events.find(e=>e.id==='general-interest'))));
assert(!/Visual draft|This preview needs/i.test(read('app.js')+read('index.html')));
console.log('Homepage, event archive, detail routes, promotional media, and documented GIM example passed.');
