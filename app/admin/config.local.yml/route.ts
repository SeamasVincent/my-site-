import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') return new Response('Not found', { status: 404 });
  const config = await readFile(path.join(process.cwd(), 'local', 'decap-config.yml'), 'utf8');
  return new Response(config, { headers: { 'content-type': 'text/yaml; charset=utf-8', 'cache-control': 'no-store' } });
}
