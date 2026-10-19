import test from 'node:test';
import assert from 'node:assert/strict';
import {
  experienceFilterForTarget,
  experienceFilterUrl,
  experienceFragmentId,
  readExperienceFilter,
} from '../../src/lib/experience-navigation.ts';

test('URL filters restore either restricted view and default safely to all content', () => {
  for (const filter of ['professional', 'education']) {
    const url = new URL(`https://example.test/experience/?view=${filter}`);
    assert.equal(readExperienceFilter(url), filter);
  }
  for (const search of ['', '?view=all', '?view=unknown', '?view=', '?View=education']) {
    assert.equal(readExperienceFilter(new URL(`https://example.test/experience/${search}`)), 'all');
  }
});

test('a conflicting deep link reveals its own section while the complete view stays complete', () => {
  assert.equal(experienceFilterForTarget('education', 'professional'), 'professional');
  assert.equal(experienceFilterForTarget('professional', 'education'), 'education');
  for (const kind of ['professional', 'education']) {
    assert.equal(experienceFilterForTarget('all', kind), 'all');
    assert.equal(experienceFilterForTarget(kind, kind), kind);
    assert.equal(experienceFilterForTarget(kind, undefined), kind);
  }
});

test('filter destinations preserve unrelated parameters, compatible fragments and the original URL', () => {
  const source = new URL('https://example.test/experience/?campaign=portfolio#exp-aws');
  const destination = experienceFilterUrl(source, 'professional', 'professional');
  assert.equal(destination.href, 'https://example.test/experience/?campaign=portfolio&view=professional#exp-aws');
  assert.equal(source.href, 'https://example.test/experience/?campaign=portfolio#exp-aws');
  assert.notEqual(source, destination);
  assert.equal(experienceFilterUrl(destination, 'all', 'professional').href, source.href);
});

test('selecting a filter clears a fragment into hidden content without discarding unrelated anchors', () => {
  const source = new URL('https://example.test/experience/?view=professional#project-salesforce-agent-mcp');
  const education = experienceFilterUrl(source, 'education', 'professional');
  assert.equal(education.href, 'https://example.test/experience/?view=education');
  assert.equal(readExperienceFilter(education), 'education');
  assert.equal(experienceFilterUrl(source, 'all', 'professional').hash, source.hash);
  assert.equal(experienceFilterUrl(source, 'education').hash, source.hash);
});

test('Back and Forward URL snapshots retain independent filters and fragment destinations', () => {
  const original = new URL('https://example.test/experience/#project-salesforce-agent-mcp');
  const education = experienceFilterUrl(original, 'education', 'professional');
  const roles = experienceFilterUrl(education, 'professional');
  const snapshots = [original, education, roles];
  assert.deepEqual(snapshots.map(readExperienceFilter), ['all', 'education', 'professional']);
  assert.deepEqual(snapshots.map(url => url.hash), ['#project-salesforce-agent-mcp', '', '']);
  assert.equal(readExperienceFilter(snapshots[1]), 'education', 'returning to a prior URL restores that view');
  assert.equal(snapshots[0].hash, '#project-salesforce-agent-mcp', 'returning further preserves the original project');
});

test('fragment ids decode exactly once and malformed destinations are ignored', () => {
  assert.equal(experienceFragmentId('#professional-experience'), 'professional-experience');
  assert.equal(experienceFragmentId('#project-salesforce-agent-mcp'), 'project-salesforce-agent-mcp');
  assert.equal(experienceFragmentId('#project%2Fneed%20%26%20outcome'), 'project/need & outcome');
  assert.equal(experienceFragmentId('#literal%2520value'), 'literal%20value');
  for (const hash of ['', '#', 'exp-aws', '#%E0%A4%A', '#%']) assert.equal(experienceFragmentId(hash), undefined);
});
