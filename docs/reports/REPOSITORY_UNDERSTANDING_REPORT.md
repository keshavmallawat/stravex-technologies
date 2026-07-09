# Stravex Website — Repository Understanding Report
_Generated: 2026-07-08 | Graphify: 685 nodes · 1547 edges · 30 communities | Commit: 4ebba4e3_

---

## 1. High-Level Architecture

The Stravex website is a **full-stack Next.js 16 monolith** using the App Router (Server Components + Server Actions), deployed on Hostinger with persistent Node hosting. It combines a publicly-facing marketing site with a fully-featured headless CMS admin dashboard — all in a single codebase with no API layer separating them.

**Key design decisions:**
- **No REST API for the CMS** — admin operations use Next.js Server Actions directly.
- **Single database** — SQLite in dev/staging, swappable to Postgres by changing `datasource provider` + `DATABASE_URL` in `schema.prisma` only.
- **Cloudinary for all media** — uploaded media is stored on Cloudinary; the DB stores only the URL + metadata.
- **NextAuth v5** (auth.js) with Google OAuth + an `AdminAllowlist` table for access control.
- **Tailwind CSS v4** (`@import "tailwindcss"`) with custom brand tokens in `globals.css`.
- **Framer Motion** for animations; **Tiptap** for rich text editing; **Phosphor Icons** throughout.

```
┌──────────────────────────────────────────────────────────────────┐
│                         NEXT.JS 16 APP                            │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
│  │   Public Site (SSR/SSG) │  │    Admin CMS (SSR + Actions) │  │
│  │  /app/(site)/           │  │   /app/admin/                │  │
│  └──────────┬──────────────┘  └──────────────┬───────────────┘  │
│             └──────────┬─────────────────────┘                   │
│                        │                                         │
│              ┌─────────▼──────────┐                              │
│              │   Data Layer       │                              │
│              │  /src/lib/*.ts     │                              │
│              └─────────┬──────────┘                              │
│              ┌─────────▼──────────┐                              │
│              │   Prisma ORM       │                              │
│              │  (SQLite / Pg)     │                              │
│              └─────────┬──────────┘                              │
└────────────────────────┼─────────────────────────────────────────┘
                         │
              ┌──────────▼──────────┐
              │   External Services │
              │  Cloudinary (media) │
              │  Google OAuth       │
              └─────────────────────┘
```

---

## 2. Folder Responsibilities

