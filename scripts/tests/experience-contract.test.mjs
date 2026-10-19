import test from 'node:test';
import assert from 'node:assert/strict';
import { experienceContractErrors } from '../lib/experience-contract.mjs';
const record = { id: 'project-agent', category: 'experience', href: '/experience/#project-agent' };
const markup = `<section id="professional-experience" tabindex="-1"><article id="exp-client" tabindex="-1"><section id="project-agent" data-project-evidence tabindex="-1"><p>Production</p><h4>Agent project</h4><p>Helps users update records.</p><details data-project-details><summary>Read contribution and outcome</summary><p>Implementation and outcome.</p></details></section></article></section><section id="education-experience" tabindex="-1"><h3>University</h3><p>Scholarship recipient.</p></section>`;

test('visible education, client and project summaries with one disclosure pass', () => {
  assert.deepEqual(experienceContractErrors(markup, [record, { id: 'exp-client', category: 'experience', href: '/experience/#exp-client' }]), []);
});
test('a one-line study disclosure fails and cannot reintroduce the sparse-content interaction', () => {
  const changed = markup.replace('<p>Scholarship recipient.</p>', '<details><summary>Studies and projects</summary><p>Scholarship recipient.</p></details>');
  assert.ok(experienceContractErrors(changed, [record]).includes('Education facts must be visible without disclosures'));
});
test('hiding a project inside a client disclosure fails even with a correct project anchor', () => {
  const changed = markup.replace('<article id="exp-client" tabindex="-1">', '<article id="exp-client" tabindex="-1"><details><summary>Client</summary>').replace('</article>', '</details></article>');
  assert.ok(experienceContractErrors(changed, [record]).includes('Experience disclosures must not be nested'));
});
test('missing targets, missing purpose and nonfocusable project destinations fail', () => {
  assert.ok(experienceContractErrors(markup, [{ ...record, href: '/experience/#missing' }]).some(error => error.includes('target missing')));
  assert.ok(experienceContractErrors(markup.replace('data-project-evidence tabindex="-1"', 'data-project-evidence'), [record]).some(error => error.includes('accept focus: project-agent')));
  assert.ok(experienceContractErrors(markup.replace('<p>Helps users update records.</p>', ''), [record]).some(error => error.includes('stage and purpose')));
});
