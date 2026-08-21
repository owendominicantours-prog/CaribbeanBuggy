import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_COOKIE_NAME, verifyAdminToken } from '../../lib/adminAuth';
import { hasPersistentAdminStore, listAdminRecords } from '../../lib/adminStore';
import { seoInventory } from '../../lib/seoInventory';
import { getVisitSnapshot } from '../../lib/visitStore';
import AdminPanelClient from './AdminPanelClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();

  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login');
  }

  const records = await listAdminRecords();
  const visits = await getVisitSnapshot();

  return <AdminPanelClient initialRecords={records} initialSeoPages={seoInventory} initialVisits={visits} recordsPersistent={hasPersistentAdminStore()} />;
}
