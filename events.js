// Local data only. A future calendar adapter can supply records in this format.
(function(root){
 function timestamp(value){return typeof value==='string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(value)?Date.parse(value):NaN;}
 function classify(records,now=Date.now()){
 const valid=records.filter(e=>!e.hidden&&!e.cancelled);
 const dated=valid.filter(e=>Number.isFinite(timestamp(e.start))).sort((a,b)=>timestamp(a.start)-timestamp(b.start));
 return {upcoming:dated.filter(e=>timestamp(e.start)>now),ongoing:dated.filter(e=>timestamp(e.start)<=now&&timestamp(e.end)>now),past:dated.filter(e=>timestamp(e.start)<=now&&!(timestamp(e.end)>now)).reverse(),undated:valid.filter(e=>!Number.isFinite(timestamp(e.start)))};
 }
 const api={classify,next:(records,now)=>classify(records,now).upcoming[0]||null};
 if(typeof module!=='undefined')module.exports=api;else root.BearEvents=api;
})(typeof window!=='undefined'?window:globalThis);
