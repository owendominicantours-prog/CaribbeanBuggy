export const runtime='nodejs';
export async function POST(){return Response.json({error:'This payment method is no longer available. Please book using secure Stripe checkout.',code:'STRIPE_ONLY'},{status:410});}
