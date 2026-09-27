import { Pool } from "pg";

let pool: Pool;
const db = () => pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 6, connectionTimeoutMillis: 10000 });
let ready: Promise<unknown> | undefined;
export async function deliverySchema() {
  await (ready ??= db().query(`CREATE TABLE IF NOT EXISTS ecosystem_payment_deliveries (
    site text NOT NULL, booking_id text NOT NULL, channel text NOT NULL,
    status text NOT NULL DEFAULT 'pending', attempts integer NOT NULL DEFAULT 0,
    last_error text, updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(site,booking_id,channel))`).catch(e => { ready = undefined; throw e; }));
}

// A separate durable record for each destination. A retry never repeats completed destinations.
export async function deliverOnce(site: string, id: string, channel: string, send: () => Promise<unknown>) {
  await deliverySchema();
  const c = await db().connect();
  try {
    await c.query("BEGIN");
    await c.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`delivery:${site}:${id}:${channel}`]);
    await c.query("INSERT INTO ecosystem_payment_deliveries(site,booking_id,channel) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [site,id,channel]);
    const record = (await c.query("SELECT status FROM ecosystem_payment_deliveries WHERE site=$1 AND booking_id=$2 AND channel=$3",[site,id,channel])).rows[0];
    if (record.status === "sent") { await c.query("COMMIT"); return true; }
    try {
      await send();
      await c.query("UPDATE ecosystem_payment_deliveries SET status='sent',attempts=attempts+1,last_error=NULL,updated_at=now() WHERE site=$1 AND booking_id=$2 AND channel=$3",[site,id,channel]);
      await c.query("COMMIT");
      return true;
    } catch (error) {
      // Store a bounded technical code, never SMTP credentials or message bodies.
      const code = String((error as {code?:string})?.code || (error as Error)?.name || "DeliveryError").replace(/[^a-zA-Z0-9_-]/g, "").slice(0,60);
      await c.query("UPDATE ecosystem_payment_deliveries SET status='failed',attempts=attempts+1,last_error=$4,updated_at=now() WHERE site=$1 AND booking_id=$2 AND channel=$3",[site,id,channel,code]);
      await c.query("COMMIT");
      console.error("payment_delivery_failed", {site,id,channel,code});
      return false;
    }
  } catch (e) { await c.query("ROLLBACK"); throw e; }
  finally { c.release(); }
}
