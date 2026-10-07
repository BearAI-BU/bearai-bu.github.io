const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path'),root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const api=require('../events.js'),now=Date.parse('2026-09-28T18:00:00-05:00');
const context={window:{},Intl,Date,BearVisual:{markup:()=>''},BearEvents:{classify:e=>api.classify(e,now),next:e=>api.next(e,now)}};
vm.createContext(context);vm.runInContext(read('content.js'),context);
vm.runInContext(read('app.js').split('const pages=')[0],context);
const home=vm.runInContext('home()',context),events=vm.runInContext('events()',context);
assert(home.includes('AI Workshop #1'));assert(home.includes('Tentative'));
assert(!home.includes('BearAI General Interest Meeting'));
const gim=context.window.BEARAI.events.find(e=>e.id==='general-interest');
assert.equal(gim.timeZone,'America/Chicago');assert.equal(gim.photos.length,4);
assert.equal(new Set(gim.photos.map(p=>p.src)).size,4);
assert(events.indexOf('BearAI General Interest Meeting')>events.indexOf('Past Events'));
const detail=vm.runInContext("eventDetail('general-interest')",context);
assert(detail.includes('7:30–8:30 PM'));assert(!detail.includes('America/Chicago'));
assert(detail.includes('View original promotional flyer'));assert(detail.includes('Cashion C311'));
const community=vm.runInContext('community()',context);
assert(community.includes('gim-aubrey-alessandro.png'));assert(community.includes('gim-alessandro-questions.png'));
assert(!community.includes('gim-lucas-survey.png'));assert(community.includes('#/events/general-interest'));
const planned=context.window.BEARAI.events.find(e=>e.id==='workshop-1');
assert(api.classify([planned],now).undated.includes(planned));assert.equal(api.classify([planned],now).past.length,0);
assert.equal(api.next([planned,{id:'confirmed',status:'Confirmed',start:'2026-10-01T19:00:00-05:00'}],now).id,'confirmed');
assert(events.indexOf('ECS Tailgate')>events.indexOf('Past Events'));
assert(!events.includes('Event photos coming soon.'));
const tailgate=vm.runInContext("eventDetail('ecs-tailgate-2026')",context);
for(const image of ['ecs-tailgate-bearai.jpg','ecs-tailgate-hat.jpg']){assert(tailgate.includes(image));assert.equal(events.includes(image),image==='ecs-tailgate-bearai.jpg');}
assert(community.includes('ecs-tailgate-bearai.jpg'));assert(!community.includes('ecs-tailgate-hat.jpg'));
assert(community.includes('#/events/ecs-tailgate-2026'));
assert(!tailgate.includes('Event photos coming soon.'));assert(events.includes('Promotional flyer'));
for(const e of context.window.BEARAI.events.filter(e=>!e.hidden&&!e.cancelled)){
 const html=vm.runInContext(`eventDetail(${JSON.stringify(e.id)})`,context);
 assert(!html.includes('Event not found.'));assert(html.includes('← All events'));
}
const example=JSON.parse(read('docs/events.md').match(/```json\s*([\s\S]*?)```/)[1]);
for(const key of ['id','start','end','timeZone','location'])assert.equal(example[key],gim[key]);
assert(!/Visual draft|This preview needs/i.test(read('app.js')+read('index.html')));
console.log('Homepage, event archive, detail routes, promotional media, and documented GIM example passed.');
for(const article of events.matchAll(/<article\b[^>]*id="([^"]+)"[\s\S]*?<\/article>/g)){
 assert((article[0].match(/<img\b/g)||[]).length<=2,article[1]+' has too many preview images');
 assert(article[0].includes('Event details &amp; gallery')||article[0].includes('Event details & gallery'));
}
assert.equal((detail.match(/class="past-gallery"[\s\S]*?<\/div>/)?.[0].match(/<img\b/g)||[]).length,4);
assert(vm.runInContext("eventDetail('picnic-palooza-2026')",context).includes('← All events'));
console.log('Event previews limited to two images; full GIM gallery and Picnic return link preserved.');

const peopleHtml=vm.runInContext("people()",context);
for(const officer of context.window.BEARAI.officers)assert(peopleHtml.includes(officer.name));
for(const [photo,scale] of [["lucas.jpg",1.8],["chelsey.jpg",1.9]]){const officer=context.window.BEARAI.officers.find(o=>o.photo.endsWith(photo));assert.equal(officer.scale,scale);}

assert(events.indexOf('Upcoming Events')<events.indexOf('Fall 2026'));
assert(events.indexOf('Fall 2026')<events.indexOf('Past Events'));
assert(!events.includes('Dates to be confirmed'));
const plans=context.window.BEARAI.events.filter(e=>e.semester==='Fall 2026');assert.equal(plans.length,7);
assert.equal(plans.filter(e=>e.id==='workshop-1').length,1);
assert(plans.every(e=>e.status==='Tentative'));assert.equal(plans.find(e=>e.id==='lockheed-ai-speaker').proposedDate,null);
assert(!events.includes('November 12'));assert(events.includes('Date unknown'));
assert(!events.includes('href="#/events/workshop-1"'));assert(!home.includes('href="#/events/workshop-1"'));
assert(events.includes('assets/workshop-1-2026.png'));
const future=Date.parse('2026-12-01T00:00:00Z');assert.equal(api.classify(plans,future).past.length,0);
const proposed={id:'proposed',status:'Tentative',start:'2026-10-10T19:00:00-05:00'};
const confirmed={id:'approved',status:'Confirmed',start:'2026-10-20T19:00:00-05:00'};
assert.equal(api.next([proposed,confirmed],now).id,'approved');assert.equal(api.next([proposed],now),null);
assert.equal(api.classify([proposed],future).past.length,0);
planned.status='Confirmed';planned.start='2026-10-15T19:00:00-05:00';planned.detailsPending=false;
const updated=vm.runInContext('events()',context),updatedHome=vm.runInContext('home()',context);
assert(updated.includes('Confirmed'));assert(updated.indexOf('AI Workshop #1')<updated.indexOf('Fall 2026'));
assert(updatedHome.includes('AI Workshop #1'));assert(updatedHome.includes('Confirmed'));
console.log('Semester order, tentative dates, confirmation priority, placeholder links and flyer passed.');
