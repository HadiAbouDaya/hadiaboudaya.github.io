import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { caseStudies } from '../../src/data/work.ts';
import { verifyPublicContent } from '../verify-public-content.mjs';

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'website-public-content-test-'));
  const origin = 'https://hadi.aboudaya.com';
  const meta = {
    'og:url': `${origin}/`, 'og:title': 'Hadi Abou Daya', 'og:description': 'AI consulting experience',
    'og:image': `${origin}/og-default.png`, 'twitter:image': `${origin}/og-default.png`,
    'og:image:width': '1200', 'og:image:height': '630', 'twitter:card': 'summary_large_image',
  };
  await writeFile(path.join(root, 'index.html'), `<!doctype html><html><head><title>Hadi Abou Daya</title><link rel="canonical" href="${origin}/">${Object.entries(meta).map(([property, content]) => `<meta property="${property}" content="${content}">`).join('')}</head><body><h1>Experience</h1><img src="/Media/work/logo.webp"><p>Consulting work and delivery.</p></body></html>`);
  const items = caseStudies.map(item => ({ id: `project-${item.slug}`, title: item.title, category: 'experience', href: `/experience/#project-${item.slug}` }));
  items.push({ id: 'cv-en', category: 'cv', href: '/cv/HadiAbouDayaCV.pdf' }, { id: 'cv-fr', category: 'cv', href: '/cv/HadiAbouDayaCV-fr.pdf' });
  const index = { schemaVersion: 1, contentRevision: 'test-revision', items };
  await writeFile(path.join(root, 'search-index.json'), JSON.stringify(index));
  await mkdir(path.join(root, 'experience'));
  const experienceBody = `<section id="professional-experience" tabindex="-1">${caseStudies.map(item => `<section id="project-${item.slug}" tabindex="-1" data-project-evidence><p>${item.stage}</p><h3>${item.title}</h3><p>${item.summary}</p><details data-project-details><summary>Read contribution and outcome</summary><p>Substantial project detail.</p></details></section>`).join('')}</section><section id="education-experience" tabindex="-1"><p>Education is visible.</p></section>`;
  const experienceHead = `<title>Experience | Hadi Abou Daya</title><link rel="canonical" href="${origin}/experience/">${Object.entries({ ...meta, 'og:url': `${origin}/experience/` }).map(([property, content]) => `<meta property="${property}" content="${content}">`).join('')}`;
  await writeFile(path.join(root, 'experience/index.html'), `<!doctype html><html><head>${experienceHead}</head><body>${experienceBody}</body></html>`);

  const profile = `## Project experience\n\n${caseStudies.map(item => `[${item.title}](${origin}/experience/#project-${item.slug})`).join('\n\n')}`;
  await writeFile(path.join(root, 'llms.txt'), profile);
  await writeFile(path.join(root, 'llms-full.txt'), profile);
  return { root, index };
}

test('public projections retain eight Experience project records and approved customer media paths', async () => {
  const { root } = await fixture();
  assert.equal((await verifyPublicContent(root)).searchItems, 10);
});

test('public verification rejects retired categories, missing project evidence and incorrect targets', async () => {
  const { root, index } = await fixture();
  index.items[0].category = 'work';
  index.items[1].href = '/about/';
  index.items.splice(2, 1);
  await writeFile(path.join(root, 'search-index.json'), JSON.stringify(index));
  await assert.rejects(verifyPublicContent(root), error => /retain all eight project evidence/.test(error.message) && /retired work category/.test(error.message) && /precise Experience project anchor/.test(error.message));
});

test('retired public URLs and labels are rejected in sitemap, scripts and generated profile text', async () => {
  const { root } = await fixture();
  await writeFile(path.join(root, 'sitemap.xml'), '<loc>https://hadi.aboudaya.com/work/</loc>');
  await writeFile(path.join(root, 'old-links.js'), String.raw`const href="\/work\/salesforce-agent-mcp\/";`);
  await writeFile(path.join(root, 'llms.txt'), `${await readFile(path.join(root, 'llms.txt'), 'utf8')}\nSelected Work`);
  await assert.rejects(verifyPublicContent(root), error => /sitemap\.xml: retired Work URL/.test(error.message) && /old-links\.js: retired Work URL/.test(error.message) && /llms\.txt: retired Selected Work label/.test(error.message));
});

test('both generated public profiles must preserve project links to Experience', async () => {
  const { root } = await fixture();
  await writeFile(path.join(root, 'llms-full.txt'), '## Project experience\n');
  await assert.rejects(verifyPublicContent(root), /llms-full\.txt: missing project evidence link/);
});
