# Selected Work editor guide

Open `/admin` and select **Projects**. Content stays in `content/projects`; uploads stay in the existing shared `public/uploads` library. GitHub editorial workflow and Vercel deployment remain unchanged.

## Create, preview and publish

1. Create a project with a title and unique lowercase, hyphenated URL slug. Keep **Publication settings → Visibility** set to **draft** while writing. Incomplete drafts can be saved.
2. Fill in Project basics, Visuals and the five Case study sections. Categories are repeatable labels; only categories with published projects appear as public filters. Describe your own responsibilities in **My contribution** and credit team outcomes in **Results**. Add context, timeframe and attribution to metrics.
3. Preview in the editor. Cover, story, gallery, metrics and testimonial appear in the preview. Optional sections can be left blank. SEO title, description and image default to the project title, short description and cover.
4. To publish, set Visibility to **published**, save, then use the existing editorial review/Publish flow. Published projects require a description, role, category, cover with alternative text, and all five main story sections. A repository build validates URL uniqueness across published, draft, hidden and archived entries before deployment.

Visibility and editorial workflow status are separate. A merged entry still marked `draft` remains private. Draft/hidden/archived routes return 404, including their aliases. Their public-page preview links therefore also return 404; use the editor preview for drafts. Vercel deploy previews depend on the repository's existing integration and are not configured by this change.

## Order, edit and retire

- Featured projects appear first. Within featured and ordinary projects, lower **Manual order** values appear first; titles break ties. Adjacent-project links follow the same order.
- Edit existing projects normally. On saving a changed slug, the editor retains the previous saved slug automatically. Repeated changes in one editor session also retain intermediate slugs. The **Previous slugs** and **Redirect tracking slug** fields may show their pre-save values until the entry is reopened. Direct JSON edits must maintain `previousSlugs` and `savedSlug` manually.
- Use native collection search, filters and sorting. If your editor exposes a Duplicate action, give the copy a new slug and clear **Previous slugs** and **Redirect tracking slug** before saving it. Otherwise create a new project and copy the relevant fields; this setup does not add a custom duplication action.
- Set Visibility to **hidden** or **archived** and publish the change to remove the project and its detail/redirect routes from the public site while retaining its source. These states have separate CMS filters.
- To delete, use the editor's native Delete action and confirmation. Delete the entry only. Images live in the shared media folder and this implementation does not remove media on entry deletion. Do not delete a shared upload from the Media library unless you have checked all references. No live entry was deleted during verification.

Cross-entry slug uniqueness is enforced by the content loader/build, not by a remote CMS availability check. A collision reports the two owners and asks for a unique suffix such as `-2`. Resolve it and rebuild; no entry is silently renamed. The editor does not provide a global transactional URL reservation service.

## Episode articles

In Insights, **Episode article / Article body** uses the existing `body` field. For Video and Podcast entries, it appears under **Episode article** below the introduction. Headings, paragraphs, lists and links use Markdown. A blank episode article is allowed when the episode has a summary and a valid playback link. Standalone Articles retain their existing paragraph rendering.

The latest three GitHub entries already contained their write-ups in `body`; they were not separate Articles. If you later have a separate Article write-up, copy its body into the episode field, preview the episode and publish it. Keep the original Article intact unless you deliberately decide to retire it; no automatic migration or deletion occurs.

Playback links appear on cards and detail pages in saved order. The saved Watch/Listen format is respected even when the platform is YouTube. Legacy single URLs remain supported.

Reference: [Decap configuration](https://decapcms.org/docs/configuration-options/), [editor events](https://decapcms.org/docs/registering-events/), and [custom previews](https://decapcms.org/docs/customization/).
