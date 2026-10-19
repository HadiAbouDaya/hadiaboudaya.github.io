import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'parse5';
import { RETIRED_ROUTES } from './export-contract.mjs';
import { experienceContractErrors } from './lib/experience-contract.mjs';

const origin = 'https://hadi.aboudaya.com';
function nodes(node, result = []) { if (node.tagName) result.push(node); for (const child of node.childNodes ?? []) nodes(child, result); return result; }
async function files(dir) { const entries = await readdir(dir,{withFileTypes:true}); return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(path.join(dir,entry.name)) : [path.join(dir,entry.name)]))).flat(); }
export async function verifyPublicContent(outDir = 'out') {
  const root = path.resolve(outDir);
  const errors = [];
  let pages = 0, schemas = 0;
  for (const file of await files(root)) {
    if (!/\.(html|json|txt|js|css|xml)$/.test(file)) continue;
    const text = await readFile(file,'utf8');
    const relative = path.relative(root,file).replaceAll(path.sep,'/');
    const normalized = text.replace(/\\\//g, '/').replace(/\\u002f/gi, '/').replace(/\\u0022/gi, '"');
    if (/(?:^|["'(\s=>]|https?:\/\/hadi\.aboudaya\.com)\/work(?:[/?#"'()<\s]|$)/i.test(normalized)) errors.push(`${relative}: retired Work URL in public content`);
    if (/selected\s+work/i.test(normalized)) errors.push(`${relative}: retired Selected Work label in public content`);
    for (const marker of ['/home/oem/', 'Hadi-Abou-Daya-Website-Implementation-Brief-', 'Detailed_Engagements_2026-10-18.md', 'Knowledge/MasterFile.md']) {
      if (text.includes(marker)) errors.push(`${relative}: private source marker ${marker}`);
    }
    if (!file.endsWith('.html')) continue;
    const all = nodes(parse(text));
    for (const node of all) {
      const attr = Object.fromEntries((node.attrs ?? []).map(a=>[a.name,a.value]));
      if (node.tagName === 'script' && attr.type === 'application/ld+json') {
        schemas++;
        const body = (node.childNodes ?? []).map(n=>n.value ?? '').join('');
        try { JSON.parse(body); } catch { errors.push(`${relative}: invalid JSON-LD`); }
        if (body.includes('<')) errors.push(`${relative}: JSON-LD contains an unescaped less-than character`);
      }
    }
    if (/^(404\.html|404\/|_not-found\/|luna\/)/.test(relative)) continue;
    pages++;
    const meta = new Map(all.filter(n=>n.tagName==='meta').map(n=> {
      const a = Object.fromEntries(n.attrs.map(a=>[a.name,a.value])); return [a.property ?? a.name,a.content];
    }));
    const expected = origin + '/' + relative.replace(/index\.html$/,'');
    const canonicalNode = all.find(n=>n.tagName==='link' && n.attrs.some(a=>a.name==='rel'&&a.value==='canonical'));
    const canonical = canonicalNode?.attrs.find(a=>a.name==='href')?.value;
    if (canonical !== expected) errors.push(`${relative}: canonical ${canonical} differs from ${expected}`);
    if (meta.get('og:url') !== canonical) errors.push(`${relative}: OG URL differs from canonical`);
    const ogImage = meta.get('og:image');
    if (!ogImage || ogImage !== meta.get('twitter:image')) errors.push(`${relative}: missing or mismatched sharing images`);
    if (meta.get('twitter:card') !== 'summary_large_image') errors.push(`${relative}: missing large Twitter card`);
    if (!meta.get('og:title') || !meta.get('og:description')) errors.push(`${relative}: missing sharing copy`);
    const title = all.find(n=>n.tagName==='title')?.childNodes.map(n=>n.value??'').join('') ?? '';
    if ((title.match(/Hadi Abou Daya/g) ?? []).length !== 1) errors.push(`${relative}: author missing or duplicated in title`);
    if (ogImage?.endsWith('/og-default.png') && (meta.get('og:image:width') !== '1200' || meta.get('og:image:height') !== '630')) errors.push(`${relative}: default sharing dimensions missing`);
  }
  const index = JSON.parse(await readFile(path.join(root,'search-index.json'),'utf8'));
  const experienceMarkup = await readFile(path.join(root, 'experience/index.html'), 'utf8');
  errors.push(...experienceContractErrors(experienceMarkup, index.items));
  const expectedProjects = RETIRED_ROUTES.filter(route => /^\/work\/.+\/$/.test(route)).map(route => `project-${route.split('/')[2]}`);
  const projects = index.items.filter(item => item.id.startsWith('project-'));
  if (projects.length !== expectedProjects.length || new Set(projects.map(item => item.id)).size !== expectedProjects.length || expectedProjects.some(id => !projects.some(item => item.id === id))) errors.push('Search must retain all eight project evidence records');
  if (index.items.some(item => item.category === 'work')) errors.push('Search must not contain a retired work category');
  if (projects.some(item => item.category !== 'experience' || item.href !== `/experience/#${item.id}`)) errors.push('Project search evidence must target its precise Experience project anchor');
  if (index.items.filter(item=>item.category==='cv').length !== 2) errors.push('Search must include two CVs');
  if (index.items.some(item => ['content','source','internalNotes','privateNotes'].some(key=>key in item))) errors.push('Unexpected private/body field in public search');
  for (const name of ['llms.txt', 'llms-full.txt']) {
    const text = await readFile(path.join(root, name), 'utf8');
    if (!text.includes('## Project experience')) errors.push(`${name}: missing Project experience section`);
    for (const project of projects) {
      if (!text.includes(`[${project.title}](${origin}${project.href})`)) errors.push(`${name}: missing project evidence link for ${project.id}`);
    }
  }
  if (errors.length) throw new Error(`Public content verification failed (${errors.length}):\n${errors.join('\n')}`);
  return {professionalPages:pages,jsonLdBlocks:schemas,searchItems:index.items.length,searchBytes:Buffer.byteLength(JSON.stringify(index)),privateMarkers:0};
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  verifyPublicContent(process.argv[2] ?? 'out').then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
