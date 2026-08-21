import fs from 'fs/promises';
import path from 'path';
import { Pool, type PoolClient } from 'pg';

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
  customer: { name?: string; email?: string; phone?: string };
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

const databaseUrl = process.env.DATABASE_URL;
const storePath =
  process.env.CARIBBEAN_ADMIN_STORE_PATH ??
  (process.env.VERCEL
    ? '/tmp/caribbean-buggy-admin.json'
    : path.join(process.cwd(), '.data', 'caribbean-buggy-admin.json'));

type DatabaseGlobal = typeof globalThis & {
  __caribbeanBuggyAdminPool?: Pool;
  __caribbeanBuggyAdminReady?: Promise<void>;
};

const databaseGlobal = globalThis as DatabaseGlobal;

function getPool() {
  if (!databaseUrl) return null;

  if (!databaseGlobal.__caribbeanBuggyAdminPool) {
    databaseGlobal.__caribbeanBuggyAdminPool = new Pool({
      connectionString: databaseUrl,
      max: 4,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 8_000,
      ssl: process.env.DATABASE_SSL === 'require' ? { rejectUnauthorized: false } : undefined,
    });
  }

  return databaseGlobal.__caribbeanBuggyAdminPool;
}

async function ensureDatabase() {
  const pool = getPool();
  if (!pool) return;

  if (!databaseGlobal.__caribbeanBuggyAdminReady) {
    databaseGlobal.__caribbeanBuggyAdminReady = pool
      .query(`
        CREATE TABLE IF NOT EXISTS caribbean_buggy_admin_records (
          id TEXT PRIMARY KEY,
          reference TEXT,
          order_id TEXT,
          record JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS caribbean_buggy_records_reference_idx
          ON caribbean_buggy_admin_records (reference) WHERE reference IS NOT NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS caribbean_buggy_records_order_idx
          ON caribbean_buggy_admin_records (order_id) WHERE order_id IS NOT NULL;
      `)
      .then(() => undefined)
      .catch((error) => {
        databaseGlobal.__caribbeanBuggyAdminReady = undefined;
        throw error;
      });
  }

  await databaseGlobal.__caribbeanBuggyAdminReady;
}

function now() {
  return new Date().toISOString();
}

export function createAdminRecordId(prefix = 'CB') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function hasPersistentAdminStore() {
  return Boolean(databaseUrl);
}

function mergeRecord(previous: AdminRecord | undefined, record: AdminRecord): AdminRecord {
  if (!previous) {
    return {
      ...record,
      createdAt: record.createdAt || now(),
      updatedAt: record.updatedAt || now(),
    };
  }

  return {
    ...previous,
    ...record,
    id: previous.id,
    customer: { ...previous.customer, ...record.customer },
    booking: { ...previous.booking, ...record.booking },
    notes: [...(previous.notes ?? []), ...(record.notes ?? [])],
    createdAt: previous.createdAt,
    updatedAt: now(),
  };
}

async function findDatabaseRecord(client: PoolClient, record: AdminRecord) {
  const result = await client.query<{ record: AdminRecord }>(
    `SELECT record
       FROM caribbean_buggy_admin_records
      WHERE id = $1
         OR ($2::text IS NOT NULL AND reference = $2)
         OR ($3::text IS NOT NULL AND order_id = $3)
      LIMIT 1
      FOR UPDATE`,
    [record.id, record.reference ?? null, record.orderId ?? null],
  );
  return result.rows[0]?.record;
}

async function readLocalStore() {
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

async function writeLocalStore(records: AdminRecord[]) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(records.slice(0, 500), null, 2));
}

export async function listAdminRecords() {
  const pool = getPool();
  if (pool) {
    await ensureDatabase();
    const result = await pool.query<{ record: AdminRecord }>(
      'SELECT record FROM caribbean_buggy_admin_records ORDER BY created_at DESC LIMIT 2000',
    );
    return result.rows.map((row) => row.record);
  }

  const records = await readLocalStore();
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function upsertAdminRecord(record: AdminRecord) {
  const pool = getPool();
  if (pool) {
    await ensureDatabase();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const previous = await findDatabaseRecord(client, record);
      const merged = mergeRecord(previous, record);
      await client.query(
        `INSERT INTO caribbean_buggy_admin_records
          (id, reference, order_id, record, created_at, updated_at)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6)
         ON CONFLICT (id) DO UPDATE SET
           reference = EXCLUDED.reference,
           order_id = EXCLUDED.order_id,
           record = EXCLUDED.record,
           updated_at = EXCLUDED.updated_at`,
        [merged.id, merged.reference ?? null, merged.orderId ?? null, JSON.stringify(merged), merged.createdAt, merged.updatedAt],
      );
      await client.query('COMMIT');
      return merged;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  const records = await readLocalStore();
  const index = records.findIndex(
    (item) =>
      item.id === record.id ||
      (!!record.reference && item.reference === record.reference) ||
      (!!record.orderId && item.orderId === record.orderId),
  );
  const merged = mergeRecord(index >= 0 ? records[index] : undefined, record);
  if (index >= 0) records[index] = merged;
  else records.unshift(merged);
  await writeLocalStore(records);
  return merged;
}

export async function updateAdminRecordStatus(id: string, status: AdminRecordStatus, note?: string) {
  const pool = getPool();
  if (pool) {
    await ensureDatabase();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const result = await client.query<{ record: AdminRecord }>(
        `SELECT record
           FROM caribbean_buggy_admin_records
          WHERE id = $1 OR reference = $1 OR order_id = $1
          LIMIT 1
          FOR UPDATE`,
        [id],
      );
      const previous = result.rows[0]?.record;
      if (!previous) {
        await client.query('ROLLBACK');
        return null;
      }

      const updated: AdminRecord = {
        ...previous,
        status,
        notes: note
          ? [...(previous.notes ?? []), `${new Date().toLocaleString('es-DO')}: ${note}`]
          : previous.notes,
        updatedAt: now(),
      };
      await client.query(
        'UPDATE caribbean_buggy_admin_records SET record = $2::jsonb, updated_at = $3 WHERE id = $1',
        [previous.id, JSON.stringify(updated), updated.updatedAt],
      );
      await client.query('COMMIT');
      return updated;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  const records = await readLocalStore();
  const index = records.findIndex((record) => record.id === id || record.reference === id || record.orderId === id);
  if (index < 0) return null;
  records[index] = {
    ...records[index],
    status,
    notes: note
      ? [...(records[index].notes ?? []), `${new Date().toLocaleString('es-DO')}: ${note}`]
      : records[index].notes,
    updatedAt: now(),
  };
  await writeLocalStore(records);
  return records[index];
}
