# Seamas Vincent website setup

The site uses the existing Next.js 16 App Router project. Public pages are server rendered. Photos and page-opening fields are stored in `content/site-settings.json`; confirmed speaking and teaching contributions are in `content/speaking-experience.json`; Insights entries are JSON files in `content/insights/`. Draft entries are excluded from public pages and the sitemap. Articles without body copy and video/podcast entries without an HTTPS platform link stay out of public collections.

## Browser editor

The editor is available at `/admin` after deployment. It uses Decap CMS with GitHub as its content store. The source and editor have no CMS subscription charge. GitHub access, the OAuth host and the existing Vercel hosting account are still required; their costs depend on the accounts and usage selected.

Before sign-in can work:

1. Connect this repository and its production branch to the existing Vercel project so CMS commits trigger a site build.
2. `public/admin/config.yml` now uses the repository from `origin` (`SeamasVincent/my-site-`) and the local `main` branch. Set `base_url` to the actual HTTPS OAuth host before sign-in.
3. Set up a GitHub OAuth application and an HTTPS OAuth host that supports Decap's GitHub backend. Set its callback URL to the callback endpoint supplied by that host and keep the client secret on the OAuth host, never in this repository or a browser bundle.
4. Give the editor account write access to the repository. Visit `/admin` and sign in with that GitHub account.

The editor supports draft/review/publish workflows, articles, videos and podcast entries, speaking experience, opening copy on the principal pages, homepage introduction fields, workbook and SỌKẸ links, response expectations, and labeled photo uploads. Photos are committed under `public/uploads`; crop focal points and alt text are stored with each image. Publishing merges the reviewed GitHub change, which starts the configured Vercel build. Photo and content changes appear after that build completes.

Only add an Insight when its content and any external playback URL are ready. Articles are shown in full on this site. Video and podcast pages link out to the original platform and do not embed players. The Cinema in Your Pocket YouTube link is intentionally absent until supplied.

The editor package is loaded from the Decap CMS public CDN. A production Content Security Policy, if added later, must allow that script and the configured OAuth origin.

## Enquiry email

Copy `.env.example` into the hosting provider's environment settings. Set `RESEND_API_KEY` to a server-side Resend API key and `ENQUIRY_FROM_EMAIL` to a sender address verified with Resend. `ENQUIRY_TO_EMAIL` defaults to the private recipient in the brief; keep it configured only on the server. `NEXT_PUBLIC_SITE_URL` should be the one canonical production host.

The form API validates entries and returns success only after Resend accepts the email. Without valid email configuration it returns an error and the visitor's entered fields remain in the form. No live submission was sent during implementation. Resend account limits and any charges depend on the plan selected. The endpoint includes a honeypot; configure host-level rate limiting before a high-traffic launch.

## Domain and launch inputs

Set the production domain to `seamas.sokeafrica.com` in the existing Vercel project and add the DNS records Vercel provides. Do not enable a second indexed production host. The existing workbook Selar URL is retained. The SỌKẸ link uses the owner's stated `https://sokeafrica.com/` destination.

The supplied logo and workbook mockup are used. No favicon asset was present, so `app/icon.svg` is an explicit temporary brand-colour monogram and should be replaced with the supplied favicon when available. Photography remains intentionally represented by named, editable placeholders until authentic images are selected. Personal social profiles, podcast destinations and the teaching-video URL were not supplied, so no fabricated links or launch posts were added.

When an Insight slug changes, add the former value to its **Previous slugs (for redirects)** field before publishing. The old URL then redirects to the new stable URL.

## Refinement implementation completion

### Changed files

- `app/components/site-client.tsx` — removed the small role label from the shared header.
- `app/components/site.tsx` — added page-specific interior photo heroes, image fallbacks, alt text and focal point handling.
- `app/page.tsx`, `app/about/page.tsx`, `app/speaking/page.tsx`, `app/insights/page.tsx`, `app/books/page.tsx`, `app/contact/page.tsx` — connected hero fields, removed empty media tracks and rendered engagement photos from shared records.
- `app/globals.css` — added responsive image layouts, card treatment, dark-surface action contrast, mission figure colours and spacing adjustments.
- `content/site-settings.json` and `content/speaking-experience.json` — added independent photo fields and stable engagement IDs while leaving all new photos unset.
- `public/admin/config.yml` — added the corresponding editor fields.
- `IMPLEMENTATION.md` — this completion record.

