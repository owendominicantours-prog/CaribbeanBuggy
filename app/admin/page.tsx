import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_COOKIE_NAME, verifyAdminToken } from '../../lib/adminAuth';
import { listAdminRecords } from '../../lib/adminStore';
import AdminPanelClient from './AdminPanelClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();

  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin/login');
  }

  const records = await listAdminRecords();

  return <AdminPanelClient initialRecords={records} />;
}
