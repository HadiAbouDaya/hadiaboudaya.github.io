import { parse } from 'parse5';

const attributes = node => Object.fromEntries((node.attrs ?? []).map(attr => [attr.name, attr.value]));
function elements(node, result = []) {
  if (node.tagName) result.push(node);
  for (const child of node.childNodes ?? []) elements(child, result);
  return result;
}
function ancestor(node, predicate) {
  for (let parent = node.parentNode; parent; parent = parent.parentNode) if (predicate(parent)) return parent;
}

/** Release guards for the exact sparse-content and nested-disclosure regressions. */
export function experienceContractErrors(markup, searchItems) {
  const all = elements(parse(markup));
  const errors = [];
  const byId = new Map(all.map(node => [attributes(node).id, node]));
  for (const id of ['professional-experience', 'education-experience']) {
    if (!byId.has(id)) errors.push(`Experience region missing: ${id}`);
    else if (attributes(byId.get(id)).tabindex !== '-1') errors.push(`Experience region must accept navigation focus: ${id}`);
  }
  const education = byId.get('education-experience');
  if (education && elements(education).some(node => node.tagName === 'details')) errors.push('Education facts must be visible without disclosures');
  for (const item of searchItems.filter(item => item.category === 'experience')) {
    const id = item.href?.split('#')[1];
    const target = byId.get(id);
    if (!id || !target) { errors.push(`Experience search target missing: ${id ?? item.href}`); continue; }
    if (attributes(target).tabindex !== '-1') errors.push(`Experience search target must accept focus: ${id}`);
    if (id.startsWith('project-')) {
      if (!Object.hasOwn(attributes(target), 'data-project-evidence')) errors.push(`Project target must expose its purpose before expansion: ${id}`);
      const details = elements(target).filter(node => node.tagName === 'details');
      if (details.length !== 1 || !Object.hasOwn(attributes(details[0]), 'data-project-details')) errors.push(`Project must have one contribution/outcome disclosure: ${id}`);
      const visibleParagraphs = elements(target).filter(node => node.tagName === 'p' && !ancestor(node, parent => parent.tagName === 'details'));
      if (visibleParagraphs.length < 2) errors.push(`Project stage and purpose must remain visible: ${id}`);
    }
  }
  for (const details of all.filter(node => node.tagName === 'details')) {
    if (!ancestor(details, parent => Object.hasOwn(attributes(parent), 'data-project-evidence'))) errors.push('Only substantial project narratives may use disclosures');
    if (ancestor(details, parent => parent.tagName === 'details')) errors.push('Experience disclosures must not be nested');
  }
  return errors;
}
