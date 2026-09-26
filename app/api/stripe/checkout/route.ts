import {start} from "../../../../lib/stripeAdapter";
export async function POST(r:Request){try {const url=await start(await r.json());return Response.json({url});}catch{return Response.json({error:"Could not open secure payment. Please check your booking and try again."},{status:422});}}
