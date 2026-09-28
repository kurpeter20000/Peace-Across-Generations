/// <reference types="@cloudflare/workers-types" />

/**
 * Bindings configured on the Cloudflare Pages project
 * (Settings → Bindings / Variables and Secrets). See README → "Forms and admin".
 */
export interface Env {
  /** D1 database: submissions, enquiries, subscribers, counts. */
  DB: D1Database;
  /** Private R2 bucket for uploaded files. Never public. */
  UPLOADS?: R2Bucket;
  /** Cloudflare Access team domain, e.g. "peace-agen" for peace-agen.cloudflareaccess.com. */
  ACCESS_TEAM_DOMAIN?: string;
  /** Cloudflare Access application audience (AUD) tag for /admin. */
  ACCESS_AUD?: string;
  /** Secret used to hash IP addresses for rate limiting (never store raw IPs). */
  HASH_SALT?: string;
  /**
   * Fine-grained GitHub token for the content editor: this repository only,
   * Contents read & write. Secret. Set with:
   *   npx wrangler pages secret put GITHUB_CMS_TOKEN --project-name peace-across-generations
   */
  GITHUB_CMS_TOKEN?: string;
  /** Local development only: "1" lets localhost use the admin API without Access. */
  DEV_ADMIN?: string;
}

export type Ctx = EventContext<Env, string, Record<string, unknown>>;
