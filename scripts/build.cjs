const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
// Static site: package only public website files, without compilation.
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','styles.css','app.js','content.js','events.js','resources.js','trace.js','visuals.js','.nojekyll','assets']) fs.cpSync(path.join(root,file),path.join(out,file),{recursive:true});
console.log('Website packaged in dist/');
