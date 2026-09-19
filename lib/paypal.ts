const paypalBase =
  process.env.PAYPAL_ENV === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${paypalBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`PayPal token request failed with ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error('PayPal token response did not include an access token');
  }

  return data.access_token;
}

export async function createPaypalOrder({
  reference,
  description,
  amount,
}: {
  reference: string;
  description: string;
  amount: number;
}) {
  const token = await getAccessToken();
  const response = await fetch(`${paypalBase}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: reference,
          custom_id: reference,
          description: description.slice(0, 127),
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'Caribbean Buggy',
        landing_page: 'BILLING',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal order request failed with ${response.status}: ${errorText}`);
  }

  return response.json() as Promise<{ id: string; status: string }>;
}

export async function capturePaypalOrder(orderId: string) {
  const token = await getAccessToken();
  let response: Response;
  try { response = await fetch(`${paypalBase}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `capture-${orderId}`,
    },
    cache: 'no-store',
  }); } catch {
    // The request may have succeeded at PayPal before the connection failed.
    const existing = await getPaypalOrder(orderId);
    if (existing.status === 'COMPLETED') return existing;
    throw new Error('PayPal capture could not be verified');
  }

  if (!response.ok) {
    const existing = await getPaypalOrder(orderId);
    if (existing.status === 'COMPLETED') return existing;
    throw new Error(`PayPal capture not completed (${response.status})`);
  }

  return response.json();
}

export async function getPaypalOrder(orderId: string) {
  const token = await getAccessToken();
  const response = await fetch(`${paypalBase}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`PayPal verification HTTP ${response.status}`);
  return response.json();
}
