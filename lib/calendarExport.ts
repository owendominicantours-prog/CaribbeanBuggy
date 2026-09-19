import { createHash, timingSafeEqual } from 'node:crypto';
import { Pool } from 'pg';
export function calendarExportAuthorized(value: string | null) {
 const expected=process.env.ECOSYSTEM_CALENDAR_SYNC_TOKEN;
 if(!expected || !value) return false;
 return timingSafeEqual(createHash('sha256').update(value.replace(/^Bearer /,'')).digest(),createHash('sha256').update(expected).digest());
}

let pool:Pool|undefined;
export async function calendarExport(offset: number) {
 if(!process.env.DATABASE_URL)throw new Error('Storage unavailable');
 pool??=new Pool({connectionString:process.env.DATABASE_URL,max:2,connectionTimeoutMillis:8000,ssl:process.env.DATABASE_SSL==='disable'?false:process.env.DATABASE_SSL==='require'||process.env.DATABASE_URL.includes('sslmode=require')?{rejectUnauthorized:false}:undefined});
 const result=await pool.query('SELECT record FROM caribbean_buggy_admin_records ORDER BY id LIMIT 251 OFFSET $1',[offset]);
 const rows=result.rows.slice(0,250).map(r=>r.record);
 return {records:rows,nextOffset:result.rows.length>250?offset+250:null};
}