```
stravex-website/
├── prisma/
│   ├── schema.prisma          ← Complete data model (ALL entities)
│   └── migrations/            ← SQL migration history (SQLite DDL)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← Root layout: fonts (Inter + IBM Plex Mono)
│   │   ├── globals.css        ← Tailwind v4 + brand CSS custom properties
│   │   ├── (site)/            ← Public-facing marketing pages (route group)
│   │   │   ├── layout.tsx     ← Site layout: Nav + Footer (injects SiteSettings)
│   │   │   ├── page.tsx       ← Homepage
│   │   │   ├── about/         ← About page (Partners, Team, timeline)
│   │   │   ├── blog/          ← Blog listing + [slug] detail
│   │   │   ├── news/          ← News listing + [slug] detail
│   │   │   ├── products/      ← Products listing + [slug] detail view
│   │   │   ├── solutions/     ← Solutions listing (DB-driven)
│   │   │   ├── technologies/  ← Technologies listing (DB-driven)
│   │   │   ├── team/          ← Team member listing
│   │   │   ├── careers/       ← Job listings + /apply page
│   │   │   └── contact/       ← Contact page (ContactForm)
│   │   │
│   │   ├── admin/
│   │   │   ├── login/         ← Google OAuth sign-in page
│   │   │   ├── (dashboard)/   ← Admin route group (layout enforces auth)
│   │   │   │   ├── layout.tsx ← Admin shell: auth check + AdminShell wrapper
│   │   │   │   ├── page.tsx   ← Dashboard overview (stats + recent activity)
│   │   │   │   ├── products/  ← Products CMS (list, [id] edit, blocks-actions.ts)
│   │   │   │   ├── homepage/  ← Homepage section editor
│   │   │   │   ├── blog/      ← Blog CMS (list, new, [id] edit)
│   │   │   │   ├── news/      ← News CMS (list, new, [id] edit)
│   │   │   │   ├── contacts/  ← Contact enquiries manager
│   │   │   │   ├── careers/   ← Jobs + Applications (tabbed)
│   │   │   │   │   ├── openings/    ← Job openings CRUD
│   │   │   │   │   └── applications/ ← Application manager
│   │   │   │   ├── team/      ← Team members CRUD
│   │   │   │   ├── partners/  ← Partners CRUD
│   │   │   │   ├── technologies/ ← Technologies + Solutions CRUD (tabbed)
│   │   │   │   ├── seo/       ← Per-page SEO overrides
│   │   │   │   ├── media/     ← Media Library (Cloudinary-backed)
│   │   │   │   ├── settings/  ← Site-wide settings (singleton)
│   │   │   │   └── notifications-actions.ts
│   │   │   └── preview/       ← Auth-protected preview (no admin chrome)
│   │   │       ├── layout.tsx ← Auth check, no shell
│   │   │       ├── products/  ← Product preview by DB id
│   │   │       ├── blog/      ← Blog preview by DB id
│   │   │       └── news/      ← News preview by DB id
│   │   │
│   │   └── api/
│   │       ├── auth/          ← NextAuth handler
│   │       ├── contact/       ← POST /api/contact (public form)
│   │       ├── careers/apply/ ← POST /api/careers/apply (resume upload)
│   │       └── admin/
│   │           ├── media/     ← GET /api/admin/media (media library JSON)
│   │           └── contacts/export/ ← CSV/XLSX export
│   │
│   ├── components/
│   │   ├── nav.tsx            ← Sticky header nav (client, framer-motion)
│   │   ├── footer.tsx         ← Footer (server, pulls products list)
│   │   ├── logo.tsx           ← Wordmark (light/dark variants)
│   │   ├── section.tsx        ← Section + SectionHeading layout primitives
│   │   ├── container.tsx      ← Max-width container
│   │   ├── badge.tsx          ← StatusBadge, EyebrowBadge, PlaceholderNote
│   │   ├── button-link.tsx    ← ButtonLink (primary/ghost/ghostLight)
│   │   ├── media-frame.tsx    ← Image placeholder / real image frame
│   │   ├── reveal.tsx         ← RevealGroup/RevealItem/FadeIn (framer-motion)
│   │   ├── product-card.tsx   ← Product card (dark-night themed)
│   │   ├── contact-form.tsx   ← Contact form (client)
│   │   ├── career-application-form.tsx ← Application form (client)
│   │   ├── product/           ← Product detail components
│   │   │   ├── product-detail-view.tsx ← Main product page orchestrator
│   │   │   ├── block-renderer.tsx      ← Renders ProductContentBlocks
│   │   │   ├── motif-backdrop.tsx      ← Decorative animated backdrop
│   │   │   └── workflow.tsx            ← Workflow stage display
│   │   ├── blog/              ← Blog post detail view
│   │   ├── news/              ← News post detail view
│   │   └── admin/             ← Admin-only components
│   │       ├── admin-shell.tsx        ← Sidebar nav wrapper
│   │       ├── notifications-bell.tsx ← Notification dropdown
│   │       ├── products/              ← Products admin components
│   │       │   ├── products-table.tsx
│   │       │   ├── product-form.tsx
│   │       │   ├── block-editor.tsx
│   │       │   ├── field-editors.tsx
│   │       │   ├── gallery-editor.tsx
│   │       │   └── media-picker-field.tsx  ← Cross-community bridge node
│   │       ├── content/               ← Shared blog+news components
│   │       │   ├── content-post-form.tsx
│   │       │   ├── list-toolbar.tsx
│   │       │   └── rich-text-editor.tsx (Tiptap)
│   │       ├── blog/blog-table.tsx
│   │       ├── media/media-library-client.tsx
│   │       ├── settings/settings-form.tsx
│   │       ├── homepage/homepage-section-card.tsx
│   │       ├── seo/page-seo-card.tsx
│   │       ├── team/team-table.tsx
│   │       ├── partners/partner-form.tsx, partners-table.tsx
│   │       ├── careers/job-openings-table.tsx, applications-table.tsx
│   │       └── contacts/contacts-table.tsx
│   │
│   ├── lib/                   ← Data access + shared utilities
│   │   ├── prisma.ts          ← Singleton Prisma client
│   │   ├── products-data.ts   ← Product queries + PublicProduct interface
│   │   ├── blog-data.ts       ← Blog queries
│   │   ├── news-data.ts       ← News queries
│   │   ├── homepage-data.ts   ← HomepageSection seeding + queries
│   │   ├── settings-data.ts   ← SiteSettings queries + NavLinkEntry
│   │   ├── seo-data.ts        ← PageSeo queries + applySeoOverride()
│   │   ├── technologies-data.ts ← Technology queries
│   │   ├── solutions-data.ts  ← Solution queries
│   │   ├── team-data.ts       ← TeamMember queries
│   │   ├── partners-data.ts   ← Partner queries
│   │   ├── careers-data.ts    ← JobOpening + Application queries
│   │   ├── cloudinary.ts      ← Upload/replace/delete Cloudinary wrappers
│   │   ├── media.ts           ← MEDIA_CATEGORIES, MIME types, sanitize
│   │   ├── notifications.ts   ← notify() helper
│   │   ├── export.ts          ← CSV/Excel export utilities
│   │   ├── format-date.ts     ← Deterministic IST date formatting
│   │   ├── slug.ts            ← slugify() utility
│   │   ├── product-types.ts   ← ProductFormValues, WorkflowStage, TechnicalSpec
│   │   ├── product-block-types.ts ← BlockType, BlockContent union types (12 block types)
│   │   ├── content-post-types.ts  ← ContentPostFormValues, ContentStatus
│   │   ├── settings-types.ts  ← SettingsFormValues
│   │   ├── team-types.ts      ← TeamMemberFormValues
│   │   ├── partner-types.ts   ← PartnerFormValues
│   │   ├── technology-types.ts ← TechnologyFormValues, SolutionFormValues
│   │   └── job-opening-types.ts ← JobOpeningFormValues
│   │
│   ├── auth.ts                ← NextAuth v5 config (Google + Prisma adapter)
│   ├── data/                  ← Static/semi-static data files (mostly legacy)
│   │   ├── admin-nav.ts       ← adminNavItems array (LIVE - used by AdminShell)
│   │   ├── nav.ts, careers.ts, contact.ts, press.ts, solutions.ts, technologies.ts
│   └── proxy.ts               ← Hostinger proxy/middleware helper
│
├── public/
│   ├── brand/                 ← Logo assets
│   └── uploads/resumes/       ← Local resume upload destination
│
└── graphify-out/              ← Knowledge graph (not committed)
    ├── graph.json             ← 685-node, 1547-edge knowledge graph
    ├── graph.html             ← Interactive force-directed visualization
    ├── GRAPH_TREE.html        ← D3 collapsible tree visualization
    └── GRAPH_REPORT.md        ← Community analysis + god nodes
```

