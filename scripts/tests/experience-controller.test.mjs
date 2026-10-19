import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as navigation from '../../src/lib/experience-navigation.ts';
import * as fragments from '../../src/lib/fragments.ts';

const compiled = ts.transpileModule(
  fs.readFileSync(new URL('../../src/components/experience/ExperienceTimeline.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } },
).outputText;

// Execute the real controller with isolated browser/event and hook boundaries.
// React commits are immediate here; browser layout and native scroll restoration
// remain integration checks. No controller logic is copied into this harness.
function fixture(href = 'https://example.test/experience/') {
  const actions = [], frames = new Map(), effects = [], refs = [], cleanups = [];
  let frameId = 0, view = 'all';
  const windowEvents = new Map(), documentEvents = new Map();
  const hub = map => ({
    addEventListener(type, callback) { if (!map.has(type)) map.set(type, new Set()); map.get(type).add(callback); },
    removeEventListener(type, callback) { map.get(type)?.delete(callback); },
  });
  const emit = (map, type, event = {}) => { for (const callback of [...(map.get(type) ?? [])]) callback(event); };
  const document = { ...hub(documentEvents) };
  class Element {
    constructor(tag = 'div', attrs = {}) {
      this.tagName = tag.toUpperCase(); this.attrs = { ...attrs }; this.children = [];
      this.parentElement = null; this.isConnected = true; this.dataset = {};
      for (const [key, value] of Object.entries(attrs)) {
        if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
      }
    }
    append(child) { this.children.push(child); child.parentElement = this; return child; }
    matches(selector) {
      return selector.split(',').some(part => {
        const match = part.trim().match(/^([a-z]+)?(?:\[([^=\]]+)(?:=['"]?([^'"]*)['"]?)?\])?$/);
        if (!match || (!match[1] && !match[2])) throw new Error('Unsupported test selector: ' + part);
        return (!match[1] || this.tagName === match[1].toUpperCase()) &&
          (!match[2] || this.hasAttribute(match[2]) && (match[3] === undefined || this.attrs[match[2]] === match[3]));
      });
    }
    hasAttribute(name) { return Object.hasOwn(this.attrs, name); }
    closest(selector) { return this.matches(selector) ? this : this.parentElement?.closest(selector) ?? null; }
    contains(target) { return this === target || this.children.some(child => child.contains(target)); }
    querySelector(selector) {
      const direct = selector.startsWith(':scope > ');
      const match = direct ? selector.slice(':scope > '.length) : selector;
      for (const child of this.children) {
        if (child.matches(match)) return child;
        if (!direct) { const nested = child.querySelector(match); if (nested) return nested; }
      }
      return null;
    }
    focus(options) { document.activeElement = this; actions.push({ type: 'focus', target: this, options }); }
    scrollIntoView(options) { actions.push({ type: 'scroll', target: this, options }); }
    get href() { return new URL(this.attrs.href, location.href).href; }
    get target() { return this.attrs.target ?? ''; }
    set hidden(value) { if (value) this.attrs.hidden = ''; else delete this.attrs.hidden; }
  }
  class Details extends Element { constructor(attrs = {}) { super('details', attrs); this.open = false; } }
  const body = new Element('body');
  document.body = body; document.activeElement = body;
  document.querySelector = selector => body.querySelector(selector);
  document.getElementById = id => {
    const find = node => node.attrs.id === id ? node : node.children.map(find).find(Boolean);
    return find(body) ?? null;
  };
  const root = body.append(new Element());
  const professional = root.append(new Element('section', { id: 'professional-experience', 'data-experience-kind': 'professional' }));
  const education = root.append(new Element('section', { id: 'education-experience', 'data-experience-kind': 'education' }));
  const practice = professional.append(new Element('article', { id: 'exp-freelance-ai-consultant', tabindex: '-1' }));
  const client = practice.append(new Element('article', { id: 'exp-supportful', tabindex: '-1' }));
  const project = client.append(new Element('section', { id: 'project-salesforce-agent-mcp', 'data-project-evidence': '', tabindex: '-1' }));
  const details = project.append(new Details({ 'data-project-details': '' }));
  const summary = details.append(new Element('summary'));
  const study = education.append(new Element('article', { id: 'exp-emlyon', tabindex: '-1' }));
  const history = [new URL(href)]; let historyIndex = 0;
  const location = {
    get href() { return history[historyIndex].href; }, get hash() { return history[historyIndex].hash; },
    get pathname() { return history[historyIndex].pathname; }, get origin() { return history[historyIndex].origin; },
  };
  const window = { ...hub(windowEvents), location, history: {
    pushState(state, title, url) { history.splice(++historyIndex); history.push(new URL(url)); actions.push({ type: 'push', state }); },
    replaceState(state, title, url) { history[historyIndex] = new URL(url); actions.push({ type: 'replace', state }); },
  } };
  const jsx = (type, props, key) => ({ type, props, key });
  const react = {
    useState(initial) {
      return [initial, next => {
        view = typeof next === 'function' ? next(view) : next;
        professional.hidden = view === 'education'; education.hidden = view === 'professional';
      }];
    },
    useRef(initial) { const ref = { current: initial }; refs.push(ref); return ref; },
    useEffect(effect) { effects.push(effect); },
  };
  const record = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: record.exports, module: record, URL, HTMLElement: Element, Element, HTMLDetailsElement: Details, document, window,
    requestAnimationFrame(callback) { const id = frameId++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === 'react-dom') return { flushSync: callback => callback() };
      if (name === '@/lib/experience-navigation') return navigation;
      if (name === '@/lib/fragments') return fragments;
      if (name === '@/lib/utils') return { cn: (...values) => values.filter(Boolean).join(' ') };
      if (name === './experience.module.css') return { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) };
      throw new Error('Unexpected dependency ' + name);
    },
  }, { filename: 'ExperienceTimeline.tsx' });
  const tree = record.exports.ExperienceTimeline({
    professional: 'Professional server content', education: 'Education server content',
    entries: [...Array.from({ length: 10 }, (_, i) => ({ id: 'role-' + i, kind: 'professional' })), ...Array.from({ length: 3 }, (_, i) => ({ id: 'study-' + i, kind: 'education' }))],
  });
  tree.props.ref.current = root;
  const nodes = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(visit); return; }
    nodes.push(node); visit(node.props?.children);
  }
  visit(tree);
  const buttons = nodes.filter(node => node.props?.role === 'radio');
  buttons.forEach(button => button.props.ref(body.append(new Element('button'))));
  const buttonElements = refs.find(ref => Array.isArray(ref.current)).current;
  const event = (target, extra = {}) => ({
    target, button: 0, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...extra,
  });
  const flushFrame = () => { const queued = [...frames.values()]; frames.clear(); queued.forEach(callback => callback()); };
  const flushAll = () => { let count = 0; while (frames.size && ++count < 10) flushFrame(); assert.equal(frames.size, 0, 'navigation must have a finite frame schedule'); };
  return {
    root, body, project, details, summary, study, practice, document, actions, frames, buttons, buttonElements, nodes,
    get view() { return view; }, get url() { return new URL(location.href); }, get historyLength() { return history.length; },
    mount() { effects.forEach(effect => cleanups.push(effect())); },
    unmount() { cleanups.forEach(cleanup => cleanup()); },
    flushFrame, flushAll,
    link(hash, parent = body, attrs = {}) { return parent.append(new Element('a', { href: hash, ...attrs })); },
    dialog() { return body.append(new Element('dialog', { open: '' })); },
    click(target, extra) { const click = event(target, extra); emit(documentEvents, 'click', click); return click; },
    key(type = 'keydown') { emit(documentEvents, type); },
    explicit(id) { emit(windowEvents, fragments.REVEAL_FRAGMENT_EVENT, { detail: { id } }); },
    hashchange() { emit(windowEvents, 'hashchange'); },
    traverse(index) {
      historyIndex = index; emit(windowEvents, 'popstate'); emit(windowEvents, 'hashchange');
    },
    listenerCount() { return [...windowEvents.values(), ...documentEvents.values()].reduce((count, items) => count + items.size, 0); },
  };
}

