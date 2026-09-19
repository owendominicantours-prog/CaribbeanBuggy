const {test}=require('node:test');
const assert=require('node:assert/strict');
const {verifyCompletedPayment}=require('./paypalPayment.ts');
const {capturePaypalOrder}=require('./paypal.ts');
const expected={orderId:'ORDER123456789',reference:'CB-TEST',total:75};
const completed=()=>({id:expected.orderId,status:'COMPLETED',purchase_units:[{reference_id:expected.reference,payments:{captures:[{id:'CAPTURE1',status:'COMPLETED',amount:{value:'75.00',currency_code:'USD'}}]}}]});
test('Only a completed matching capture is accepted',()=>{
 assert.equal(verifyCompletedPayment(completed(),expected),true);
 for(const status of ['PENDING','DECLINED','REFUNDED','PARTIALLY_REFUNDED']){const order=completed();order.purchase_units[0].payments.captures[0].status=status;assert.equal(verifyCompletedPayment(order,expected),false);}
 for(const mismatch of [{total:150},{reference:'OTHER'},{orderId:'OTHER'}])assert.equal(verifyCompletedPayment(completed(),{...expected,...mismatch}),false);
 const currency=completed();currency.purchase_units[0].payments.captures[0].amount.currency_code='EUR';assert.equal(verifyCompletedPayment(currency,expected),false);
 const absent=completed();absent.purchase_units[0].payments.captures=[];assert.equal(verifyCompletedPayment(absent,expected),false);
});
test('Duplicate capture and lost responses recover through a read; request id stays stable',async()=>{
 const original=global.fetch;process.env.PAYPAL_CLIENT_ID='test';process.env.PAYPAL_CLIENT_SECRET='test';
 try {
  for(const scenario of ['duplicate','timeout','pending']){
   const calls=[];
   global.fetch=async(url,options={})=>{
    calls.push({url,options});
    if(url.endsWith('/token'))return Response.json({access_token:'test'});
    if(url.endsWith('/capture')){assert.equal(options.headers['PayPal-Request-Id'],'capture-'+expected.orderId);if(scenario==='timeout')throw Error('Connection lost');return Response.json({name:'UNPROCESSABLE_ENTITY'},{status:422});}
    return Response.json(scenario==='pending'?{...completed(),status:'APPROVED'}:completed());
   };
   if(scenario==='pending')await assert.rejects(()=>capturePaypalOrder(expected.orderId));
   else assert.equal((await capturePaypalOrder(expected.orderId)).status,'COMPLETED');
   assert.equal(calls.filter(c=>c.url.endsWith('/capture')).length,1);
   assert.equal(calls.filter(c=>c.url.endsWith('/'+expected.orderId)).length,1);
  }
 } finally {global.fetch=original;delete process.env.PAYPAL_CLIENT_ID;delete process.env.PAYPAL_CLIENT_SECRET;}
});
