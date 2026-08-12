import fs from 'fs/promises';
import path from 'path';

export type AdminRecordStatus =
  | 'pending_payment'
  | 'paid'
  | 'inquiry'
  | 'contacted'
  | 'completed'
  | 'cancelled'
  | 'capture_failed';

export type AdminRecord = {
  id: string;
  reference?: string;
  orderId?: string;
  type: 'booking' | 'inquiry';
  source: string;
  status: AdminRecordStatus;
  createdAt: string;
  updatedAt: string;
  productId?: string;
  productName?: string;
  customer: {
    name?: string;
    email?: string;
    phone?: string;
  };
  booking: {
    date?: string;
    pickupWindow?: string;
    hotel?: string;
    pickupZone?: string;
    passengers?: number;
    language?: string;
    photos?: boolean;
    privatePickup?: boolean;
    paymentPreference?: string;
    total?: number;
    vehicles?: number;
  };
  notes?: string[];
  raw?: unknown;
};

const storePath =
  process.env.CARIBBEAN_ADMIN_STORE_PATH ??
  (process.env.VERCEL
    ? '/tmp/caribbean-buggy-admin.json'
    : path.join(process.cwd(), '.data', 'caribbean-buggy-admin.json'));

function now() {
  return new Date().toISOString();
}

export function createAdminRecordId(prefix = 'CB') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function readStore() {
  try {
    const raw = await fs.readFile(storePath, 'utf8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as AdminRecord[]) : [];
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === 'ENOENT') {
      return [];
    }
    console.error('admin_store_read_error', error);
    return [];
  }
}

async function writeStore(records: AdminRecord[]) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(records.slice(0, 500), null, 2));
}

export async function listAdminRecords() {
  const records = await readStore();
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function upsertAdminRecord(record: AdminRecord) {
  const records = await readStore();
  const index = records.findIndex(
    (item) =>
      item.id === record.id ||
      (!!record.reference && item.reference === record.reference) ||
      (!!record.orderId && item.orderId === record.orderId),
  );

  if (index >= 0) {
    records[index] = {
      ...records[index],
      ...record,
      customer: { ...records[index].customer, ...record.customer },
      booking: { ...records[index].booking, ...record.booking },
      notes: [...(records[index].notes ?? []), ...(record.notes ?? [])],
      updatedAt: now(),
    };
  } else {
    records.unshift({
      ...record,
      createdAt: record.createdAt || now(),
      updatedAt: record.updatedAt || now(),
    });
  }

  await writeStore(records);
  return index >= 0 ? records[index] : records[0];
}

export async function updateAdminRecordStatus(id: string, status: AdminRecordStatus, note?: string) {
  const records = await readStore();
  const index = records.findIndex((record) => record.id === id || record.reference === id || record.orderId === id);

  if (index < 0) return null;

  records[index] = {
    ...records[index],
    status,
    notes: note ? [...(records[index].notes ?? []), `${new Date().toLocaleString('es-DO')}: ${note}`] : records[index].notes,
    updatedAt: now(),
  };

  await writeStore(records);
  return records[index];
}
