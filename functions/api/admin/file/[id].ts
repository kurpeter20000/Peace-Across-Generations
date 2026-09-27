// GET /api/admin/file/:submissionId — download the uploaded file.
// Always served as an attachment with a neutral type, so an uploaded file can
// never run as a web page in the admin's browser.
import type { Ctx } from '../../../_lib/env';
import { audit } from '../../../_lib/db';
import { json } from '../../../_lib/http';

export const onRequestGet = async ({ params, env, data }: Ctx) => {
  const row = await env.DB.prepare('SELECT file_key, file_name FROM submissions WHERE id = ?').bind(params.id)
    .first<{ file_key: string | null; file_name: string | null }>();
  if (!row?.file_key) return json({ error: 'No file' }, 404);
  const obj = env.UPLOADS ? await env.UPLOADS.get(row.file_key) : null;
  if (!obj) return json({ error: 'File missing from storage' }, 404);
  await audit(env, String(data.admin), 'file:download', String(params.id));
  const name = (row.file_name ?? 'file').replace(/"/g, '');
  return new Response(obj.body, {
    headers: {
      'content-type': 'application/octet-stream',
      'content-disposition': `attachment; filename="${name}"`,
      'x-content-type-options': 'nosniff',
      'cache-control': 'no-store',
    },
  });
};
