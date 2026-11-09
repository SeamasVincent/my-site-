import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPlaybackLinks, prepareInsights, normalizeSlug, decodeInsightSlug } from '../app/lib/insights.ts';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const base = { title: 'An episode', slug: 'an-episode', type: 'podcast', summary: 'Summary', platformUrl: 'https://example.com/old' };
const links = [
  { platform: 'YouTube', url: 'https://youtube.com/watch?v=example', format: 'Watch' },
  { platform: 'Spotify', url: 'https://open.spotify.com/episode/example', format: 'Listen' },
  { platform: 'Apple Podcasts', url: 'https://podcasts.apple.com/example', format: 'Listen' },
  { platform: 'Vimeo', url: 'https://vimeo.com/example', format: 'Watch' },
];
test('route parameters decode once, including the two published legacy URLs', () => {
  for (const slug of ['Saturated Market Series Pt 1', 'How To Build a Brand That Stands Out in Nigeria', 'an-episode']) {
    assert.equal(decodeInsightSlug(encodeURIComponent(slug)), slug);
  }
  assert.equal(decodeInsightSlug('bad%escape'), 'bad%escape');
  assert.equal(decodeInsightSlug('literal%2520'), 'literal%20');
});
test('mixed playback order is preserved without changing podcast type', () => {
  const [item] = prepareInsights([{ ...base, playbackLinks: links }]);
  assert.equal(item.type, 'podcast');
  assert.deepEqual(getPlaybackLinks(item), links);
});
test('invalid rows are ignored; legacy URL is used only if none survive', () => {
  const invalid = [{ platform: 'Bad', url: 'http://example.com', format: 'Watch' }, { platform: '', url: 'https://example.com', format: 'Listen' }, { platform: 'Bad', url: 'https://example.com', format: 'Read' }, null];
  assert.equal(getPlaybackLinks({ ...base, playbackLinks: invalid })[0].url, base.platformUrl);
  assert.deepEqual(getPlaybackLinks({ ...base, playbackLinks: [...invalid, ...links] }), links);
  assert.deepEqual(getPlaybackLinks({ ...base, platformUrl: 'javascript:alert(1)', playbackLinks: invalid }), []);
});
test('bodyless video and legacy entry publish; incomplete article and drafts stay private', () => {
  assert.equal(prepareInsights([{ ...base, type: 'video', body: '' }]).length, 1);
  assert.equal(prepareInsights([base]).length, 1);
  assert.equal(prepareInsights([{ ...base, type: 'article' }]).length, 0);
  assert.equal(prepareInsights([{ ...base, status: 'draft' }]).length, 0);
  assert.equal(prepareInsights([{ ...base, summary: ' ' }]).length, 0);
});
test('article content and related links remain separate from playback', () => {
  const [item] = prepareInsights([{ ...base, type: 'article', body: 'First paragraph.\n\nSecond paragraph.', playbackLinks: links, relatedLinks: [{ label: 'Source', url: 'https://example.com/source' }] }]);
  assert.equal(item.body, 'First paragraph.\n\nSecond paragraph.');
  assert.deepEqual(item.playbackLinks, []);
  assert.equal(item.relatedLinks.length, 1);
});
test('normalization preserves canonical URLs and retains old slugs as aliases', () => {
  assert.equal(normalizeSlug('Saturated Market Series Pt 1'), 'saturated-market-series-pt-1');
  const [item] = prepareInsights([{ ...base, slug: 'Some Old Title' }]);
  assert.equal(item.slug, 'some-old-title');
  assert.deepEqual(item.previousSlugs, ['Some Old Title']);
  assert.equal(prepareInsights([base])[0].slug, base.slug);
});
test('collisions fail explicitly, including aliases, normalized slugs, and drafts', () => {
  for (const other of [ { ...base, title: 'Duplicate' }, { ...base, title: 'Duplicate', slug: 'An Episode' }, { ...base, title: 'Duplicate', slug: 'other', previousSlugs: ['an-episode'] }, { ...base, title: 'Draft duplicate', status: 'draft' } ]) {
    assert.throws(() => prepareInsights([base, other]), /URL collision/);
  }
  assert.equal(prepareInsights([base, { ...base, slug: 'an-episode-2' }]).length, 2);
});
test('both CMS configs parse and enforce canonical slugs and playback rows', () => {
  for (const file of ['public/admin/config.yml', 'local/decap-config.yml']) {
    const config = require('js-yaml').load(readFileSync(file, 'utf8'));
    assert.equal(config.backend.name, 'github');
    const fields = config.collections.find(x => x.name === 'insights').fields;
    const pattern = new RegExp(fields.find(x => x.name === 'slug').pattern[0]);
    assert.equal(pattern.test('Saturated Market Series Pt 1'), false);
    assert.equal(pattern.test('saturated-market-series-pt-1'), true);
    assert.deepEqual(fields.find(x => x.name === 'playbackLinks').fields.map(x => x.name), ['platform', 'url', 'format']);
    assert.equal(fields.find(x => x.name === 'body').required, false);
  }
});