### Editor photo fields

- **Site settings → Site links and photographs**: `About hero photo`, `Speaking hero photo`, `Insights hero photo`, `Books hero photo`, and `Contact hero photo`. Each has **Image**, **Alternative text**, **Crop focal point X (0-100)** and **Crop focal point Y (0-100)** fields. The Home portrait remains under **Hero portrait (supports transparent PNG)**.
- **Site settings → Site links and photographs**: `The work kept evolving photo`, `What building has taught me photo`, `What I believe photo`, and `Building and teaching photo`, each with the same image, alt text and focal point fields.
- **Speaking experience → Confirmed speaking and teaching experience → Engagements**: each stable-ID record has **Engagement photo**, **Photo alt text**, **Photo focal point X (0-100)** and **Photo focal point Y (0-100)**. The same record drives its Home and Speaking card.

### Spacing adjustments

- **Home**: removed the header label and its 16px flex gap; speaking cards now use an 18px desktop grid gap (16px on phones), with 32px after the format line and 26px before the section action.
- **About**: text-only chapter columns are centered at a maximum 48rem width; optional media has no empty grid track. Existing chapter padding remains 88px on wide layouts and 58px on phones.
- **Speaking**: section heading to following content is 36px (previously 42px); engagement cards use an 18px grid gap; the enquiry action sits 7px below its introduction copy, and validation feedback sits 16px below the submit action.
- **Insights**: the summary to card action gap is 16px; the existing filter-to-results gap remains 36px.
- **Books**: section heading to the next content block is 36px (previously 42px); purchase buttons retain a 20px top gap from product details and the existing section boundary spacing.
- **Contact**: validation feedback follows the submit action by 16px; the mobile form stack uses a 34px content gap and 76px bottom section padding.
- Existing section padding is 112px on desktop and 75px on phones. No duplicate section margins were added.

### Checks and remaining owner-side verification

- `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass.
- The site settings and engagement JSON, and Decap CMS YAML parse successfully.
- The local preview returned HTTP 200 for `/`, `/about`, `/speaking`, `/insights`, `/books`, and `/contact`; `/mission` continues to resolve through its existing About redirect.
- The local project has no configured owner photos for the new fields, so the interior heroes use the existing `public/portrait.jpg` fallback and engagement cards render without media frames. Actual uploaded wide/portrait photos, populated versus unset editor records, keyboard interaction, reduced-motion rendering, browser history navigation and visual spacing at 375px, 768px and 1440px still need confirmation in a browser/editor environment with owner-selected images. The Computer Use browser session was unavailable here.
- The browser editor still needs an OAuth host before sign-in and photo publishing can be verified.

## Follow-up refinement pass

### Changes

- `app/admin/page.tsx` declares `/admin/config.yml` explicitly before loading Decap. The local `/admin` HTML puts this link in `<head>`.
- `app/components/site-client.tsx` now supplies a full-bleed hero background with focal-point positioning and a bundled `/portrait.jpg` fallback when a configured image is absent or fails. It also adds Home first in the navigation, renames Books to Resources, and sets `aria-current="page"` for the active route.
- `app/components/site.tsx`, `app/page.tsx`, and `app/insights/[slug]/page.tsx` apply the background treatment to interior and article heroes. `app/globals.css` adds the dark scrim, reduced-motion behavior, light footer palette, and active navigation style.
- `app/about/page.tsx` gives the Mission introduction explicit spacing and changes the two employment figures to ink typography on the Alabaster surface with an Amber rule.
- `public/admin/config.yml` now names the Git remote repository (`SeamasVincent/my-site-`) and branch (`main`). The repository OAuth `base_url` remains a placeholder because no OAuth host is configured here.

### CMS request diagnosis

- The admin bootstrap previously loaded Decap without a config URL declaration. At `/admin` without a trailing slash, Decap's relative `config.yml` resolves to `/config.yml`; locally that path returns 404. The explicit same-origin URL is now `/admin/config.yml`.
- Local checks: `http://localhost:3000/admin/config.yml` returns HTTP 200, `Content-Type: text/yaml`, and the actual GitHub backend and collections YAML. `http://localhost:3000/admin` returns HTTP 200 and its HTML head contains `<link rel="cms-config-url" type="text/yaml" href="/admin/config.yml">`. `/admin/` receives the site's HTTP 308 canonical redirect. The local `/config.yml` request returns 404 as expected.
- `public/admin/config.yml` exists but is **untracked by Git** in this workspace (`git ls-files` does not include it). It was served by the local build, but is not yet on `main` or in a deployed build. `public/portrait.jpg` is tracked. The site source and configuration have not been committed or deployed during this pass.
- The deployed origin could not be reached with the available web access, so no remote response status or final URL was observed. The owner should repeat `https://seamas.sokeafrica.com/admin/config.yml` and confirm it returns HTTP 200 with YAML, then reload `/admin` and inspect the sign-in screen. After the site changes and config file reach the production branch, repeat the same check there. The CMS repo and branch are set locally; an OAuth host is still required for sign-in. No credentials were available for a draft-save check.

