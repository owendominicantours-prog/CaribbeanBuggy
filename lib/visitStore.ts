import { createHash } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export type PageVisitMetric = { views: number; visits: number; today: number; lastVisit?: string };
export type VisitSnapshot = { metrics: Record<string, PageVisitMetric>; persistent: boolean; provider: 'redis' | 'local'; updatedAt: string };

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const localPath = process.env.CARIBBEAN_VISIT_STORE_PATH ?? (process.env.VERCEL ? '/tmp/caribbean-buggy-visits.json' : path.join(process.cwd(), '.data', 'caribbean-buggy-visits.json'));
const keyPrefix = 'caribbean-buggy:visits';

function dayKey() { return new Date().toISOString().slice(0, 10); }
function now() { return new Date().toISOString(); }
function digest(value: string) { return createHash('sha256').update(value).digest('hex').slice(0, 32); }

async function redis(command: Array<string | number>) {
  if (!redisUrl || !redisToken) throw new Error('Redis is not configured');
  const response = await fetch(redisUrl, { method: 'POST', headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(command), cache: 'no-store' });
  if (!response.ok) throw new Error(`Redis error ${response.status}`);
  return (await response.json()) as { result: unknown };
}

async function redisPipeline(commands: Array<Array<string | number>>) {
  if (!redisUrl || !redisToken) throw new Error('Redis is not configured');
  const response = await fetch(`${redisUrl}/pipeline`, { method: 'POST', headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(commands), cache: 'no-store' });
  if (!response.ok) throw new Error(`Redis pipeline error ${response.status}`);
  return (await response.json()) as Array<{ result: unknown }>;
}

type LocalData = { day: string; metrics: Record<string, PageVisitMetric>; sessions: Record<string, number> };
async function readLocal(): Promise<LocalData> {
  try {
    const data = JSON.parse(await fs.readFile(localPath, 'utf8')) as LocalData;
    if (data.day !== dayKey()) {
      Object.values(data.metrics).forEach((metric) => { metric.today = 0; });
      data.day = dayKey();
    }
    return data;
  } catch { return { day: dayKey(), metrics: {}, sessions: {} }; }
}
async function writeLocal(data: LocalData) {
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  await fs.writeFile(localPath, JSON.stringify(data));
}

export async function recordPageVisit(pathname: string, visitorId: string) {
  const timestamp = now();
  const day = dayKey();
  const sessionId = digest(`${visitorId}:${pathname}`);
  if (redisUrl && redisToken) {
    const session = await redis(['SET', `${keyPrefix}:session:${sessionId}`, '1', 'EX', 1800, 'NX']);
    const isVisit = session.result === 'OK';
    const commands: Array<Array<string | number>> = [
      ['HINCRBY', `${keyPrefix}:views`, pathname, 1],
      ['HINCRBY', `${keyPrefix}:today:${day}`, pathname, 1],
      ['HSET', `${keyPrefix}:last`, pathname, timestamp],
      ['EXPIRE', `${keyPrefix}:today:${day}`, 2592000],
    ];
    if (isVisit) commands.push(['HINCRBY', `${keyPrefix}:sessions`, pathname, 1]);
    await redisPipeline(commands);
    return { countedVisit: isVisit, persistent: true };
  }
  const data = await readLocal();
  const current = data.metrics[pathname] ?? { views: 0, visits: 0, today: 0 };
  const sessionExpiry = data.sessions[sessionId] ?? 0;
  const isVisit = sessionExpiry < Date.now();
  data.metrics[pathname] = { views: current.views + 1, visits: current.visits + Number(isVisit), today: current.today + 1, lastVisit: timestamp };
  data.sessions[sessionId] = Date.now() + 1800000;
  for (const [key, expiry] of Object.entries(data.sessions)) if (expiry < Date.now()) delete data.sessions[key];
  await writeLocal(data);
  return { countedVisit: isVisit, persistent: !process.env.VERCEL };
}

function pairs(value: unknown): Record<string, string> {
  if (!Array.isArray(value)) return {};
  const output: Record<string, string> = {};
  for (let i = 0; i < value.length; i += 2) output[String(value[i])] = String(value[i + 1] ?? '');
  return output;
}

export async function getVisitSnapshot(): Promise<VisitSnapshot> {
  if (redisUrl && redisToken) {
    const results = await redisPipeline([
      ['HGETALL', `${keyPrefix}:views`], ['HGETALL', `${keyPrefix}:sessions`], ['HGETALL', `${keyPrefix}:today:${dayKey()}`], ['HGETALL', `${keyPrefix}:last`],
    ]);
    const views = pairs(results[0]?.result); const visits = pairs(results[1]?.result); const today = pairs(results[2]?.result); const last = pairs(results[3]?.result);
    const paths = new Set([...Object.keys(views), ...Object.keys(visits), ...Object.keys(today)]);
    const metrics: Record<string, PageVisitMetric> = {};
    paths.forEach((pathname) => { metrics[pathname] = { views: Number(views[pathname] || 0), visits: Number(visits[pathname] || 0), today: Number(today[pathname] || 0), lastVisit: last[pathname] }; });
    return { metrics, persistent: true, provider: 'redis', updatedAt: now() };
  }
  const data = await readLocal();
  return { metrics: data.metrics, persistent: !process.env.VERCEL, provider: 'local', updatedAt: now() };
}
