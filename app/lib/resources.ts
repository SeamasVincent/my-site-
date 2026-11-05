import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

export type Resource = { title:string; slug:string; type:string; description:string; details?:string; publishedAt?:string; status?:'draft'|'published'; picture?:string; pictureAlt?:string; file?:string; link?:string; linkLabel?:string; checkoutLink?:string };
const directory=path.join(process.cwd(),'content','resources');
function isHttps(value?:string) { try { return new URL(value||'').protocol==='https:'; } catch { return false; } }
export async function getResources(featuredSlug='build-intelligently'):Promise<Resource[]> {
  try {
    const names=(await readdir(directory)).filter(name=>name.endsWith('.json'));
    const rows=await Promise.all(names.map(async name=>JSON.parse(await readFile(path.join(directory,name),'utf8')) as Resource));
    return rows.filter(row=>row.status!=='draft'&&row.slug!==featuredSlug&&row.title?.trim()&&row.slug?.trim()&&row.description?.trim()).map(row=>({...row,link:isHttps(row.link)?row.link:undefined,checkoutLink:isHttps(row.checkoutLink)?row.checkoutLink:undefined,file:row.file?.startsWith('/uploads/')?row.file:undefined})).sort((a,b)=>(b.publishedAt||'').localeCompare(a.publishedAt||'')||a.slug.localeCompare(b.slug));
  } catch { return []; }
}
