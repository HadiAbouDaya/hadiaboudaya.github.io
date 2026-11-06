import test from 'node:test';
import assert from 'node:assert/strict';
import { search } from '../../src/lib/search.ts';

const item = (id, title, description = '') => ({
  id, title, description, category: 'blog', href: `/blog/${id}/`,
});

test('prototype-property search terms remain literal queries without breaking later searches', () => {
  const items = [
    item('constructor', 'Constructor reference'),
    item('prototype', 'JavaScript __proto__ compatibility'),
    item('ordinary', 'Ordinary search result'),
  ];
  assert.equal(search('constructor', items)[0].item.id, 'constructor');
  assert.equal(search('__proto__', items)[0].item.id, 'prototype');
  assert.deepEqual(search('constructor missing', items), []);
  assert.equal(search('ordinary', items)[0].item.id, 'ordinary');
});

test('declared synonyms still match expanded phrases and require every query term', () => {
  const items = [
    item('ml', 'Machine learning platforms'),
    item('aws', 'Amazon Web Services', 'Cloud architecture'),
    item('cv', 'Curriculum vitae'),
  ];
  assert.equal(search('ML', items)[0].item.id, 'ml');
  assert.equal(search('aws architecture', items)[0].item.id, 'aws');
  assert.equal(search('resume', items)[0].item.id, 'cv');
  assert.deepEqual(search('aws missing', items), []);
});