### Hero asset and remaining review

- `public/portrait.jpg` contains a white background in its source pixels. The same asset is now used as the full-bleed fallback, with Smoky Black scrims across the hero and stronger shading behind the copy; no separate pale image panel or filter is applied. There is no cleaner verified portrait in the current assets, so an owner-selected image can replace the fallback through the existing per-page fields.
- `app/insights/[slug]/page.tsx` uses the Insights hero image so article detail pages also receive the full-background treatment. Home keeps its centered name and role line.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` pass after this pass. `/`, `/about`, `/speaking`, `/insights`, `/books`, and `/contact` each return HTTP 200 locally; `/admin/` returns 308 to `/admin`. Home role line, active Home and Resources links, fallback hero markup, and local CMS response were checked in rendered HTML.
- Actual image-load failure, visual browser review at 375px/768px/1440px, navigation history, sign-in, and uploaded image crops still need browser/editor verification. The deployed config request and browser Network panel were unavailable in this environment.
- Footer links and copyright now use Midnight Blue on Horizon Blue; the footer wordmark is existing text, so no light logo asset is needed. Home and Resources active state use `aria-current="page"`. The Mission introduction uses a 28px desktop/22px phone heading-to-copy gap and 14px paragraph gaps; figures use 24px reading-flow margins and a 3px Amber rule.

## Latest refinement pass: Mission, CMS, Resources, social links and galleries

### Implementation

- `/mission` is now a full page with its own canonical metadata and sitemap entry. Its narrative, impact figures and closing sections have moved out of About. About retains a short mission link and the `#mission` anchor. Home links directly to `/mission`. Mission has a separate `missionHeroPhoto` field and full-background hero. Navigation and footer place Mission immediately after About.
- Resources at `/books` keeps the featured Build Intelligently workbook first. It now reads published file-per-entry JSON resources from `content/resources/`, sorts by publish date and slug, excludes the stable `build-intelligently` featured slug, validates HTTPS links, and hides the additional section when the collection is empty. The editor path is **Content Manager > Resources > New resource**. Fields: Title, Stable slug, Resource type, Short description, Resource details, Publish date, Picture, Picture alternative text, File, Link, Link label, Checkout link. Editorial Workflow keeps drafts off the production branch.
- Insights keeps existing Article, Video and Podcast entries in `content/insights/`. The collection now labels `notes` as **Additional information** and exposes repeatable **Related links**. Article notes and links render on the detail page; video/podcast notes and links render there beside their Watch/Listen destinations. Podcast notes also appear on the listing. Draft and incomplete records remain excluded by `app/lib/insights.ts` from public lists, details and the sitemap.
- The shared footer renders social icons only for valid HTTPS URLs and collapses the icon row when all fields are empty. Editor path: **Content Manager > Site settings > Site links and photographs > Social links** (Instagram URL, LinkedIn URL, X / Twitter URL, YouTube URL), and **Additional social links** (Platform name, URL). No profile URLs were supplied, so the row is empty.
- Body photo groups are under **Content Manager > Site settings > Site links and photographs**: **Mission photos after impact figures**, **Mission photos after How I contribute**, **About story gallery**, **Speaking workshop photos**, and **Speaking event gallery**. Each repeatable entry has Image, Alternative text, Caption and X/Y crop fields. Existing About chapter photos remain wired to The work kept evolving, What building has taught me, What I believe, and Building and teaching. The new gallery component renders zero photos as no markup, one photo as a single figure, and multiple photos in an ordered responsive grid. All groups are page-specific; Home does not read them.
- The shared header already uses the available owner logo at `public/logo.svg` (`/logo.svg`); this pass retained that approved file. No newer distinct uploaded logo asset was present. Footer uses the text wordmark on the light surface.

