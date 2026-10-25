export const dynamic='force-dynamic';
export async function GET(){return Response.json({status:'ok',site:'caribbean-buggy',paymentsConfigured:Boolean(process.env.STRIPE_SECRET_KEY),storageConfigured:Boolean(process.env.DATABASE_URL)});}
