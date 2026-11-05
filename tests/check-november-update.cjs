const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),api=require('../events.js');
const now=Date.parse('2026-11-04T19:00:00-06:00');
const c={window:{},Intl,Date,BearVisual:{markup:()=>''},BearEvents:{classify:e=>api.classify(e,now),next:e=>api.next(e,now)}};
vm.createContext(c);vm.runInContext(read('content.js'),c);vm.runInContext(read('app.js').split('const pages=')[0],c);
const records=c.window.BEARAI.events,groups=api.classify(records,now);
assert.equal(new Set(records.map(e=>e.id)).size,records.length);
for(const [id,count,cover,date,location]of [
 ['resume-linkedin-2026',2,'assets/resume-workshop-sparks-speaking.jpg','2026-10-29T17:30:00-05:00','Cashion C311'],
 ['spooky-stories-2026',3,'assets/spooky-stories-faculty-qa.jpg','2026-10-28T18:00:00-05:00','Tidwell Bible Building GL06']]){
 const e=records.find(e=>e.id===id);c.e=e;
 assert(e.completed);assert.equal(e.photoCredit,records.find(e=>e.id==='workshop-1').photoCredit);assert(groups.past.includes(e));assert(!groups.upcoming.includes(e));
 assert.equal(e.start,date);assert.equal(e.location,location);assert.equal(e.photos.length,count);
 assert.equal(e.photos[e.mainPhotoIndex].src,cover);assert.equal(e.photos[e.previewPhotoIndex].src,cover);
 const detail=vm.runInContext('eventDetail(e.id)',c),preview=vm.runInContext('eventCard(e)',c);
 assert(detail.includes('Past event'));assert(detail.includes(cover));assert(preview.includes(cover));
 for(const p of e.photos){assert(p.alt);assert(detail.includes(p.src));assert(fs.existsSync(path.join(root,p.src)));}
 assert.equal((preview.match(/<img /g)||[]).length,2);
}
const w2=records.find(e=>e.id==='workshop-2');c.e=w2;
assert.equal(api.next(records,now),w2);assert.equal(w2.status,'Confirmed');
assert.equal(w2.start,'2026-11-05T19:30:00-06:00');assert.equal(w2.end,'2026-11-05T20:30:00-06:00');
assert.equal(w2.timeZone,'America/Chicago');assert.equal(w2.location,'Cashion C311');
assert.equal(w2.flyer,'assets/workshop-2-2026.jpg');assert(!w2.photos);
const detail=vm.runInContext('eventDetail(e.id)',c);
for(const text of ['Thursday, November 5, 2026','7:30–8:30 PM','C311',w2.flyer,'Please bring a laptop.'])assert(detail.includes(text),text);
assert(!detail.includes('Past event'));assert(!detail.includes('Event photos'));
assert(api.classify(records,Date.parse(w2.start)).ongoing.includes(w2));
assert(api.classify(records,Date.parse(w2.end)).past.includes(w2));
for(const file of ['app.js','content.js','index.html','resources.js']){
 const text=read(file);
 for(const forbidden of ['function studyGithub','Turn Your Study Assistant Into a GitHub Project','guide-publish','YOUR_REPOSITORY_URL'])assert(!text.includes(forbidden),file+': '+forbidden);
}
console.log('November event photos, selected covers, preserved logistics, automatic classification and guide exclusion passed.');