### CMS status and repository state

- The deployed/public config keeps the GitHub backend repo `SeamasVincent/my-site-` and branch `main`. These match the configured `origin` and current branch. `public/admin/config.yml` remains **untracked** (`git ls-files` confirms it is not in the index); it has not been committed or deployed, so the deployed branch cannot yet be confirmed to contain the config or latest site changes. The workspace already contained broad uncommitted/untracked site changes, so no commit or deployment was made.
- Development `/admin` points to `/admin/config.local.yml`; its route reads `local/decap-config.yml` only in development and returns 404 in production. The local config enables `local_backend: true`. I verified the development admin and YAML routes return HTTP 200 and the YAML has the local backend flag; the production route returns 404. There is no repository proxy script. `npx decap-server` could not start because the npm cache's `iconv-lite` package is missing `lib/index.js`; port 8081 did not respond, so local editor save was not verified. Repair the npm cache/install and run `npx decap-server` in one terminal with `npm run dev` in another before opening the development editor. Decap documents this local proxy workflow in [Working with a local repository](https://decapcms.org/docs/decap-proxy/) and the [configuration guide](https://decapcms.org/docs/configure-decap-cms/).
- Hosted sign-in remains blocked by `https://YOUR-OAUTH-HOST`. No existing OAuth service URL, GitHub OAuth app client ID/secret, callback registration, or editor account details were available. The owner needs to supply the reachable HTTPS OAuth service and configure the callback/client secret server-side. Public YAML contains no secret. Hosted sign-in, GitHub authorization, and a remote draft save were not tested. The deployed domain could not be reached to check `/admin/config.yml`.

### Checks performed

- `npm run lint`, `npx tsc --noEmit`, and `npm run build` passed after the final code changes.
- The final local production preview returned HTTP 200 for `/`, `/about`, `/mission`, `/speaking`, `/insights`, `/books`, `/contact`, `/admin`, `/admin/config.yml`, and `/sitemap.xml`. `/mission` stayed at that URL and rendered the Mission copy. The sitemap includes `/mission`; the empty Resources section and empty Insights cards are hidden as expected.
- Temporary local fixture entries were added and removed. The populated Resources view showed a cover, a no-cover card, longer details, and separate Download, View resource, and Buy resource links; the sample file returned HTTP 200. A draft resource was absent. One Article, Video and Podcast rendered listing cards and detail pages with thumbnails, summaries, additional information and related links; Watch/Listen hrefs were present. Podcast notes appeared in the listing. A media entry without thumbnail or notes remained usable, and an Insight draft returned 404 and was absent from the sitemap. Test fixtures and the sample download were removed before final build.
- Public CMS YAML returned HTTP 200 with `text/yaml` and parsed successfully; JSON settings and both public and local YAML parsed successfully. Production admin HTML references `/admin/config.yml`; the development admin HTML references `/admin/config.local.yml`.
- Desktop/mobile browser inspection at 375px, 768px and 1440px, populated social icon navigation, selected/failing photo loads, CMS visual editing, and actual hosted deployment/sign-in remain unverified in this environment. Owner-selected photos and profile URLs are still empty. The fallback `public/portrait.jpg` has a white field baked into its pixels; the dark scrim reduces its effect, but the source itself has not been retouched or replaced.
