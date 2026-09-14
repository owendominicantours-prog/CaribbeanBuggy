import { NextResponse } from 'next/server';

import { listAdminRecords, markAdminRecordCommandCenterSynced } from '../../../../lib/adminStore';
import { notifyPaidBookingToCommandCenter } from '../../../../lib/commandCenter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`);
}

export async function GET(request: Request) {
  if (!authorized(request)) return new NextResponse('Not found', { status: 404 });

  const records = (await listAdminRecords()).filter(
    (record) => record.type === 'booking' &&
      (record.status === 'paid' || record.status === 'completed') &&
      !record.commandCenterSyncedAt,
  );
  let synced = 0;
  let failed = 0;

  for (const record of records) {
    const result = await notifyPaidBookingToCommandCenter(record);
    if (result.status === 'sent') {
      await markAdminRecordCommandCenterSynced(record.reference || record.id);
      synced += 1;
    } else {
      failed += 1;
    }
  }

  return NextResponse.json({ scanned: records.length, synced, failed });
}
