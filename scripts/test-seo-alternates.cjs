const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,file);
const redirects=require('../seo-redirects.json'),{searchLandings,searchLandingPath}=require('../lib/searchLandings.ts');
assert.equal(new Set(redirects.map(r=>r.source)).size,redirects.length);
const mapping=new Map(redirects.map(r=>[r.source,r.destination]));
const unpaired=[];
for(const landing of searchLandings){
 const es='/excursiones/'+landing.es.slug,en='/en/excursions/'+landing.en.slug;
 if(mapping.has(es)!==mapping.has(en))unpaired.push({id:landing.id,es,en});
 assert.ok(!mapping.has(searchLandingPath(landing,'es')),'Redirect chain in Spanish');
 assert.ok(!mapping.has(searchLandingPath(landing,'en')),'Redirect chain in English');
}
assert.deepEqual(unpaired,[],'Every consolidated landing must consolidate both languages');
console.log(JSON.stringify({redirects:redirects.length,landingPairs:searchLandings.length,unpaired:unpaired.length}));
