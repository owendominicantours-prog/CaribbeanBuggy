import Stripe from "stripe";
import { Pool } from "pg";
export type Order = { id:string; amount:number; email:string; title:string; details?:Record<string,string|number|undefined>; payload:unknown };
export function paymentMetadata(site:string,order:Order){
 const metadata:Record<string,string>={site,bookingId:order.id,booking_reference:order.id,product_name:order.title.slice(0,450),amount_due:order.amount.toFixed(2),currency:"USD",payment_mode:"full"};
 const allowed=["product_id","activity_date","pickup_time","hotel","pickup_zone","travelers","vehicles","vehicle_summary","customer_name","customer_email","customer_phone","language","source_url"];
 for(const key of allowed){const value=order.details?.[key];if(value===undefined||value===null)continue;let text=String(value).trim();if(key==="source_url"){try{const u=new URL(text);if(!["https:","http:"].includes(u.protocol))continue;text=u.origin+u.pathname;}catch{continue;}}if(text)metadata[key]=text.slice(0,450);}
 return metadata;
}
let pool:Pool;
const db=()=>pool ||= new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:10000});
export const stripe=()=>new Stripe(process.env.STRIPE_SECRET_KEY || "missing");
export async function ready(){if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET||!process.env.DATABASE_URL)throw Error("Stripe is not configured");await db().query(`CREATE TABLE IF NOT EXISTS ecosystem_stripe_checkouts (site text NOT NULL,booking_id text NOT NULL,session_id text UNIQUE,payload jsonb NOT NULL,amount integer NOT NULL,attempt integer NOT NULL DEFAULT 0,fulfilled boolean NOT NULL DEFAULT false,PRIMARY KEY(site,booking_id))`);}
export async function checkout(site:string,origin:string,order:Order){
 await ready();const cents=Math.round(order.amount*100);if(!Number.isSafeInteger(cents)||cents<50)throw Error("Invalid amount");
 const c=await db().connect();try{await c.query("BEGIN");await c.query("SELECT pg_advisory_xact_lock(hashtext($1))",[site+order.id]);
 await c.query(`INSERT INTO ecosystem_stripe_checkouts(site,booking_id,payload,amount) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING`,[site,order.id,JSON.stringify(order.payload),cents]);
 const row=(await c.query("SELECT * FROM ecosystem_stripe_checkouts WHERE site=$1 AND booking_id=$2 FOR UPDATE",[site,order.id])).rows[0];if(row.amount!==cents)throw Error("Booking amount changed");
 let attempt=row.attempt;
 if(row.session_id){const old=await stripe().checkout.sessions.retrieve(row.session_id);if(old.status==="open"&&old.url){await c.query("COMMIT");return old.url;}if(old.status!=="expired")throw Error("Payment already submitted. Check your confirmation.");attempt++;}
 const metadata=paymentMetadata(site,order);
 const description=[order.title,metadata.activity_date,metadata.pickup_time,metadata.hotel,metadata.travelers ? metadata.travelers+" travelers" : "",order.id].filter(Boolean).join(" | ").slice(0,900);
 const session=await stripe().checkout.sessions.create({mode:"payment",payment_method_types:["card"],customer_email:order.email,client_reference_id:order.id,metadata,payment_intent_data:{metadata,description},line_items:[{quantity:1,price_data:{currency:"usd",unit_amount:cents,product_data:{name:order.title}}}],success_url:origin+"/stripe-confirmation?session_id={CHECKOUT_SESSION_ID}",cancel_url:origin+"/stripe-confirmation?cancelled=1"},{idempotencyKey:site+":"+order.id+":"+attempt});
 await c.query("UPDATE ecosystem_stripe_checkouts SET session_id=$3,attempt=$4 WHERE site=$1 AND booking_id=$2",[site,order.id,session.id,attempt]);await c.query("COMMIT");return session.url;
 }catch(e){await c.query("ROLLBACK");throw e;}finally{c.release();}
}
export async function fulfill(site:string,id:string,deliver:(payload:any,session:Stripe.Checkout.Session)=>Promise<void>){
 await ready();if(!/^cs_(live|test)_[a-zA-Z0-9]+$/.test(id))throw Error("Invalid session");const s=await stripe().checkout.sessions.retrieve(id);
 if(s.metadata?.site!==site||s.payment_status!=="paid"||s.currency!=="usd")throw Error("Payment not confirmed");
 const c=await db().connect();try{await c.query("BEGIN");await c.query("SELECT pg_advisory_xact_lock(hashtext($1))",[site+s.metadata.bookingId]);const row=(await c.query("SELECT * FROM ecosystem_stripe_checkouts WHERE site=$1 AND session_id=$2 FOR UPDATE",[site,id])).rows[0];
 if(!row||row.booking_id!==s.metadata.bookingId||row.amount!==s.amount_total)throw Error("Payment mismatch");
 if(!row.fulfilled){await deliver(row.payload,s);await c.query("UPDATE ecosystem_stripe_checkouts SET fulfilled=true WHERE site=$1 AND session_id=$2",[site,id]);}
 await c.query("COMMIT");return {paid:true,reference:row.booking_id,amount:row.amount/100,currency:"USD",transactionId:s.id};
 }catch(e){await c.query("ROLLBACK");throw e;}finally{c.release();}
}
