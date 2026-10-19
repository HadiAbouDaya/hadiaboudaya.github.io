import test from 'node:test';
import assert from 'node:assert/strict';
import { experiences, professionalExperiences, allEngagements, latestExperience } from '../../src/data/experience.ts';
import { caseStudies } from '../../src/data/work.ts';
import { search } from '../../src/lib/search.ts';
import { formatDate, parseDate, formatMonthPeriod } from '../../src/lib/dates.ts';
import { certifications } from '../../src/data/certifications.ts';
import { events } from '../../src/data/events.ts';
import { NAV_LINKS } from '../../src/data/navigation.ts';
import { REQUIRED_ROUTES, RETIRED_ROUTES } from '../export-contract.mjs';

test('one consulting practice contains five dated engagement groups within ten professional entries', () => {
  assert.equal(professionalExperiences.length, 10);
  const practice = experiences.find(item => item.id === 'freelance-ai-consultant');
  assert.equal(practice.engagements.length, 5);
  assert.deepEqual(practice.engagements.map(item => item.id), ['supportful', 'mopo', 'minervahub', 'towardschange', 'additional-ai-consulting']);
  assert.equal(new Set(allEngagements.map(item => item.id)).size, allEngagements.length);
  assert.equal(latestExperience.id, 'aws');
  assert.equal(latestExperience.endDate, '2026-10');
  assert.ok(professionalExperiences.every((entry, i, list) => !i || list[i-1].endDate >= entry.endDate));
  for (const child of practice.engagements) {
    assert.ok(child.startDate >= practice.startDate && child.endDate <= practice.endDate);
  }
});

test('all eight project evidence records resolve to an Experience engagement while public Work routes remain retired', () => {
  assert.equal(caseStudies.length, 8);
  assert.equal(new Set(caseStudies.map(item => item.slug)).size, 8);
  for (const item of caseStudies) {
    const engagement = allEngagements.find(entry => entry.id === item.engagementId);
    assert.ok(engagement, item.slug);
    assert.ok(engagement.caseStudySlugs.includes(item.slug));
    assert.ok(item.sections.some(section => section.heading === 'Outcome'));
    assert.ok(item.sections.every(section => section.paragraphs.length > 0));
    assert.ok(RETIRED_ROUTES.includes(`/work/${item.slug}/`));
  }
  assert.ok(RETIRED_ROUTES.includes('/work/'));
  assert.ok(REQUIRED_ROUTES.every(route => !route.startsWith('/work')));
  assert.ok(NAV_LINKS.every(link => !link.href.startsWith('/work') && !/selected work/i.test(link.label)));
  assert.match(caseStudies.find(item => item.engagementId === 'aws').stage, /pilot/i);
  const tc = caseStudies.find(item => item.engagementId === 'towardschange');
  assert.ok(tc.sections.some(item => /On-premise/.test(item.heading)));
  assert.ok(tc.sections.some(item => /FridayGPT/.test(item.heading)));
});

test('search result order is deterministic and delivery evidence outranks incidental learning matches', () => {
  const items = caseStudies.map(item => ({ id: item.slug, title: item.title, description: item.summary, category: 'experience', href: `/experience/#project-${item.slug}`, keywords: item.technologies }));
  items.push({ id:'course', title:'Introduction to MCP', description:'A course', category:'certification', href:'/certifications/' });
  assert.equal(search('MCP', items)[0].item.id, 'salesforce-agent-mcp');
  assert.equal(search('MinervaHub', [{ id:'m',title:'MinervaHub',description:'Portal advisory',category:'experience',href:'/experience/#exp-minervahub' }])[0].item.id, 'm');
  const cv = { id:'cv',title:'CV in English',description:'Download résumé PDF',category:'cv',href:'/cv/HadiAbouDayaCV.pdf',keywords:['resume','curriculum vitae'] };
  assert.equal(search('resume', [...items,cv])[0].item.id, 'cv');
  assert.equal(search('computer vision', [{ id:'vision',title:'Computer vision',description:'Edge AI',category:'experience',href:'/experience/' },cv])[0].item.id,'vision');
  assert.deepEqual(search('no-such-topic', items), []);
});

test('event project evidence links to its own related engagement without a retired public label', () => {
  for (const event of events) {
    assert.doesNotMatch(`${event.title} ${event.summary} ${event.description}`, /selected\s+work/i);
    if (!event.caseStudySlug) continue;
    const project = caseStudies.find(item => item.slug === event.caseStudySlug);
    assert.ok(project, event.slug);
    assert.equal(event.relatedExperienceId, project.engagementId, event.slug);
  }
});

test('calendar formatting and invalid dates remain deterministic across time zones', () => {
  const saved = process.env.TZ;
  try {
    for (const zone of ['UTC','Europe/Paris','America/Los_Angeles']) {
      process.env.TZ = zone;
      assert.equal(formatDate('2026-01-01'),'January 1, 2026');
      assert.equal(formatMonthPeriod('2025-12','2026-07'),'Dec 2025 – Jul 2026');
    }
  } finally { process.env.TZ = saved; }
  assert.throws(() => parseDate('2026-02-30'));
  assert.throws(() => formatMonthPeriod('2026-07','2025-12'));
});

test('learning inventory remains intact and retired identifying page cannot generate a route', () => {
  assert.equal(certifications.length,56);
  assert.equal(new Set(certifications.map(item => item.id)).size,56);
  assert.deepEqual([...new Set(certifications.map(item => item.type))].sort(),['badge','certification','course','programme']);
  assert.ok(!events.some(item => item.slug === 'turinglabs-client-portal'));
  assert.equal(new Set(events.map(item => item.slug)).size, events.length);
});
