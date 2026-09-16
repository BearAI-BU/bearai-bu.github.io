const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm'),assert=require('node:assert/strict');
process.chdir(path.resolve(__dirname,'..'));
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.js')))cp.execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
for(const file of fs.readdirSync('tests').filter(f=>f.endsWith('.cjs')))cp.execFileSync(process.execPath,['tests/'+file],{stdio:'inherit'});
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('content.js','utf8'),ctx);
function check(v){if(typeof v==='string'&&v.startsWith('assets/'))assert.ok(fs.existsSync(v),'Missing asset: '+v);else if(v&&typeof v==='object')Object.values(v).forEach(check);}
check(ctx.window.BEARAI);console.log('JavaScript syntax and content asset references passed.');