test('server-rendered controller exposes all content and a screen-reader filter status without the inventory sentence', () => {
  const app = fixture();
  const regions = app.nodes.filter(node => ['professional-experience', 'education-experience'].includes(node.props?.id));
  assert.equal(regions.length, 2);
  for (const region of regions) { assert.equal(region.props.tabIndex, -1); assert.equal(region.props.hidden, false); }
  const statuses = app.nodes.filter(node => node.props?.role === 'status');
  assert.equal(statuses.length, 1);
  assert.equal(statuses[0].props.children, 'All experience shown.');
  assert.equal(statuses[0].props.className, 'sr-only');
  assert.equal(app.frames.size, 0, 'server render schedules no effects');
});

test('direct project section hash reveals a conflicting filter and opens the child details before one focus/scroll', () => {
  const app = fixture('https://example.test/experience/?view=education#project-salesforce-agent-mcp');
  app.mount(); app.flushAll();
  assert.equal(app.view, 'professional');
  assert.equal(app.url.searchParams.get('view'), 'professional');
  assert.equal(app.details.open, true);
  assert.equal(app.document.activeElement, app.project, 'read the visible project title and need before its details');
  assert.deepEqual(app.actions.filter(action => ['focus', 'scroll'].includes(action.type)).map(action => action.type), ['focus', 'scroll']);
  app.unmount();
});

