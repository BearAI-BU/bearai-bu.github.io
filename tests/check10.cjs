const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const app=fs.readFileSync('app.js','utf8');
for(const reduced of [false,true]){
 let callback,observed=0,unobserved=0,entered=0,disconnected=false;
 const target={classList:{add:()=>entered++,remove:()=>{}}};
 const ctx={window:{IntersectionObserver:true},document:{querySelectorAll:()=>[target]},matchMedia:()=>({matches:reduced,addEventListener(){},removeEventListener(){}}),IntersectionObserver:class{constructor(cb){callback=cb}observe(){observed++}unobserve(){unobserved++}disconnect(){disconnected=true}}};
 vm.runInNewContext('let cleanupEntrances=()=>{};'+app.slice(app.indexOf('function mountEntrances()'))+'\nmountEntrances();',ctx);
 if(reduced)assert.equal(observed,0);else{assert.equal(observed,1);callback([{target,isIntersecting:true}]);assert.equal(entered,1);assert.equal(unobserved,1);vm.runInNewContext('cleanupEntrances()',ctx);assert.ok(disconnected)}
}
const c={window:{}};vm.runInNewContext(fs.readFileSync('content.js','utf8'),c);
const d=c.window.BEARAI;assert.equal(d.officers.find(x=>x.role==='Secretary').name,'Aubrey');assert.equal(d.officers.find(x=>x.role==='Secretary').graduationYear,'Spring 2028');
assert.ok(d.officers.every(x=>!x.major.endsWith('.')));
assert.equal(d.connections.find(x=>x.name==='Tiya Davi').affiliation,'Baylor University');
assert.equal(d.connections.find(x=>x.name==='Dr. Pablo Rivas').bearRole,'Former Faculty Advisor');
assert.ok(!/Noon|noon/.test(app));
console.log('Entrance observer runs once, unregisters, cleans up, and skips reduced motion. Content checks passed.');
