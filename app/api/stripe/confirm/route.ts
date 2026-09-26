import {confirm} from "../../../../lib/stripeAdapter";
export async function POST(r:Request){try{const {sessionId}=await r.json();return Response.json(await confirm(sessionId));}catch{return Response.json({error:"Payment confirmation pending. Do not pay again. Please try checking again."},{status:409});}}