test('in-page links handle same-fragment reopening without duplicate history or hash jumps', () => {
  const app = fixture(); app.mount(); app.flushAll();
  const link = app.link('#project-salesforce-agent-mcp');
  assert.equal(app.click(link, { ctrlKey: true }).defaultPrevented, false);
  assert.equal(app.details.open, false);
  assert.equal(app.click(link).defaultPrevented, true); app.flushAll();
  assert.equal(app.historyLength, 2);
  app.actions.length = 0; app.details.open = false;
  app.click(link); app.hashchange(); app.flushAll();
  assert.equal(app.historyLength, 2, 'same-fragment reopen must not add an entry');
  assert.equal(app.details.open, true);
  assert.deepEqual(app.actions.map(action => action.type), ['focus', 'scroll']);
  app.unmount();
});

test('global search waits for its modal and honors the explicit project id even with a different current hash', () => {
  const app = fixture('https://example.test/experience/#exp-emlyon'); app.mount(); app.flushAll();
  const modal = app.dialog(), result = app.link('/experience/#project-salesforce-agent-mcp', modal);
  app.actions.length = 0;
  assert.equal(app.click(result).defaultPrevented, false, 'leave search navigation to the search dialog');
  assert.equal(app.details.open, false);
  app.explicit('project-salesforce-agent-mcp'); app.flushAll();
  assert.equal(app.actions.filter(action => action.type === 'focus').length, 0, 'never focus background content through an open dialog');
  delete modal.attrs.open;
  app.explicit('project-salesforce-agent-mcp'); app.flushAll();
  assert.equal(app.document.activeElement, app.project);
  assert.equal(app.details.open, true);
  assert.equal(app.view, 'all');
  assert.equal(app.historyLength, 1, 'the reveal event must not own router navigation');
  app.details.open = false;
  app.explicit('project-salesforce-agent-mcp'); app.flushAll();
  assert.equal(app.details.open, true, 'same-fragment search reopens a manually closed project');
  app.unmount();
});

test('Back/Forward restores filters without controller focus, scrolling, or a duplicate paired hash callback', () => {
  const app = fixture('https://example.test/experience/#project-salesforce-agent-mcp'); app.mount(); app.flushAll();
  app.buttons[2].props.onClick();
  assert.equal(app.view, 'education'); assert.equal(app.url.hash, '');
  app.buttons[1].props.onClick();
  assert.equal(app.view, 'professional');
  app.actions.length = 0;
  app.traverse(1);
  assert.equal(app.view, 'education');
  app.traverse(0);
  assert.equal(app.view, 'all'); assert.equal(app.details.open, true);
  app.traverse(2);
  assert.equal(app.view, 'professional');
  assert.equal(app.frames.size, 0);
  assert.equal(app.actions.length, 0, 'native history retains control of its saved position and focus');
  app.unmount();
});

test('filter presses and subsequent input cancel either queued focus stage; cleanup removes all listeners and frames', () => {
  const app = fixture(); app.mount(); app.flushAll();
  const link = app.link('#project-salesforce-agent-mcp');
  app.click(link);
  assert.equal(app.frames.size, 1);
  app.buttons[2].props.onClick(); app.flushAll();
  assert.equal(app.actions.filter(action => action.type === 'focus' || action.type === 'scroll').length, 0);
  app.click(link); app.flushFrame(); app.key(); app.flushAll();
  assert.equal(app.actions.filter(action => action.type === 'focus' || action.type === 'scroll').length, 0);
  app.click(link); app.flushFrame(); app.unmount();
  assert.equal(app.frames.size, 0); assert.equal(app.listenerCount(), 0);
});

test('radio keyboard navigation wraps, supports Home/End, keeps focus on controls and ignores modified commands', () => {
  const app = fixture(); app.mount(); app.flushAll();
  const key = name => ({ key: name, preventDefault() {}, altKey: false, ctrlKey: false, metaKey: false });
  app.buttons[0].props.onKeyDown(key('ArrowLeft'));
  assert.equal(app.view, 'education'); assert.equal(app.document.activeElement, app.buttonElements[2]);
  app.buttons[2].props.onKeyDown(key('Home'));
  assert.equal(app.view, 'all'); assert.equal(app.document.activeElement, app.buttonElements[0]);
  app.buttons[0].props.onKeyDown(key('End'));
  assert.equal(app.view, 'education');
  app.buttons[2].props.onKeyDown({ ...key('Home'), ctrlKey: true });
  assert.equal(app.view, 'education');
  assert.equal(app.actions.filter(action => action.type === 'scroll').length, 0);
  assert.ok(app.actions.filter(action => action.type === 'focus').every(action => action.options.preventScroll));
  app.unmount();
});
