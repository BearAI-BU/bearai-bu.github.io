const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const source=read('app.js'),ctx={window:{},Intl,Date,URLSearchParams};vm.createContext(ctx);vm.runInContext(read('content.js'),ctx);vm.runInContext(source.split('const pages=')[0],ctx);
const project=ctx.window.BEARAI.projects.find(p=>p.id==='ai-study-assistant');
assert.equal(ctx.window.BEARAI.projects.filter(p=>p.id===project.id).length,1);
const listing=vm.runInContext('projects()',ctx),page=vm.runInContext('studyAssistant()',ctx);
assert(listing.includes('View Project →'));assert(listing.includes('In Progress'));assert(listing.includes('LLMs · Prompting · Python · APIs · RAG'));assert(!listing.includes('Project to be announced'));
for(const text of ['Workshop 1 Materials','Design a Prompt-Based Study Assistant','What Participants Will Do','A Simple Prompting Framework','Save your prompt—you’ll build on these ideas in Workshop 2.','Workshop 2 — Code the Study Assistant','Workshop 3 — Add Retrieval','Learn AI · Build with AI · Connect through AI'])assert(page.includes(text),text);
assert.equal((page.match(/id="workshop-1-materials"/g)||[]).length,1);
assert(!page.split('The Three-Part Progression')[0].includes('class="actions"'));
assert(page.includes('prompt engineering workshop'));
assert(page.includes('acknowledge when information is missing'));
assert(page.includes(ctx.window.BEARAI.join.groupme));assert(page.includes('href="#/events"'));
assert.equal(project.materials.length,1);assert(page.includes('View Workshop 1 Slides'));assert(page.includes('Workshop 1 · Completed'));assert(page.includes('href="assets/workshop-1-sample-notes.pdf"'));
assert.equal(fs.readFileSync(path.join(root,project.materials[0].file)).subarray(0,5).toString(),'%PDF-');
for(const forbidden of ['Activity Guide','Workshop Slides','Example Study Assistant Prompt','How many moons does Asteron have?','October 15','Cashion','disabled'])assert(!page.includes(forbidden),forbidden);
// Exercise the real renderer on an initial direct visit and a hash navigation.
const elements=new Map();function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',classList:{remove(){}},setAttribute(){},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}});return elements.get(id);}
ctx.document={querySelector:element,getElementById:element};ctx.location={hash:'#/projects/ai-study-assistant?section=workshop-1-materials'};ctx.requestAnimationFrame=fn=>fn();ctx.window.scrollTo=()=>{};ctx.BearVisual={scrambleHeadings(){}};
vm.runInContext('setupNetwork=()=>{};mountExplore=()=>{};mountEntrances=()=>{};',ctx);
vm.runInContext(source.slice(source.indexOf('const pages='),source.indexOf("document.querySelector('.menu').addEventListener")),ctx);
for(const focus of [false,true]){vm.runInContext(`render(${focus})`,ctx);assert(element('workshop-1-materials').focused);assert(element('workshop-1-materials').scrolled);assert(element('#main').innerHTML.includes('Open Sample Notes'));assert.equal(ctx.document.title,'AI Study Assistant — BearAI');assert(element('#nav').innerHTML.includes('href="#/projects" aria-current="page"'));assert(!element('#nav').innerHTML.includes('href="#/projects/ai-study-assistant"'));}
// Workshop 2 resources have explicit formats; legacy PDF records still render.
assert.equal(project.workshop2Resources.length,2);
const [colab,apiKey]=project.workshop2Resources;
assert.equal(colab.url,'https://colab.research.google.com/drive/1VQK5HZe-cMBqk4LLstGTTm8Xs8855l-1?usp=sharing');
assert.equal(apiKey.url,'https://aistudio.google.com/apikey');
for(const resource of project.workshop2Resources){
 const html=vm.runInContext(`studyResource(${JSON.stringify(resource)})`,ctx);
 assert(html.includes(resource.format));assert(!html.includes('PDF ↗'));assert(html.includes('target="_blank" rel="noopener noreferrer"'));
}
assert(vm.runInContext('studyResource({file:"assets/future.pdf",label:"Read",format:"PDF ↗"})',ctx).includes('href="assets/future.pdf"'));
assert(vm.runInContext('studyResource({file:"assets/legacy.pdf",label:"Read"})',ctx).includes('PDF ↗'));
assert(vm.runInContext('studyResource({url:"https://example.com",title:"<example>",label:"Open",format:"Web ↗"})',ctx).includes('&lt;example&gt;'));
const headings=['Workshop 1 Takeaway','Workshop 2 — Code the Study Assistant','Workshop 2 Resources','Workshop 2 Takeaway','Workshop 3 — Add Retrieval'];
for(let i=1;i<headings.length;i++)assert(page.indexOf(headings[i-1])<page.indexOf(headings[i]),headings[i]);
for(const text of ['Design → Code → Improve','01 / DESIGN','02 / CODE','03 / IMPROVE','starter materials'])assert(page.includes(text),text);
for(const forbidden of ['workshop-2-slides','STUDENT_COLAB_URL','cheat-sheet','reference notebook','officer notebook'])assert(!page.includes(forbidden),forbidden);
// Removed guide rejects direct visits and refreshes; project resources remain available.
ctx.location.hash='#/projects/ai-study-assistant/github';
for(const focus of [false,true]){
 vm.runInContext(`render(${focus})`,ctx);
 assert.equal(ctx.document.title,'Page not found — BearAI');
 assert(element('#main').innerHTML.includes('This page doesn’t exist.'));
 assert(!element('#main').innerHTML.includes('From Colab to a Python Project'));
}
assert(!source.includes('function studyGithub'));
assert(!page.includes('projects/ai-study-assistant/github'));
assert(!page.includes('Turn Your Study Assistant Into a GitHub Project'));
ctx.location.hash='#/projects/ai-study-assistant';vm.runInContext('render(true)',ctx);
assert.equal(ctx.document.title,'AI Study Assistant — BearAI');assert(element('#main').innerHTML.includes('Workshop 2 Resources'));
console.log('Study project, Workshop 2 resource formats, PDF compatibility, guide removal, navigation and materials deep link passed.');
