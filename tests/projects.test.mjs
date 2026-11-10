import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { prepareProjects } from '../app/lib/projects.ts';
const require = createRequire(import.meta.url);
const base = { title: 'Project', slug: 'project', basics: { description: 'Description', role: 'My role', categories: ['Strategy'] }, visuals: { cover: '/uploads/shared.png', coverAlt: 'Cover' }, story: { overview: 'Overview', challenge: 'Challenge', contribution: 'Contribution', approach: 'Approach', results: 'Team results' }, publication: { status: 'published' } };
test('only published projects are public; private projects reserve URLs', () => {
  for (const status of ['draft', 'hidden', 'archived', undefined]) {
    assert.equal(prepareProjects([{ ...base, publication: { status } }]).length, 0);
    assert.throws(() => prepareProjects([base, { ...base, publication: { status } }]), /collision/);
  }
});
test('canonical and previous project URLs must be unique', () => {
  assert.throws(() => prepareProjects([base, { ...base, slug: 'other', previousSlugs: ['project'] }]), /collision/);
  assert.throws(() => prepareProjects([{ ...base, slug: 'Bad Slug' }]), /hyphenated/);
  assert.equal(prepareProjects([{ ...base, previousSlugs: ['old-project', 'old-project'] }])[0].previousSlugs.length, 1);
});
test('featured then manual order is deterministic, with safe links and categories', () => {
  const result = prepareProjects([{ ...base, slug: 'ordinary', publication: { status: 'published', order: 0 } }, { ...base, slug: 'featured', publication: { status: 'published', featured: true, order: 10 } }, { ...base, slug: 'first', publication: { status: 'published', featured: true, order: 1 } }]);
  assert.deepEqual(result.map(p => p.slug), ['first', 'featured', 'ordinary']);
  const [item] = prepareProjects([{ ...base, externalLinks: [{ label: 'Unsafe', url: 'javascript:alert(1)' }, { label: 'Reference', url: 'https://example.com' }], basics: { ...base.basics, categories: [' Strategy ', 'Strategy'] } }]);
  assert.deepEqual(item.basics.categories, ['Strategy']); assert.equal(item.externalLinks.length, 1);
});
test('incomplete published projects fail clearly but drafts remain editable', () => {
  assert.throws(() => prepareProjects([{ ...base, story: {} }]), /Save it as draft/);
  assert.equal(prepareProjects([{ title: 'Draft', slug: 'draft', publication: { status: 'draft' } }]).length, 0);
});
test('both project schemas agree and preserve shared media configuration', () => {
  const configs = ['public/admin/config.yml', 'local/decap-config.yml'].map(p => require('js-yaml').load(readFileSync(p, 'utf8')));
  assert.deepEqual(configs[0].collections.find(c => c.name === 'projects'), configs[1].collections.find(c => c.name === 'projects'));
  for (const config of configs) {
    assert.equal(config.media_folder, 'public/uploads');
    const project = config.collections.find(c => c.name === 'projects');
    assert.equal(project.delete, true); assert.equal(project.media_folder, undefined);
    assert.equal(project.fields.find(f => f.name === 'publication').fields.find(f => f.name === 'status').default, 'draft');
  }
});
test('editor save hook preserves slug changes and preview uses nested rich-text widgets', () => {
  let handler, preview;
  vm.runInNewContext(readFileSync('public/admin/editor.js', 'utf8'), { CMS: { registerEventListener: event => { handler = event.handler; }, registerPreviewTemplate: (_, template) => { preview = template; }, registerPreviewStyle() {} }, h: (tag, props, ...children) => ({ tag, props, children }) });
  class Data { constructor(value) { this.value = value; } get(key) { return this.value[key]; } set(key, value) { return new Data({ ...this.value, [key]: value }); } toJS() { return this.value; } }
  const entry = new Data({ collection: 'projects', data: new Data({ slug: 'new', savedSlug: 'old', previousSlugs: ['original'] }) });
  const changed = handler({ entry });
  assert.deepEqual(Array.from(changed.get('previousSlugs')), ['original', 'old']);
  assert.equal(changed.get('savedSlug'), 'new');
  assert.equal(handler({ entry: new Data({ collection: 'projects', data: changed }) }).get('previousSlugs').length, 2);
  const stale = new Data({ collection: 'projects', path: 'content/projects/stable.json', data: new Data({ slug: 'second', savedSlug: 'first' }) });
  handler({ entry: stale });
  const third = handler({ entry: new Data({ collection: 'projects', path: 'content/projects/stable.json', data: new Data({ slug: 'third', savedSlug: 'first' }) }) });
  assert.deepEqual(Array.from(third.get('previousSlugs')), ['first', 'second']);
  assert.throws(() => handler({ entry: new Data({ collection: 'projects', data: new Data({ ...base, story: {} }) }) }), /To publish/);
  const requested = [];
  const rendered = preview({ entry: new Data({ data: new Data(base) }), getAsset: value => value, widgetsFor: name => ({ getIn: path => { requested.push([name, ...path]); return 'Formatted story'; } }) });
  assert.equal(rendered.tag, 'article'); assert.equal(requested.length, 5);
  assert.deepEqual(requested[0], ['story', 'widgets', 'overview']);
});
