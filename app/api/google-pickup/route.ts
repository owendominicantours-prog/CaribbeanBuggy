import {googlePickupLocations} from '../../../lib/googlePickup';
export const runtime='nodejs';
export async function GET(request:Request){
 const headers={'Cache-Control':'private, no-store'};
 try{const u=new URL(request.url);return Response.json({source:'google',locations:await googlePickupLocations(u.searchParams.get('q')||'',u.searchParams.get('region')||'',u.searchParams.get('resolve')==='1',u.searchParams.get('locale')||'es'),confirmsPickup:false},{headers});}
 catch{return Response.json({locations:[],error:'Search and select an accommodation in the departure area.'},{status:422,headers});}
}
