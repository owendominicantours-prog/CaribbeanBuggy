import { NextRequest, NextResponse } from 'next/server';
import { isTrackedSeoPath } from '../../../lib/seoInventory';
import { recordPageVisit } from '../../../lib/visitStore';

const botPattern = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|headless|lighthouse|pagespeed/i;

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  if (!userAgent || botPattern.test(userAgent)) return NextResponse.json({ ok: true, counted: false });
  const body = (await request.json().catch(() => null)) as { path?: unknown; visitorId?: unknown } | null;
  const pathname = typeof body?.path === 'string' ? body.path.split('?')[0] : '';
  const visitorId = typeof body?.visitorId === 'string' ? body.visitorId.slice(0, 100) : '';
  if (!visitorId || !isTrackedSeoPath(pathname)) return NextResponse.json({ error: 'Invalid visit' }, { status: 400 });
  try {
    const result = await recordPageVisit(pathname, visitorId);
    return NextResponse.json({ ok: true, counted: true, visit: result.countedVisit, persistent: result.persistent });
  } catch (error) {
    console.error('visit_store_error', error);
    return NextResponse.json({ error: 'Visit storage unavailable' }, { status: 503 });
  }
}

