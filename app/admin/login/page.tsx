import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_COOKIE_NAME, verifyAdminToken } from '../../../lib/adminAuth';
import AdminLoginForm from './AdminLoginForm';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const cookieStore = await cookies();

  if (verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect('/admin');
  }

  return <AdminLoginForm />;
}
