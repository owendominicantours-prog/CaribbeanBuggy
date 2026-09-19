import { calendarExport, calendarExportAuthorized } from '../../../lib/calendarExport';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(request:Request){
 if(!calendarExportAuthorized(request.headers.get('authorization')))return new Response('Unauthorized',{status:401});
 const offset=Number(new URL(request.url).searchParams.get('offset')||0);
 if(!Number.isInteger(offset)||offset<0||offset>1000000)return new Response('Invalid offset',{status:400});
 try{return Response.json(await calendarExport(offset),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Booking export unavailable'},{status:503});}
}
