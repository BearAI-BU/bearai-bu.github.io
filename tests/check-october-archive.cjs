const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),api=require('../events.js'),now=Date.parse('2026-10-18T12:00:00-05:00');
const c={window:{},Intl,Date,BearVisual:{markup:()=>''},BearEvents:{classify:e=>api.classify(e,now),next:e=>api.next(e,now)}};vm.createContext(c);vm.runInContext(read('content.js'),c);vm.runInContext(read('app.js').split('const pages=')[0],c);
const data=c.window.BEARAI,html=vm.runInContext('events()',c),table=html.match(/<table class="semester-table">[\s\S]*?<\/table>/)[0];
const rows=[...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m=>m[1]);
for(const id of ['general-interest','service-event-2026','workshop-1']){const e=data.events.find(e=>e.id===id);assert(e.completed);assert(api.classify(data.events,now).past.includes(e));assert(rows.some(r=>r.includes(e.title)&&r.includes('Completed')));assert(!vm.runInContext('home()',c).includes('id="'+id+'"'));}
assert(table.indexOf('September 24')<table.indexOf('October 14'));assert(table.indexOf('October 14')<table.indexOf('October 15'));assert(table.indexOf('November 19')<table.indexOf('TBD'));
for(const view of ['home()','community()','connections()',"eventDetail('workshop-1')","eventDetail('service-event-2026')"]){assert(!vm.runInContext(view,c).includes('>Confirmed<'));}
assert(!html.replace(table,'').includes('>Confirmed<'));assert(!read('content.js').includes('Lockheed'));
const w2=data.events.find(e=>e.id==='workshop-2');assert.equal(w2.status,'Tentative');assert.equal(w2.proposedDate,'2026-11-05');assert(api.classify(data.events,now).planned.includes(w2));
for(const [id,count] of [['workshop-1',6],['service-event-2026',3]]){const e=data.events.find(e=>e.id===id);assert.equal(e.photos.length,count);assert.equal(new Set(e.photos.map(p=>p.src)).size,count);c.e=e;const preview=vm.runInContext('eventCard(e)',c);assert.equal((preview.match(/<img /g)||[]).length,2);assert(preview.indexOf(e.flyer)<preview.indexOf(e.photos[0].src));const detail=vm.runInContext('eventDetail(e.id)',c);for(const p of e.photos)assert(detail.includes(p.src));assert(preview.includes('Event details & gallery'));assert(!e.photoCredit);}
assert.equal(data.communityHighlights[0].eventId,'workshop-1');assert.equal(data.communityHighlights[0].photoIndex,0);
assert(data.communityHighlights.some(h=>h.eventId==='service-event-2026'));assert(data.communityHighlights.filter(h=>h.eventId==='workshop-1').length<6);
const slides=data.events.find(e=>e.id==='workshop-1').materials[0];assert.equal(fs.readFileSync(path.join(root,slides.file)).subarray(0,5).toString(),'%PDF-');assert(vm.runInContext('studyAssistant()',c).includes(slides.file));
console.log('Completed semester order, status visibility, shared slides, photo counts, curated community and unchanged Workshop 2 passed.');
