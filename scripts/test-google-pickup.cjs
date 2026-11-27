const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const cache=new Map(),requests=[],writes=[],payments=[];let responseRows=[],status=200;
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;const requireLocal=id=>{
 if(id==='server-only')return {};
 if(id==='./stripeCheckout')return {checkout:async(site,origin,order)=>{payments.push({site,origin,order});return 'https://checkout.stripe.com/test';},fulfill:()=>{}};
 if(id==='./adminStore')return {getAdminRecord:async()=>null,upsertAdminRecord:async row=>writes.push(row),markAdminRecordCommandCenterSynced:async()=>{}};
 if(['./paymentDelivery','./bookingEmails','./commandCenter'].includes(id))return {};
 if(id.startsWith('.')){const p=path.resolve(path.dirname(file),id);return p.endsWith('.json')?JSON.parse(fs.readFileSync(p,'utf8')):load(p+'.ts');}return require(id);
 };vm.runInNewContext(code,{exports:m.exports,require:requireLocal,URL,URLSearchParams,AbortSignal,Date,Set,Map,console,process:{env:{}},fetch:async url=>{requests.push(new URL(url));return {ok:status===200,json:async()=>({locations:responseRows})};}});return m.exports;}
(async()=>{
 const {googlePickupLocations,verifyGooglePickup}=load('lib/googlePickup.ts');
 responseRows=[{id:'legacy',slug:'legacy',name:'Hyatt Ziva Cap Cana',googlePlaceId:'ChIJFixture12345',zoneName:'Cap Cana',googleMapsUrl:'https://www.google.com/maps/?query_place_id=ChIJFixture12345'}];
 const places=await googlePickupLocations('Hyatt','punta-cana');assert.equal(places[0].id,'google:ChIJFixture12345');assert.equal(places[0].calculatorZone,'Cap Cana');assert.equal(requests[0].searchParams.get('provider'),'google');assert.equal(requests[0].searchParams.get('region'),'punta-cana');
 await verifyGooglePickup('hyatt-ziva-cap-cana','punta-cana');assert.equal(requests.at(-1).searchParams.get('region'),'punta-cana');assert.equal(requests.at(-1).searchParams.get('resolve'),'1');
 responseRows.push({...responseRows[0],googlePlaceId:'ChIJOther12345'});await assert.rejects(verifyGooglePickup('unresolved hotel','punta-cana'),/exact accommodation/);responseRows.pop();
 status=422;await assert.rejects(verifyGooglePickup('google:ChIJFixture12345','la-romana'),/departure area/);status=200;
 const {start}=load('lib/stripeAdapter.ts'),p={productId:'buggy-doble',date:'2099-12-05',passengers:2,fleet:{'buggy-doble':1},fleetConfirmed:true,pickupZone:'Cap Cana',hotel:'wrong browser label',googlePickupRef:'google:ChIJFixture12345',name:'Fixture Guest',phone:'+18095550100',email:'qa@example.test',locale:'en',pickupWindow:'Morning',requestId:'google-pickup-fixture-123456789'};
 await assert.rejects(start({...p,pickupZone:'Bavaro / Punta Cana'}),/pickup area/);assert.equal(writes.length,0);assert.equal(payments.length,0);
 await start(p);assert.equal(writes.length,1);assert.equal(writes[0].booking.hotel,'Hyatt Ziva Cap Cana');assert.equal(writes[0].booking.googlePickupRef,'google:ChIJFixture12345');assert.equal(payments[0].order.amount,70);assert.equal(payments[0].order.details.google_pickup_maps,responseRows[0].googleMapsUrl);
 console.log('PASS: Google identity/region, ambiguous and wrong-region rejection, pickup surcharge validation, native payment/operations metadata; no database or network writes');
})().catch(e=>{console.error(e);process.exitCode=1;});