---

## 3. Module Dependency Graph (30 Communities)

| Community | Key Nodes | Role |
|-----------|-----------|------|
| 0 | `AboutPage`, `Section`, `FadeIn`, `RevealGroup`, `MediaFrame`, `ButtonLink`, `getPageSeo`, `applySeoOverride` | Public site UI + SEO primitives |
| 1 | Blog/News actions, `ContentPostForm`, `notify()`, `createBlogPostAction` | Blog + News editing pipeline |
| 2 | Product form/types, `slugify()`, `TagListEditor`, `WorkflowStage`, `SolutionFormValues` | Products Admin + Solutions editing |
| 3 | Homepage actions, SEO actions, `MediaPickerField`, `HomepageItem` | Homepage + SEO editors |
| 4 | Contact actions, Application actions, `ContactStatus`, `ApplicationStatus` | Inbox management |
| 5 | Job opening actions/form/table, `JobOpeningFormValues` | Job openings pipeline |
| 6 | `auth.ts`, `AdminShell`, notifications bell, login page, `proxy.ts` | Auth + navigation shell |
| 7 | Settings actions/form, `getSiteSettings`, `Logo`, `Footer`, site layout | Site-wide config |
| 8 | `cloudinary.ts`, media actions, `MediaLibraryClient`, `/api/careers/apply` | Upload pipeline |
| 9 | `BlockEditor`, `BlockRenderer`, block type definitions | Block-based content system |
| 10 | Partner CRUD actions, `partner-types.ts` | Partners section |
| 11 | Team CRUD actions, `team-types.ts` | Team section |
| 12 | `ProductDetailPage`, `ProductDetailView`, `getPublishedProducts`, Technologies | Product public display |
| 13 | Product server actions (create/update/delete/reorder) | Product write operations |
| 14 | `BlogPage`, `BlogPostPage`, `BlogPostView`, blog data functions | Blog public display |
| 15 | `NewsPage`, `NewsPostPage`, `NewsPostView`, news data functions | News public display |
| 16 | Migration SQL files | Schema migrations |
| 17 | `migrateFoundersToTeam`, `migratePressToNews`, etc. | One-time data migrations |

