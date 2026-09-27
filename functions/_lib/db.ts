import type { Env } from './env';

// Tables are created on first use, so a fresh D1 database needs no manual
// migration. Keep changes additive (new tables / new nullable columns).
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    full_name TEXT NOT NULL,
    display_name TEXT,
    anonymous INTEGER NOT NULL DEFAULT 0,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT NOT NULL,
    region TEXT,
    city TEXT,
    age_range TEXT NOT NULL,
    contribution_type TEXT NOT NULL,
    campaign TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    language TEXT,
    link_url TEXT,
    file_key TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size INTEGER,
    social_handle TEXT,
    may_tag INTEGER NOT NULL DEFAULT 0,
    consent INTEGER NOT NULL DEFAULT 0,
    own_work INTEGER NOT NULL DEFAULT 0,
    guardian_name TEXT,
    guardian_contact TEXT,
    guardian_consent INTEGER NOT NULL DEFAULT 0,
    guardian_status TEXT NOT NULL DEFAULT 'not_required',
    safety_note TEXT,
    moderator_notes TEXT,
    published_url TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS submissions_status ON submissions (status, created_at)`,
  `CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    organisation TEXT,
    country TEXT,
    interests TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    country TEXT,
    source TEXT,
    status TEXT NOT NULL DEFAULT 'active'
  )`,
  `CREATE TABLE IF NOT EXISTS event_counts (
    day TEXT NOT NULL,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, name, path)
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    at TEXT NOT NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    detail TEXT
  )`,
];

let ready: Promise<void> | null = null;

export function ensureSchema(env: Env): Promise<void> {
  ready ??= env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s))).then(() => undefined).catch((e) => {
    ready = null;
    throw e;
  });
  return ready;
}

export const now = () => new Date().toISOString();

/** Short, unguessable, human-readable reference, e.g. "PAG-7K3M-Q9TD". */
export function newId(prefix = 'PAG'): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const chars = [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
  return `${prefix}-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

export async function audit(env: Env, actor: string, action: string, target: string, detail?: string) {
  await env.DB.prepare('INSERT INTO audit_log (at, actor, action, target, detail) VALUES (?, ?, ?, ?, ?)')
    .bind(now(), actor, action, target, detail ?? null)
    .run();
}
