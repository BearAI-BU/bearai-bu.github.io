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
assert.equal(colab.url,'https://colab.research.google.com/drive/1hi6kUzUZaBouqkYSxZHHUWmOsgCbA_RJ?usp=sharing');
assert.equal(apiKey.url,'https://aistudio.google.com/apikey');
for(const resource of project.workshop2Resources){
 const html=vm.runInContext(`studyResource(${JSON.stringify(resource)})`,ctx);
 assert(html.includes(resource.format));assert(!html.includes('PDF ↗'));assert(html.includes('target="_blank" rel="noopener noreferrer"'));
}
assert(vm.runInContext('studyResource({file:"assets/future.pdf",label:"Read",format:"PDF ↗"})',ctx).includes('href="assets/future.pdf"'));
assert(vm.runInContext('studyResource({file:"assets/legacy.pdf",label:"Read"})',ctx).includes('PDF ↗'));
assert(vm.runInContext('studyResource({url:"https://example.com",title:"<example>",label:"Open",format:"Web ↗"})',ctx).includes('&lt;example&gt;'));
const headings=['Workshop 1 Takeaway','Workshop 2 — Code the Study Assistant','Workshop 2 Resources','Take It Further','Workshop 3 — Add Retrieval'];
for(let i=1;i<headings.length;i++)assert(page.indexOf(headings[i-1])<page.indexOf(headings[i]),headings[i]);
for(const text of ['Design → Code → Improve','01 / DESIGN','02 / CODE','03 / IMPROVE','This is optional and is not required for Workshop #3.','starter materials','href="#/projects/ai-study-assistant/github"'])assert(page.includes(text),text);
for(const forbidden of ['workshop-2-slides','STUDENT_COLAB_URL','cheat-sheet','reference notebook','officer notebook'])assert(!page.includes(forbidden),forbidden);
// Direct entry, refresh-style rendering, and navigation retain the guide and active Projects tab.
ctx.location.hash='#/projects/ai-study-assistant/github';
for(const focus of [false,true]){
 vm.runInContext(`render(${focus})`,ctx);
 const guide=element('#main').innerHTML;
 assert.equal(ctx.document.title,'GitHub Project Setup Guide — BearAI');
 assert(element('#nav').innerHTML.includes('href="#/projects" aria-current="page"'));
 for(const text of ['Project Guide','From Colab to a Python Project','1. Install Python','2. Create Your Project','3. Move From Colab to app.py','4. What Does app.py Look Like?','5. Add the Required Libraries','6. Keep Your API Key Private','7. Add a .gitignore','8. Write a README','9. Run the Project Locally','Using This as a Project','google-auth==2.49.0','getpass()','YOUR_REPOSITORY_URL','Credit the BearAI starter notebook','href="#/projects/ai-study-assistant"'])assert(guide.includes(text),text);
 assert(guide.includes('This is optional and is not required for Workshop #3.'));
 for(const heading of ['Optional: Use a Virtual Environment','Troubleshooting','10. Create a GitHub Repository','11. Check Your Project Before Uploading','12. Publish the Project','Prefer a Visual Interface?','After You Push','Keep Building'])assert(guide.includes(heading),heading);
 for(const command of ['python --version','py --version','python3 --version','python -m pip install -r requirements.txt','py -m pip install -r requirements.txt','python3 -m pip install -r requirements.txt','python app.py','py app.py','python3 app.py'])assert(guide.includes(command),command);
 const blocks=[...guide.matchAll(/<pre class="study-code"><code>([\s\S]*?)<\/code><\/pre>/g)].map(m=>m[1]);
 assert(blocks.includes('google-genai\ngoogle-auth==2.49.0'));
 assert(blocks.includes('__pycache__/\n.venv/\n.env'));
 const publish=blocks.find(block=>block.startsWith('git init\n'));
 assert(publish.startsWith('git init\ngit status\ngit add .\ngit status\ngit commit'));
 assert(guide.indexOf('11. Check Your Project Before Uploading')<guide.indexOf('git add .'));
 assert(guide.includes('Revoke that key in Google AI Studio and create a new one.'));
 assert(guide.includes('organization example'));
 for(const text of ['cd folder-name','cd ..','ls -a','git --version','git config --global user.name &quot;Your Name&quot;','git config --global user.email &quot;your@email.com&quot;','noreply','Get a Gemini API key','https://aistudio.google.com/apikey','NOT a complete runnable application','(.venv)','Optional: Publish Future Changes'])assert(guide.includes(text),text);
 assert(guide.indexOf('git --version')<guide.indexOf('The publishing workflow below runs'));
 assert(guide.indexOf('git config --global user.name')<guide.indexOf('The publishing workflow below runs'));
 const introduction=guide.split('class="study-introduction"')[1].split('</div></div>')[0];
 assert(introduction.indexOf('← Back to AI Study Assistant')<introduction.indexOf('This is optional'));
 assert(guide.includes('git status\ngit add .\ngit commit -m &quot;Describe your changes&quot;\ngit push'));
 assert(guide.includes('.\\.venv\\Scripts\\Activate.ps1'));
 assert(guide.includes('def ask_ai(prompt):'));
 assert(guide.includes('placeholders, not working function implementations'));
 assert.equal((guide.match(/href="#\/projects\/ai-study-assistant"/g)||[]).length,2);
 for(const anchor of guide.matchAll(/<a [^>]*href="https:[^>]*>/g)){
  assert(anchor[0].includes('target="_blank"'));assert(anchor[0].includes('rel="noopener noreferrer"'));
 }
 for(const url of ['https://www.python.org/downloads/','https://code.visualstudio.com/','https://desktop.github.com/'])assert(guide.includes('href="'+url+'"'));
 for(const forbidden of ['BearAI-BU/ai-study-assistant-template','Use this template','<img','coming soon'])assert(!guide.includes(forbidden),forbidden);
 const ids=[...guide.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 assert.equal((source.match(/function studyGithub\(/g)||[]).length,1);
}
ctx.location.hash='#/projects/ai-study-assistant';vm.runInContext('render(true)',ctx);
assert.equal(ctx.document.title,'AI Study Assistant — BearAI');assert(element('#main').innerHTML.includes('Workshop 2 Resources'));
console.log('Study project, Workshop 2 resource formats, PDF compatibility, guide routing, navigation and materials deep link passed.');