**Cross-community bridges (high betweenness centrality):**
- `MediaPickerField` — bridges Communities 3, 1, 2, 7, 9, 10, 11 (used in ALL admin forms)
- `slugify()` — bridges Communities 2, 1, 5
- `getSiteSettings()` — bridges Communities 7, 0

---

## 4. Data Flow

**Public site request:**
```
User Request → Server Component (app/(site)/*) → Data Access Function (src/lib/*-data.ts) → Prisma → SQLite → Public* interface → JSX/HTML
```

**Admin edit (Server Action):**
```
Client Form Submit → Server Action (actions.ts) → auth() check → prisma.model.update() → revalidatePath() → [optional: notify()]
```

**Contact/Career form (API Route):**
```
Client POST → /api/contact or /api/careers/apply → Validate → prisma.create() → notify()
```

---

## 5. Authentication Flow

```
1. User navigates to /admin/*
2. layout.tsx calls auth() → if no session → redirect("/admin/login")
3. /admin/login renders Google sign-in button
4. Google OAuth callback → NextAuth creates/updates User in DB
5. NextAuth checks prisma.adminAllowlist for user email
6. If in allowlist → session created → user accesses /admin
7. Every server action independently calls auth() + checks session?.user
```

**Double-enforced:** Auth is checked at the layout AND in every individual server action. No server action trusts the layout's session check alone.

---

## 6. Request Lifecycle

**SSR public page (`/products/[slug]`):**
- `generateMetadata()`: `getPublishedProductBySlug(slug)` + `getPageSeo(...)`
- `default export`: 5 parallel queries via `Promise.all([getRelatedProducts, getPublishedTechnologies, getProductContentBlocks])`
- `ProductDetailView` renders server HTML → sent to client

**Admin form save (Server Action):**
- `updateProductAction(id, values)` → auth check → `prisma.product.update()` → `revalidatePath()` → `{ success: true }`

**Contact submission (API Route):**
- `POST /api/contact` → validate → `prisma.contact.create()` → `notify()` → 201

---

## 7. Database Relationships

```
User ──── Account, Session, VerificationToken (NextAuth tables)
     ──── authorId on: Product, BlogPost, NewsPost, TeamMember, Partner, Technology, Solution, JobOpening
     ──── uploadedById on: MediaAsset

Product ──── ProductContentBlock (sortOrder, type, content JSON)
JobOpening ──── CareerApplication (optional FK; general applications allowed)

Standalone singletons/collections:
  AdminAllowlist (email whitelist)
  HomepageSection (key-based, lazy-seeded)
  SiteSettings (id="singleton", lazy-seeded)
  PageSeo (pageKey-based)
  Contact (enquiry inbox)
  Notification (activity feed)
```

