// GET /admin/cms/config.yml — the content editor's configuration.
// Generated per request so the sign-in address matches the site the team is
// using (pages.dev today, peace-agen.org later). JSON is valid YAML.
import type { Ctx } from '../../_lib/env';
import { cmsConfig } from '../../_lib/cms-config';

export const onRequestGet = async ({ request }: Ctx) =>
  new Response(JSON.stringify(cmsConfig(new URL(request.url).origin), null, 2), {
    headers: { 'content-type': 'application/yaml; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
