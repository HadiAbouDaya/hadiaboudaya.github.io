import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSearchIndex } from '../../src/lib/search-validation.ts';

const item = { id: 'project', title: 'AWS delivery', description: 'Project evidence', category: 'experience', href: '/experience/#project-example' };
const index = (items = [item]) => ({ schemaVersion: 1, contentRevision: 'revision', items });
const invalid = value => assert.throws(() => parseSearchIndex(value), /temporarily unavailable/);

test('valid public projections retain all supported categories and metadata', () => {
  const value = index(['page', 'experience', 'event', 'certification', 'blog', 'cv'].map((category, i) => ({
    ...item, id: String(i), category, keywords: ['AI', 'résumé'],
    meta: { date: '2026-11', location: 'Paris', technologies: ['TypeScript'], tags: ['AI'] },
  })));
  assert.equal(parseSearchIndex(value), value);
  assert.equal(parseSearchIndex(index([])).items.length, 0);
});

test('malformed envelopes and entries fail before reaching search matching or rendering', () => {
  for (const value of [null, [], {}, { ...index(), schemaVersion: 2 }, { ...index(), contentRevision: '' }, { ...index(), items: {} }, index([null]), index([{}])]) invalid(value);
  for (const mutation of [
    { id: '' }, { title: 1 }, { description: null }, { category: 'unknown' },
    { keywords: 'AWS' }, { keywords: [null] }, { meta: null }, { meta: [] },
    { meta: { location: 1 } }, { meta: { tags: [null] } }, { meta: { unknown: {} } },
  ]) invalid(index([{ ...item, ...mutation }]));
  invalid(index([item, { ...item }]));
});

test('search destinations reject external protocols, private routes and malformed fragments', () => {
  for (const href of [
    'javascript:alert(1)', 'https://example.com/', '//example.com/', '/\\example.com/',
    '/luna', '/luna/', '/luna/birthday/', '/%6cuna/', '/events/../luna/',
    '/%2fluna/', '/%5cluna/', '/.codex/onboarding.md', '/about/#bad%escape',
    '/about/\n', '/about/%00', '/about/#%0a',
  ]) invalid(index([{ ...item, href }]));
  for (const href of ['/', '/about/', '/experience/#exp-aws', '/certifications/#cert-1', '/blog/example/', '/cv/example.pdf', '/contact/#cv-downloads']) {
    assert.equal(parseSearchIndex(index([{ ...item, href }])).items[0].href, href);
  }
});
