const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const source=read('app.js'),ctx={window:{},Intl,Date,URLSearchParams};vm.createContext(ctx);vm.runInContext(read('content.js'),ctx);vm.runInContext(source.split('const pages=')[0],ctx);
const project=ctx.window.BEARAI.projects.find(p=>p.id==='ai-study-assistant');
assert.equal(ctx.window.BEARAI.projects.filter(p=>p.id===project.id).length,1);
const listing=vm.runInContext('projects()',ctx),page=vm.runInContext('studyAssistant()',ctx);
assert(listing.includes('View Project →'));assert(listing.includes('In Progress'));assert(listing.includes('LLMs · Prompting · Python · APIs · RAG'));assert(!listing.includes('Project to be announced'));
for(const text of ['Workshop 1 Materials','Design a Prompt-Based Study Assistant','What Participants Will Do','A Simple Prompting Framework','Save your prompt—you’ll build on these ideas in Workshop 2.','Workshop 2 — Code the Study Assistant','Workshop 3 — Add Retrieval','Learn AI · Build with AI · Connect through AI'])assert(page.includes(text),text);
assert.equal((page.match(/id="workshop-1-materials"/g)||[]).length,1);
assert(page.includes('href="#/projects/ai-study-assistant?section=workshop-1-materials"'));
assert(page.includes(ctx.window.BEARAI.join.groupme));assert(page.includes('href="#/events"'));
assert.equal(project.materials.length,1);assert(page.includes('href="assets/workshop-1-sample-notes.pdf"'));
assert.equal(fs.readFileSync(path.join(root,project.materials[0].file)).subarray(0,5).toString(),'%PDF-');
for(const forbidden of ['Activity Guide','Workshop Slides','Example Study Assistant Prompt','How many moons does Asteron have?','October 15','Cashion','disabled'])assert(!page.includes(forbidden),forbidden);
// Exercise the real renderer on an initial direct visit and a hash navigation.
const elements=new Map();function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',classList:{remove(){}},setAttribute(){},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}});return elements.get(id);}
ctx.document={querySelector:element,getElementById:element};ctx.location={hash:'#/projects/ai-study-assistant?section=workshop-1-materials'};ctx.requestAnimationFrame=fn=>fn();ctx.window.scrollTo=()=>{};ctx.BearVisual={scrambleHeadings(){}};
vm.runInContext('setupNetwork=()=>{};mountExplore=()=>{};mountEntrances=()=>{};',ctx);
vm.runInContext(source.slice(source.indexOf('const pages='),source.indexOf("document.querySelector('.menu').addEventListener")),ctx);
for(const focus of [false,true]){vm.runInContext(`render(${focus})`,ctx);assert(element('workshop-1-materials').focused);assert(element('workshop-1-materials').scrolled);assert(element('#main').innerHTML.includes('Open Sample Notes'));assert.equal(ctx.document.title,'AI Study Assistant — BearAI');assert(element('#nav').innerHTML.includes('href="#/projects" aria-current="page"'));assert(!element('#nav').innerHTML.includes('href="#/projects/ai-study-assistant"'));}
console.log('Study project, published-only materials, PDF, active navigation and direct materials route passed.');
