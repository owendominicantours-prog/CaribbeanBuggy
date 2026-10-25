import {deliverOnce} from "./paymentDelivery";
import {checkout,fulfill} from "./stripeCheckout";
import {calculateBookingTotal,getProduct,createBookingReference} from "./buggyProducts";
import {upsertAdminRecord,getAdminRecord,markAdminRecordCommandCenterSynced} from "./adminStore";
import {sendPaidBookingEmails} from "./bookingEmails";
import {notifyPaidBookingToCommandCenter} from "./commandCenter";
import {createHash} from "crypto";
export const SITE="caribbean-buggy";
export async function start(p:any){const product=getProduct(p.productId);if(!product||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||(new Date(p.date+"T23:59:59Z").getTime()<Date.now()||new Date(p.date+"T23:59:59Z").toISOString().slice(0,10)!==p.date)||!p.name||!p.hotel||!p.phone||!/^[^\s@,;<>"\\]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(p.email)||!Number.isInteger(Number(p.passengers))||Number(p.passengers)<1||Number(p.passengers)>20)throw Error("Invalid booking details");
 if(p.fleetConfirmed!==true || !p.fleet || typeof p.fleet!=='object' || Array.isArray(p.fleet))throw Error("Choose and confirm your buggy quantities.");
 const pricing=calculateBookingTotal({product,passengers:Number(p.passengers),pickupZone:String(p.pickupZone||""),photos:false,privatePickup:false,fleet:p.fleet});
 if(!pricing.validFleet)throw Error("Add enough buggies for every passenger.");
 if(!/^[a-zA-Z0-9-]{16,80}$/.test(p.requestId||""))throw Error("Invalid checkout request");
 const id="CB-"+createHash("sha256").update(p.requestId+JSON.stringify([p.productId,p.email,p.date,p.passengers,p.hotel,p.pickupZone,p.pickupWindow,p.name,p.phone,p.language,p.fleet])).digest("hex").slice(0,24);
 const booking={...p,photos:false,privatePickup:false,paymentPreference:"stripe",passengers:pricing.passengers};
 const previous=await getAdminRecord(id);if(previous&&previous.status!=="pending_payment")throw Error("Booking already processed");
 await upsertAdminRecord({id,reference:id,type:"booking",source:"stripe_checkout",status:"pending_payment",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),productId:product.id,productName:product.title,customer:{name:p.name,email:p.email,phone:p.phone},booking:{...booking,total:pricing.total,vehicles:pricing.vehicles,fleetSummary:pricing.fleetSummary}});
 return checkout(SITE,"https://www.caribbeanboggie.com",{id,amount:pricing.total,email:p.email,title:pricing.fleetSummary,details:{locale:p.locale==='en'?'en':'es',product_id:product.id,activity_date:booking.date,pickup_time:booking.pickupWindow,hotel:booking.hotel,pickup_zone:booking.pickupZone,travelers:pricing.passengers,vehicles:pricing.vehicles,fleet_summary:pricing.fleetSummary,customer_name:booking.name,customer_email:booking.email,customer_phone:booking.phone,language:booking.language,source_url:"https://www.caribbeanboggie.com"},payload:{id,booking,pricing,productId:product.id,productTitle:pricing.fleetSummary}});
}
export const confirm=(id:string)=>fulfill(SITE,id,async(p,s)=>{
const record=await getAdminRecord(p.id);if(!record||record.status==="cancelled")throw Error("Booking unavailable");
await upsertAdminRecord({...record,orderId:s.id,status:"paid",updatedAt:new Date().toISOString()});
const current=await getAdminRecord(p.id);if(!current)throw Error("Booking persistence failed");
const product=getProduct(p.productId);if(!product)throw Error("Product missing");
const result=await Promise.all([
 deliverOnce(SITE,p.id,"operations",async()=>{if(!current.commandCenterSyncedAt){const delivery=await notifyPaidBookingToCommandCenter(current);if(delivery.status!=="sent")throw Error("Operations notification pending");await markAdminRecordCommandCenterSynced(current.id);}}),
 sendPaidBookingEmails({booking:p.booking,product,pricing:p.pricing,orderId:s.id,reference:p.id})
]);return result.every(Boolean);
});

