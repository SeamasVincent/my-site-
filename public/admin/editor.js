/* global CMS, h */
const projectSlugHistory = new Map();
// Retain every saved URL; this also covers published entries edited as workflow drafts.
CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => {
    if (entry.get('collection') !== 'projects') return entry.get('data');
    const data = entry.get('data');
    const project = data.toJS();
    if (project.publication?.status === 'published') {
      const required = [project.title, project.basics?.description, project.basics?.role, project.visuals?.cover, project.visuals?.coverAlt,
        ...['overview', 'challenge', 'contribution', 'approach', 'results'].map(key => project.story?.[key])];
      if (required.some(value => !value?.trim()) || !project.basics?.categories?.some(value => value.trim())) {
        throw new Error('To publish, complete the description, role, categories, cover and alt text, and all five case-study sections. Keep Visibility as draft to save unfinished work.');
      }
    }
    const slug = data.get('slug');
    // Decap can keep the pre-hook editor values after saving. Preserve history
    // across repeated saves in the same editor session as well as reloads.
    const key = entry.get('path') || `content/projects/${entry.get('slug') || slug}.json`;
    const history = entry.get('newRecord') ? undefined : projectSlugHistory.get(key);
    const saved = history?.slug || data.get('savedSlug');
    const raw = data.get('previousSlugs');
    const previous = raw?.toJS ? raw.toJS() : raw || [];
    const aliases = [...new Set([...previous, ...(history?.aliases || []), ...(saved && saved !== slug ? [saved] : [])])].filter(value => value !== slug);
    projectSlugHistory.set(key, { slug, aliases });
    return data.set('previousSlugs', aliases).set('savedSlug', slug);
  },
});

CMS.registerPreviewStyle('/admin/preview.css');
CMS.registerPreviewTemplate('projects', ({ entry, widgetsFor, getAsset }) => {
  const data = entry.get('data').toJS();
  const basics = data.basics || {}, visuals = data.visuals || {}, story = data.story || {};
  return h('article', { className: 'project-preview' },
    h('small', {}, `Selected Work · ${data.publication?.status || 'draft'}`),
    h('h1', {}, data.title || 'Project title'),
    h('p', {}, basics.description),
    h('p', {}, `${basics.organisation || ''} · My role: ${basics.role || ''}`),
    h('p', {}, [basics.year, basics.location, ...(basics.categories || [])].filter(Boolean).join(' · ')),
    visuals.cover && h('img', { src: getAsset(visuals.cover).toString(), alt: visuals.coverAlt || '' }),
    ...[['overview', 'Overview'], ['challenge', 'The challenge'], ['contribution', 'My contribution'], ['approach', 'Approach and execution'], ['results', 'Results'], ['lessons', 'Lessons']].filter(([key]) => story[key]).map(([key, label]) => h('section', { key }, h('h2', {}, label), widgetsFor('story').getIn(['widgets', key]))),
    ...(data.metrics || []).map((metric, key) => h('section', { key: `metric-${key}` }, h('h2', {}, `${metric.value} — ${metric.label}`), h('p', {}, metric.context))),
    ...(visuals.gallery || []).map((photo, key) => h('figure', { key: `photo-${key}` }, h('img', { src: getAsset(photo.image).toString(), alt: photo.alt }), h('figcaption', {}, photo.caption))),
    data.testimonial?.quote && h('blockquote', {}, data.testimonial.quote, h('footer', {}, `${data.testimonial.name || ''} — ${data.testimonial.attribution || ''}`)),
    ...(data.externalLinks || []).filter(link => /^https:\/\//.test(link.url)).map((link, key) => h('p', { key: `link-${key}` }, h('a', { href: link.url }, link.label))),
  );
});
