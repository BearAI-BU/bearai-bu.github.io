(function(){
 // Mirror the left contour and graph about x=300; randomness affects only animation.
 const source=window.BEAR_TRACE.outline;
 const left=[];source.forEach((p,i)=>{const q=source[(i+1)%source.length];if(p[0]<=300)left.push(p);if((p[0]<300&&q[0]>300)||(p[0]>300&&q[0]<300))left.push([300,p[1]+(q[1]-p[1])*(300-p[0])/(q[0]-p[0])]);});
 const top=left.findIndex(p=>p[0]===300);const half=[...left.slice(top),...left.slice(0,top)];
 // The clipped polygon runs top-center to bottom-center along the clipping edge.
 const axis=half.findIndex((p,i)=>i>0&&p[0]===300);const side=[half[0],...half.slice(axis).reverse()];
 const traced=[...side,...side.slice(1,-1).reverse().map(([x,y])=>[600-x,y])];
 const halfBoundary=window.BEAR_TRACE.boundary.filter(p=>p[0]<296);
 const outline=[...halfBoundary,...halfBoundary.map(([x,y])=>[600-x,y]),side[0],side.at(-1)];
 function isInside(x,y){let inside=false;for(let i=0,j=traced.length-1;i<traced.length;j=i++){const a=traced[i],b=traced[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
 const inside=[];for(let row=0,y=100;y<455;y+=52,row++){for(let x=120+(row%2)*26;x<300;x+=52){if(isInside(x,y)&&outline.every(p=>Math.hypot(x-p[0],y-p[1])>22)&&Math.hypot(x-300,y-280)>25)inside.push([x,y],[600-x,y]);}}inside.push([300,280]);
 const points=[...outline,...inside],target=points.length-1,graph=points.map(()=>[]),edges=[],seen=new Set();
 const mirror=points.map(p=>points.findIndex(q=>Math.abs(q[0]-(600-p[0]))<.001&&Math.abs(q[1]-p[1])<.001));
 function addEdge(i,j){const key=[i,j].sort((a,b)=>a-b).join(',');if(i===j||seen.has(key))return;seen.add(key);const d=Math.hypot(points[i][0]-points[j][0],points[i][1]-points[j][1]);graph[i].push({j,d});graph[j].push({j:i,d});edges.push([i,j]);}
 points.forEach((p,i)=>{points.map((q,j)=>({j,d:Math.hypot(q[0]-p[0],q[1]-p[1])})).filter(x=>x.j!==i&&x.d<130).sort((a,b)=>a.d-b.d).slice(0,5).forEach(({j})=>{addEdge(i,j);addEdge(mirror[i],mirror[j]);});});
 const outlinePath='M '+traced.map(p=>p.join(',')).join(' L ')+' Z';
 function markup(){return `<div class="network bear-network"><button class="bear-trigger" aria-label="Illuminate the BearAI network with a new signal pattern"><svg viewBox="0 0 600 530" aria-hidden="true"><defs><radialGradient id="green"><stop stop-color="#d5f5e3"/><stop offset="1" stop-color="#459472"/></radialGradient><clipPath id="bear-clip"><path d="${outlinePath}"/></clipPath><radialGradient id="core-light"><stop stop-color="#f6ce65" stop-opacity=".6"/><stop offset="1" stop-color="#e5b74f" stop-opacity="0"/></radialGradient></defs><g clip-path="url(#bear-clip)">${edges.map(([i,j],n)=>`<g class="network-edge" data-from="${i}" data-to="${j}"><path d="M${points[i]} L${points[j]}" stroke="#83c5a2" stroke-opacity=".23" fill="none"/>${n%19===0?`<path class="signal" pathLength="100" d="M${points[i]} L${points[j]}" stroke="#b1e6c8" stroke-width="1.4" fill="none" style="animation-delay:-${n%7}s"/>`:''}</g>`).join('')}</g><path class="network-outline" d="${outlinePath}" fill="none" stroke="#8ac2a2" stroke-width="1.4" stroke-opacity=".5"/>${points.map((p,i)=>`<circle class="network-node" data-node="${i}" cx="${p[0]}" cy="${p[1]}" r="3.5" fill="url(#green)" stroke="#91cbb0" stroke-width=".6"/>`).join('')}<g class="arrival-paths" clip-path="url(#bear-clip)"></g><circle class="core-aura" cx="300" cy="280" r="85" fill="url(#core-light)"/><circle class="core-ring" cx="300" cy="280" r="25" fill="none" stroke="#e5b74f" stroke-opacity=".5" stroke-width="1.5"/><circle class="bear-core" cx="300" cy="280" r="15" fill="#e5b74f"/></svg></button><div class="network-tools"><button class="motion-control" aria-pressed="false">Pause animation</button></div><span class="sr-only" role="status" id="signal-status"></span></div>`;}
 function randomPath(start){
  const costs=points.map(()=>Infinity),prev=[],unseen=new Set(points.map((_,i)=>i));costs[start]=0;
  while(unseen.size){let current=[...unseen].reduce((a,b)=>costs[a]<costs[b]?a:b);if(current===target)break;unseen.delete(current);for(const e of graph[current]){const cost=costs[current]+e.d*(.35+Math.random()*1.7);if(unseen.has(e.j)&&cost<costs[e.j]){costs[e.j]=cost;prev[e.j]=current;}}}
  const route=[target];while(route[0]!==start&&prev[route[0]]!==undefined)route.unshift(prev[route[0]]);return route;
 }
 let cleanupEntrance=()=>{};
 function mount(){cleanupEntrance();const network=document.querySelector('.network');if(!network)return;const pause=network.querySelector('.motion-control'),trigger=network.querySelector('.bear-trigger'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let lastStarts='',count=0;
 const nodes=[...network.querySelectorAll('.network-node')];let lastNode;
 const finish=()=>{network.classList.remove('assembling');trigger.disabled=false;network.setAttribute('aria-busy','false');network.querySelector('#signal-status').textContent='Bear network ready.';};
 const onEnd=event=>{if(event.target===lastNode&&event.animationName==='node-entrance')finish();};
 const onPreference=()=>{if(reduced.matches)finish();};
 if(!reduced.matches){
  const order=nodes.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const delays=[];order.forEach((id,rank)=>{delays[id]=rank*40;nodes[id].style.setProperty('--appear-at',`${delays[id]}ms`);});
  network.querySelectorAll('.network-edge').forEach(edge=>edge.style.setProperty('--appear-at',`${Math.max(delays[+edge.dataset.from],delays[+edge.dataset.to])+160}ms`));
  // Last node finishes after the final connecting lines have appeared.
  lastNode=nodes[order.at(-1)];lastNode.style.animationDuration='420ms';
  network.style.setProperty('--assembly-duration',`${(nodes.length-1)*40+420}ms`);
  trigger.disabled=true;network.classList.add('assembling');network.setAttribute('aria-busy','true');network.querySelector('#signal-status').textContent='Bear network assembling.';
  network.addEventListener('animationend',onEnd);reduced.addEventListener('change',onPreference);
 }
 cleanupEntrance=()=>{network.removeEventListener('animationend',onEnd);reduced.removeEventListener('change',onPreference);};

 pause.addEventListener('click',()=>{const paused=network.classList.toggle('paused');pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume animation':'Pause animation';});
 trigger.addEventListener('click',()=>{
  let starts;do{starts=[...Array(outline.length).keys()].sort(()=>Math.random()-.5).slice(0,4);}while(starts.join(',')===lastStarts);lastStarts=starts.join(',');
  const layer=network.querySelector('.arrival-paths');
  network.classList.toggle('instant',reduced.matches||network.classList.contains('paused'));
  if(!reduced.matches&&!network.classList.contains('paused')){
   // Each click owns its paths. Never restart an already visible path or a shared class.
   const batch=document.createElementNS('http://www.w3.org/2000/svg','g');batch.classList.add('signal-batch');
   batch.innerHTML=starts.map(randomPath).map(path=>`<path class="inward-signal" pathLength="100" d="M${path.map(i=>points[i].join(',')).join(' L')}" stroke="#ffdb76" stroke-width="3" stroke-linecap="round" fill="none"/>`).join('')+'<circle class="arrival-pulse" cx="300" cy="280" r="20" fill="none" stroke="#ffdb76" stroke-width="2"/>';
   batch.addEventListener('animationend',event=>{if(event.animationName==='arrival-pulse')batch.remove();});layer.append(batch);
  }
  network.querySelector('#signal-status').textContent=`Signal pattern ${++count} sent to the golden center.`;
 });
 }
 let cleanup=()=>{};
 function scrambleHeadings(){cleanup();const media=matchMedia('(prefers-reduced-motion: reduce)');if(media.matches)return;const jobs=[];const headings=[...document.querySelectorAll('.hero h1.entrance')];
 headings.forEach(heading=>{heading.setAttribute('aria-label',heading.innerText.replace(/\s+/g,' ').trim());const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const texts=[];while(walker.nextNode())texts.push(walker.currentNode);texts.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){fragment.append(document.createTextNode(word));return;}const wrap=document.createElement('span');wrap.className='scramble-word';wrap.setAttribute('aria-hidden','true');[...word].forEach(char=>{const slot=document.createElement('span');slot.className='scramble-char';const base=document.createElement('span');base.className='scramble-base';base.textContent=char;const ink=document.createElement('span');ink.className='scramble-ink';ink.textContent="";slot.append(base,ink);wrap.append(slot);jobs.push({heading,ink,char});});fragment.append(wrap);});node.replaceWith(fragment);});});
 const running=new Map();let frame=0;const symbols='$%JAI01#XZ';const finish=heading=>{jobs.filter(j=>j.heading===heading).forEach(j=>j.ink.textContent=j.char);running.delete(heading);};
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){running.set(entry.target,performance.now());observer.unobserve(entry.target);}if(running.size&&!frame)frame=requestAnimationFrame(tick);},{threshold:.2});
 let lastTick=0;function tick(now){frame=0;if(now-lastTick>25){lastTick=now;for(const [h,start]of running){const chars=jobs.filter(j=>j.heading===h),step=65,elapsed=now-start,active=Math.floor(elapsed/step);chars.forEach((j,i)=>{j.ink.textContent=i<active?j.char:i===active?(elapsed%step<35?symbols[Math.floor(Math.random()*symbols.length)]:j.char):'';});if(active>=chars.length)finish(h);}}if(running.size)frame=requestAnimationFrame(tick);}
 headings.forEach(h=>observer.observe(h));function stop(){observer.disconnect();cancelAnimationFrame(frame);jobs.forEach(j=>j.ink.textContent=j.char);running.clear();media.removeEventListener('change',stop);}media.addEventListener('change',stop);cleanup=stop;
 }
 window.BearVisual={markup,mount,scrambleHeadings};
})();
