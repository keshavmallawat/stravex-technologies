# Performance Report — Stravex CMS RC1

**Date:** 2026-07-09

---

## 1. Server Action Latency (Headless, SQLite qa.db)

All Server Action CRUD operations measured via the QA headless runner using real session tokens and the Next.js API proxy.

| Module | Avg Latency | Notes |
|---|---|---|
| BlogPost | < 100ms | Create, Update, SoftDelete, Restore, PermanentDelete all sub-100ms |
| NewsPost | < 100ms | Same as Blog |
| Technology | < 100ms | No duplicate action |
| Solution | < 100ms | No duplicate action |
| TeamMember | < 100ms | No duplicate action |
| Partner | < 100ms | No duplicate action |
| JobOpening | < 100ms | Includes duplicate action |
| HomepageSection | < 50ms | Single row update with `$transaction` |
| SiteSettings | < 50ms | Upsert on singleton row |
| Contact | < 50ms | Simple create |
| Notification | < 20ms | Tiny payload |

All operations under **100ms** on SQLite. Production Turso/PostgreSQL will be faster on simple primary-key lookups due to indexing.

---

## 2. Build Performance

| Metric | Value |
|---|---|
| Next.js version | 16.2.10 (Turbopack) |
| Compile time | 4.6s |
| TypeScript check | 8.4s |
| Static page generation | 1,268ms (64 pages, 19 workers) |
| Total static pages | 64 |
| Dynamic (SSR) routes | ~30 admin routes + 5 API routes |

**Assessment:** Excellent. Build is fast and clean.

---

## 3. Prisma Query Patterns

### Observations (from code audit):
- **God node:** `prisma.ts` has 52 edges — it is the central data access singleton (correct pattern).
- **N+1 risk:** `duplicateProductAction` uses a while-loop with `prisma.product.findUnique` to find an available slug. Mitigated by the fact that slug collisions are rare (max 5 attempts before random suffix fallback).
- **Reorder pattern:** `reorderProductAction`, `reorderHomepageSectionAction`, `reorderTeamMemberAction`, and `reorderPartnerAction` all fetch the entire list to find an index, then swap two rows in a `$transaction`. This is O(n) on list size. Acceptable for current content volumes (<100 items per category), but will degrade beyond 1000+ items.
- **SEO queries:** `getPageSeo()` is called on every public page via `generateMetadata()`. With 21 inbound edges, this is the most-called DB function. It uses `prisma.pageSeo.findUnique({ where: { pageKey } })` — efficiently indexed via unique constraint.

### Missing Indexes Analysis:
- `blogPost.slug` — unique (indexed) ✅
- `newsPost.slug` — unique (indexed) ✅  
- `product.slug` — unique (indexed) ✅
- `technology.slug` — unique (indexed) ✅
- `solution.slug` — unique (indexed) ✅
- `jobOpening.slug` — unique (indexed) ✅
- `contact.status` — not indexed (filtered frequently in admin list) ⚠️ Low priority for current volume
- `notification.read` — not indexed (filtered for unread count) ⚠️ Low priority

### Recommendation:
Add a composite index on `(deletedAt, createdAt DESC)` for all soft-deletable models once record counts exceed 500+ per table. Not blocking for RC1.

---

## 4. Frontend Performance

### Build Route Analysis:
- **Static (○):** `/`, `/about`, `/blog`, `/careers`, `/contact`, `/news`, `/products`, `/solutions`, `/team`, `/technologies`, `/robots.txt`, `/sitemap.xml` — 12 routes fully static
- **SSG (●):** `/blog/[slug]`, `/news/[slug]`, `/products/[slug]` — pre-generated at build time
- **Dynamic (ƒ):** All `/admin/*` routes + API routes — server-rendered on demand

**Assessment:** Excellent public site performance. All user-facing routes are static or ISR. Admin routes correctly remain dynamic.

---

## 5. Pending Tests (Not blocking RC1)

- [ ] Seed 1,000 records and measure paginated list response times
- [ ] Measure Time to First Byte on production deployment
- [ ] Lighthouse score on public homepage

---

## Summary

**No critical performance issues found.** The architecture is well-suited for current content volumes. Soft-delete filter patterns and reorder algorithms are the only items to watch as content scales.