**JSONB fields:** Product (`designGoals`, `workflow`, `coreCapabilities`, `keyFeatures`, `technicalSpecs`, `applications`, `relatedTechnologies`, `extraFeatureLists`, `galleryUrls`, `relatedProductSlugs`), HomepageSection (`content`, `mediaUrls`), SiteSettings (`addressLines`, `socialLinks`, `navLinks`, `analyticsIds`).

**Soft delete:** `deletedAt` on Product, BlogPost, NewsPost, TeamMember, Partner, Technology, Solution, JobOpening, CareerApplication, Contact.

---

## 8. Public Page Rendering Flow

All public pages are **Next.js Server Components** — no client-side data fetching.

| Route | Data Fetched | SEO Source |
|-------|-------------|-----------|
| `/` | `getEnabledHomepageSections()`, `getPublishedProducts()`, `getPublishedNewsPosts()` | `getPageSeo("home")` |
| `/about` | `getActivePartners()`, `getActiveTeamMembers()`, `getSiteSettings()` | `getPageSeo("about")` |
| `/products` | `getPublishedProducts()` | `getPageSeo("products")` |
| `/products/[slug]` | 5 parallel queries (product, related, technologies, blocks) | `product.seoTitle/seoDescription` |
| `/blog` | `getPublishedBlogPosts()` | `getPageSeo("blog")` |
| `/blog/[slug]` | `getPublishedBlogPostBySlug()` | `post.seoTitle/seoDescription` |
| `/news` | `getPublishedNewsPosts()` | `getPageSeo("news")` |
| `/news/[slug]` | `getPublishedNewsPostBySlug()` | `post.seoTitle/seoDescription` |
| `/team` | `getPublishedTeamMembers()` | `getPageSeo("team")` |
| `/careers` | `getPublishedJobOpenings()` | `getPageSeo("careers")` |
| `/solutions` | `getPublishedSolutions()` | `getPageSeo("solutions")` |
| `/technologies` | `getPublishedTechnologies()` | `getPageSeo("technologies")` |
| `/contact` | `getSiteSettings()` | `getPageSeo("contact")` |

---

## 9. Admin Workflow

```
List Page (server) → fetches records → renders Client table component
  → table inline actions: Edit | Status | Archive | Delete

Edit Page (server) → fetches single record → renders form (Client Component)
  → form calls Server Action → auth check → prisma update → revalidatePath → toast

New Page (server) → blank form → createXAction → redirect to /[id]

Preview (/admin/preview/*/[id]) → auth-only layout → public-facing view with draft data
```

- **Reorder:** `reorderXAction(id, "up"|"down")` swaps `sortOrder` in a `$transaction`
- **Blog/News:** Tiptap rich text (HTML in `content` field)
- **Products:** Block-based system (`ProductContentBlock` table, 12 block types)

---

## 10. Media Upload Workflow

```
Admin selects file → uploadMediaAction(formData) [Server Action]
  → auth() + MIME check + 15MB check + sanitizeFilename()
  → uploadToCloudinary(buffer, category, mimeType, hint)
      → uploads to CATEGORY_FOLDERS[category] in Cloudinary
  → prisma.mediaAsset.create({ url, cloudinaryPublicId, width, height, ... })
  → revalidatePath("/admin/media")
  → returns { asset }
```

> ⚠️ **EXCEPTION:** Resume uploads (`/api/careers/apply`) use `fs/promises writeFile` to `public/uploads/resumes/` — NOT Cloudinary. Resumes are publicly accessible via URL and will be lost on container redeploy. This is the only local filesystem writer in the codebase.

---

## 11. Notification Workflow

```
Event occurs (contact form, application, blog publish)
  → notify({ type, message, linkHref }) [src/lib/notifications.ts]
  → prisma.notification.create({ type, message, linkHref, read: false })

Admin views /admin
  → getRecentNotifications() → last 10 + unread count
  → markNotificationReadAction(id) or markAllNotificationsReadAction()
  → revalidatePath("/admin", "layout")
```

**Notification types:** `new_contact`, `new_application`, `blog_published`, `news_published`
**No real-time push** — poll-on-navigate only.

