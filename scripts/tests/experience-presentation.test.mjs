import test from 'node:test';
import assert from 'node:assert/strict';
import { allEngagements, educationExperiences } from '../../src/data/experience.ts';
import { caseStudies } from '../../src/data/work.ts';
import { experiencePresentation, projectDetailSections } from '../../src/lib/experience-presentation.ts';

const engagement = id => allEngagements.find(item => item.id === id);

test('sparse education and early-role facts remain available without a project disclosure', () => {
  for (const item of [...educationExperiences, ...['eddys-group', 'freelance-wordpress', 'fomaco'].map(engagement)]) {
    const view = experiencePresentation(item, caseStudies);
    assert.deepEqual(view.bullets, item.bullets);
    assert.deepEqual(view.stories, []);
  }
  assert.match(experiencePresentation(engagement('emlyon'), caseStudies).description, /McGill/);
  assert.deepEqual(experiencePresentation(engagement('emlyon'), caseStudies).bullets, ['LIFE Lebanon Scholarship recipient']);
  assert.match(experiencePresentation(engagement('mcgill'), caseStudies).description, /emlyon MSc/);
});

test('all eight complete narratives render their need once and preserve every original paragraph', () => {
  assert.equal(caseStudies.length, 8);
  let paragraphCount = 0;
  for (const story of caseStudies) {
    const view = experiencePresentation(engagement(story.engagementId), caseStudies);
    assert.ok(view.stories.includes(story));
    const paragraphs = [story.summary, ...projectDetailSections(story).flatMap(section => section.paragraphs)];
    assert.equal(paragraphs.filter(p => p === story.summary).length, 1, story.slug);
    for (const paragraph of story.sections.flatMap(section => section.paragraphs)) {
      assert.ok(paragraphs.includes(paragraph), story.slug);
      paragraphCount++;
    }
    assert.deepEqual(projectDetailSections(story).flatMap(section => section.paragraphs), story.sections.flatMap(section => section.paragraphs).filter(p => p !== story.summary));
  }
  assert.equal(paragraphCount, 36);
});

test('unique work outside the narratives survives removal of repeated contribution lists', () => {
  const aws = experiencePresentation(engagement('aws'), caseStudies);
  assert.deepEqual(aws.bullets, []);
  assert.equal(aws.additional.length, 1);
  assert.match(aws.additional[0], /AWS Transform.*Redshift/);
  const supportful = experiencePresentation(engagement('supportful'), caseStudies);
  assert.equal(supportful.stories.length, 3);
  assert.deepEqual(supportful.projects, []);
  assert.match(supportful.additional[0], /financial-services and industrial clients/);
  assert.match(experiencePresentation(engagement('towardschange'), caseStudies).additional[0], /SharePoint documents, email conversations and support tickets/);
  assert.match(experiencePresentation(engagement('mopo'), caseStudies).additional[0], /agile delivery practices/);
  const early = engagement('additional-ai-consulting');
  assert.deepEqual(experiencePresentation(early, caseStudies).projects, early.projects);
});

test('unknown narrative sets keep complete source contributions and invalid relationships fail', () => {
  const item = engagement('aws');
  const extra = { ...caseStudies.find(story => story.engagementId === 'aws'), slug: 'new-project' };
  const changed = { ...item, caseStudySlugs: [...item.caseStudySlugs, extra.slug] };
  assert.deepEqual(experiencePresentation(changed, [...caseStudies, extra]).bullets, item.bullets);
  assert.throws(() => experiencePresentation({ ...item, caseStudySlugs: ['missing'] }, caseStudies), /relationship missing/);
  assert.throws(() => experiencePresentation({ ...item, caseStudySlugs: ['salesforce-agent-mcp'] }, caseStudies), /relationship missing/);
  assert.throws(() => experiencePresentation({ ...item, bullets: [] }, caseStudies), /selector drift/);
});