---

## 12. SEO Pipeline

```
generateMetadata() on each public page
  → getPageSeo(pageKey) → prisma.pageSeo.findUnique({ where: { pageKey } })
  → applySeoOverride(override, fallback) merges:
      title, metaDescription, ogImageUrl, canonicalUrl, robots
  → returns Next.js Metadata object
```

**God nodes:** `getPageSeo()` and `applySeoOverride()` each have **21 edges** — called on every public page. Any bug here breaks all metadata site-wide.

---

## 13. Preview Pipeline

```
/admin/preview/products/[id]  (also blog, news)
  → preview/layout.tsx: auth() only, no admin chrome
  → getProductByIdForPreview(id) — fetches by DB id, ignores status/deletedAt
  → renders same public-facing view (ProductDetailView, BlogPostView, NewsPostView)
```

No draft watermark added. Preview is authenticated-only.

---

## 14. Knowledge Graph Summary

**Graphify v0.9.10 output (AST extraction, code-only, no LLM):**
- **685 nodes** · **1547 edges** · **30 communities**
- **0 import cycles detected** ✅
- **131 isolated nodes** (≤1 connection) — mostly inline constants within public page files
- `schema.prisma` was NOT parsed (unsupported extension by Graphify's AST engine)
- Resume uploads, Cloudinary integration, and migration scripts all correctly identified

---

## 15. God Nodes

| Rank | Node | Edges | Risk |
|------|------|-------|------|
| 1 | `getPageSeo()` | 21 | 🔴 HIGH — bug breaks all page metadata |
| 2 | `applySeoOverride()` | 21 | 🔴 HIGH — same |
| 3 | `Section()` | 16 | 🟡 MEDIUM — layout primitive, visual-wide |
| 4 | `FadeIn()` | 15 | 🟢 LOW — animation only |
| 5 | `getPublishedProducts()` | 14 | 🔴 HIGH — homepage + footer + products page + dashboard |
| 6 | `slugify()` | 14 | 🟡 MEDIUM — slug generation |
| 7 | `formatDate()` | 13 | 🟢 LOW — display only |
| 8 | `ButtonLink()` | 12 | 🟢 LOW — UI primitive |
| 9 | `RevealGroup()` | 12 | 🟢 LOW — animation |
| 10 | `RevealItem()` | 12 | 🟢 LOW — animation |

**Bridge node:** `MediaPickerField` — highest betweenness centrality, bridges 6 admin communities. Changes break ALL admin forms simultaneously.

---

## 16. Surprising Cross-Module Relationships

1. **`AboutPage` calls `getActivePartners()`** — About page is one of the heaviest data-fetching public pages (team + partners + settings).
2. **Footer independently fetches `getPublishedProducts()`** — a product query runs on EVERY page load (via site layout → footer).
3. **`ContactPage` calls `getSiteSettings()`** — duplicate DB query; site layout already fetches settings.
4. **`MediaPickerField` bridges 6 admin communities** — a UI component is the single most cross-cutting node in the admin system.
5. **`notify()` in Community 1 (Blog)** — but called from careers API, contact API, blog, and news. It's shared infrastructure misplaced in the graph community.
6. **Resume uploads to local disk** — `/api/careers/apply` is the only file that uses `fs/promises`. Everything else goes through Cloudinary.
7. **Migration scripts in `prisma/`** — `migrateFoundersToTeam`, `migratePressToNews`, `migrateTechnologiesAndSolutions` are one-time scripts that live in the codebase.

---

## 17. Dead Code

| File | Status |
|------|--------|
| `src/data/careers.ts` | Likely dead — system uses `JobOpening` DB model |
| `src/data/press.ts` | Likely dead — system uses `NewsPost` DB model |
| `src/data/solutions.ts` | Likely dead — system uses `Solution` DB model |
| `src/data/technologies.ts` | Likely dead — system uses `Technology` DB model |
| `src/data/contact.ts` | Likely dead — live data from `SiteSettings` |
| `src/data/nav.ts` | Verify — live nav from `SiteSettings.navLinks`; may be a fallback |
| 131 isolated graph nodes | In-file constants; used locally, not exported |

---

## 18. Duplicate Logic

1. **`toData()` helpers** — local mapper in every `actions.ts` file (10+ copies).
2. **Soft delete + restore + hard delete** — identical pattern across 10 models.
3. **`reorderXAction`** — swap-by-sortOrder in a transaction, repeated 6 times.
4. **`await auth()` guard** — copy-pasted into every server action (~20 files).
5. **`getPageSeo` + `applySeoOverride`** — same call in every `generateMetadata` (intentional, not harmful).
6. **Duplicate `getSiteSettings()`** — called in both site layout AND contact page.

---

## 19. Technical Debt

| Severity | Issue | Location |
|----------|-------|----------|
| 🔴 HIGH | Resumes on local filesystem — lost on redeploy | `/api/careers/apply/route.ts` |
| 🔴 HIGH | `schema.prisma` not parsed by Graphify graph | `prisma/schema.prisma` |
| 🟡 MED | 5+ legacy static data files in `src/data/` | `src/data/` |
| 🟡 MED | Duplicate `getSiteSettings()` per contact page | `contact/page.tsx` |
| 🟡 MED | No real-time notifications (poll-only) | `notifications-bell.tsx` |
| 🟡 MED | Graphify community names are "Community N" — not semantic | `graphify-out/GRAPH_REPORT.md` |
| 🟡 MED | `public/uploads/resumes/` — resume files publicly accessible by URL | `/public/uploads/` |
| 🟢 LOW | `toData()` duplicated across 10+ action files | All `actions.ts` |
| 🟢 LOW | Reorder logic duplicated 6 times | Action files |
| 🟢 LOW | No draft watermark on preview | Admin preview pages |
| 🟢 LOW | Footer fetches products on every page | `footer.tsx` |
| 🟢 LOW | `format-date.ts` hardcodes `Asia/Kolkata` | `src/lib/format-date.ts` |

---

## 20. Refactoring Opportunities

1. **Move resume uploads to Cloudinary** — eliminate local filesystem dependency.
2. **`withAdminAuth(action)` HOF** — eliminate 20+ copy-pasted auth guards.
3. **Generic `reorderAction(model, id, direction)` utility** — eliminate 6x duplication.
4. **Extract `softDelete/restore/permanentDelete` utilities** — eliminate 10x duplication.
5. **Cache `getPublishedProducts()`** — use `unstable_cache` with a products tag for footer.
6. **Clean up `src/data/` legacy files** — remove superseded static data files.
7. **Add `GEMINI_API_KEY` to `.env` and re-run Graphify** — enables semantic edge extraction and proper community naming.

---

## 21. Performance Bottlenecks

1. **Footer fetches products on every page** — runs a DB query on every public page via site layout.
2. **Homepage fetches 3 data sources** — check if `Promise.all()` is used (if serial, fix it).
3. **No ISR configured** — all public pages appear to be SSR. For a marketing site, ISR would dramatically improve performance.
4. **`SiteSettings` lazy seeding** — `findUnique` + potential `create` on cold start.
5. **SQLite write serialization** — acceptable for low-write marketing site, but migrate to Postgres before concurrent admin use.

---

## 22. Security Observations

| Risk | Description | File |
|------|-------------|------|
| ✅ SAFE | Server actions independently verify auth | All `actions.ts` |
| ✅ SAFE | `isAllowedMimeType()` validates uploads | `lib/media.ts` |
| ✅ SAFE | 15MB cap enforced before buffer allocation | `lib/media.ts` |
| ✅ SAFE | `sanitizeFilename()` for all file naming | `lib/media.ts` |
| ✅ SAFE | Contact form validates + 1000-char cap | `/api/contact/route.ts` |
| ✅ SAFE | Resume API validates MIME + 5MB cap | `/api/careers/apply/route.ts` |
| ⚠️ WATCH | `/api/admin/media` only checks `session?.user`, not allowlist | `api/admin/media/route.ts` |
| ⚠️ WATCH | `AUTH_SECRET` required in prod — verify it's set | `.env` |
| ⚠️ WATCH | Credentials in `.env`, not `.env.local` — ensure `.env` is gitignored | `.env` |
| 🔴 NOTE | Resume files publicly accessible at `/uploads/resumes/[filename]` | Careers apply |

---

## 23. Files That Require Extra Caution Before Editing

| File | Reason |
|------|--------|
| `src/lib/prisma.ts` | Entire app depends on this singleton |
| `src/lib/seo-data.ts` | 21 edges each on `getPageSeo` + `applySeoOverride` — all pages |
| `src/auth.ts` | NextAuth config — breaks all admin auth if misconfigured |
| `src/app/(site)/layout.tsx` | Injects settings into Nav + Footer — affects every public page |
| `src/app/admin/(dashboard)/layout.tsx` | Admin auth gate — must keep `auth()` call intact |
| `src/components/admin/products/media-picker-field.tsx` | Bridges 6 communities — changes break ALL admin forms |
| `src/lib/products-data.ts` | `getPublishedProducts()` called from homepage, footer, products, admin |
| `src/lib/settings-data.ts` | `getSiteSettings()` called from layout (every page) |
| `src/lib/homepage-data.ts` | Lazy seeding logic — auto-seeds new sections if missing |
| `src/lib/cloudinary.ts` | Entire media pipeline |
| `prisma/schema.prisma` | Any change requires migration + Prisma regeneration |
| `src/app/globals.css` | Brand CSS tokens — visual changes are site-wide |
| `src/components/section.tsx` | Layout primitive on all public pages |
| `src/components/reveal.tsx` | Animation primitives on all pages |

---

## 24. Suggested Reading Order for Future AI Sessions

1. `prisma/schema.prisma` — ALL data models (ground truth)
2. `src/lib/prisma.ts` — singleton DB client
3. `src/auth.ts` — authentication config
4. `src/app/layout.tsx` — root layout (fonts, global metadata)
5. `src/app/(site)/layout.tsx` — public site layout
6. `src/app/(site)/page.tsx` — homepage
7. `src/lib/settings-data.ts` — site-wide config shape
8. `src/lib/seo-data.ts` — SEO pipeline (god nodes)
9. `src/lib/products-data.ts` — most referenced data module
10. `src/app/admin/(dashboard)/layout.tsx` — admin auth gate
11. `src/data/admin-nav.ts` — full map of CMS modules
12. `src/app/admin/(dashboard)/products/actions.ts` — archetypal server action pattern
13. `src/components/admin/products/media-picker-field.tsx` — cross-cutting bridge node
14. `src/lib/cloudinary.ts` — media pipeline
15. `src/lib/homepage-data.ts` — seeding + section rendering logic
16. `src/lib/product-block-types.ts` — block content system types
17. `src/components/product/product-detail-view.tsx` — most complex public component
18. `src/app/api/contact/route.ts` — archetypal API route pattern
19. `src/app/api/careers/apply/route.ts` — only local filesystem writer
20. `graphify-out/GRAPH_REPORT.md` — community map + god nodes

---

## Phase 5 — Knowledge Persistence

Before modifying any code in future sessions:

1. Consult sections 15, 23, and 24 of this report.
2. Query the graph: `graphify query "<question>" --graph graphify-out/graph.json`
3. Check affected nodes: `graphify affected "<node>" --graph graphify-out/graph.json --depth 3`
4. If code has changed since graph build: `graphify update .` (no API cost, AST-only)

**Constraints:**
- DO NOT redesign, rewrite, or replace technologies
- CMS architecture unchanged unless a bug requires it
- SQLite → Postgres: change `datasource provider` + `DATABASE_URL` only
- Goal: **finish the project**, not restart it

---
_Produced by Antigravity using Graphify v0.9.10 + direct source code analysis._
_Graphify artifacts: `graphify-out/graph.json` · `graphify-out/graph.html` · `graphify-out/GRAPH_TREE.html` · `graphify-out/GRAPH_REPORT.md`_
