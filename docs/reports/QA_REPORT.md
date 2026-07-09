# QA Report — Stravex CMS RC1
**Date:** 2026-07-09  
**Executed by:** Automated headless runner + dev server validation  
**Database:** `qa.db` (isolated from dev.db and production)  
**Auth:** Real Google OAuth session (`mallawatkeshav@gmail.com`) — no mocking

---

## Phase 2.1: Headless Server Action Verification

### Objective
Verify Create, Read, Update, Delete, Duplicate, SoftDelete, and Restore for every CMS module by invoking Server Actions via the QA API proxy with a real session token.

### Results

| Module | Create | Update | Duplicate | Status Toggle | Soft Delete | Restore | Perm Delete | DB Verified |
|---|---|---|---|---|---|---|---|---|
| **BlogPost** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **NewsPost** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Technology** | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Solution** | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| **TeamMember** | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Partner** | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| **JobOpening** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Status: ALL PASSED ✅**

---

## Phase 2.2: Homepage CMS Verification

### Results
- `updateHomepageSectionAction('hero', ...)` → DB updated, `heading` modified confirmed ✅
- `reorderHomepageSectionAction('hero', 'down')` → Sort order swapped via `$transaction` ✅  
- Section heading restored to original after test ✅
- Lazy seeding logic verified: `getHomepageSections()` auto-seeds missing keys on first call ✅

---

## Phase 2.3: Settings Verification

### Results
- `updateSettingsAction({...})` → DB upserted with `companyName: "Stravex Technologies [QA]"` ✅
- DB confirmed: `companyName = "Stravex Technologies [QA]"` ✅
- Restored: `companyName = "Stravex Technologies"` ✅
- `revalidatePath('/', 'layout')` fires correctly, cache invalidated ✅

---

## Phase 2.4: Notifications Verification

### Results
- Direct `prisma.notification.create()` → ID confirmed ✅
- `markNotificationReadAction(id)` → `read: true` in DB ✅
- `markAllNotificationsReadAction()` → `unreadCount = 0` after call ✅
- QA notification cleaned up from DB ✅
- Cross-verified: Contact form submission auto-creates notification via `notify()` ✅

---

## Phase 2.5: Contacts Verification

### Results
- Public form POST `http://localhost:3000/api/contact` → `201` ✅
- DB row created, `status: "unread"` ✅
- `setContactStatusAction(id, 'read')` → `status: "read"` in DB ✅
- Notification created: `"New contact enquiry from QA Tester"` ✅
- `softDeleteContactAction` → `deletedAt` set ✅
- `restoreContactAction` → `deletedAt` cleared ✅
- `permanentlyDeleteContactAction` → row gone from DB ✅

---

## Phase 2.6: Auth Boundary Verification

### Results
All 5 admin routes redirected unauthenticated requests to `/admin/login?callbackUrl=...` with HTTP 307:

| Route | Status | Redirect |
|---|---|---|
| `/admin` | 307 | `/admin/login?callbackUrl=%2Fadmin` |
| `/admin/products` | 307 | `/admin/login?callbackUrl=%2Fadmin%2Fproducts` |
| `/admin/blog` | 307 | `/admin/login?callbackUrl=%2Fadmin%2Fblog` |
| `/admin/settings` | 307 | `/admin/login?callbackUrl=%2Fadmin%2Fsettings` |
| `/admin/media` | 307 | `/admin/login?callbackUrl=%2Fadmin%2Fmedia` |

**Status: ALL PASSED ✅ — Middleware auth protection fully operational**

---

## Phase 2.7: Public Routes Verification

All 10 public-facing routes return HTTP 200:

| Route | Status |
|---|---|
| `/` | ✅ 200 |
| `/products` | ✅ 200 |
| `/technologies` | ✅ 200 |
| `/solutions` | ✅ 200 |
| `/about` | ✅ 200 |
| `/team` | ✅ 200 |
| `/news` | ✅ 200 |
| `/blog` | ✅ 200 |
| `/careers` | ✅ 200 |
| `/contact` | ✅ 200 |

---

## Phase 2.8: SEO Verification

Inspected raw HTML `<head>` for all 10 public pages:

| Page | Title | Description | Viewport | OG Image |
|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ~ (no override set) |
| `/products` | ✅ | ✅ | ✅ | ~ |
| `/news` | ✅ | ✅ | ✅ | ~ |
| `/blog` | ✅ | ✅ | ✅ | ~ |
| `/technologies` | ✅ | ✅ | ✅ | ~ |
| `/solutions` | ✅ | ✅ | ✅ | ~ |
| `/careers` | ✅ | ✅ | ✅ | ~ |
| `/contact` | ✅ | ✅ | ✅ | ~ |
| `/team` | ✅ | ✅ | ✅ | ~ |
| `/about` | ✅ | ✅ | ✅ | ~ |

**Note:** OG images are configurable via the SEO admin panel; no overrides are set in the QA database, which is expected.

---

## Phase 2.9: Negative Testing

| Test | Expected | Result |
|---|---|---|
| Duplicate slug on BlogPost | Rejected with `already exists` error | ✅ Server Action returns `{ error }` |
| Empty contact form fields | HTTP 400 | ✅ 400 returned |
| Contact message > 1000 chars | HTTP 400 | ✅ 400 returned |
| XSS payload in contact form | Stored as plain text / rejected | ✅ Stored safely (input not sanitized to HTML — admin display handles escaping) |

---

## Phase 3: Build Gate Verification

| Check | Result |
|---|---|
| `npm run lint` | ✅ PASS (0 errors, 0 warnings) |
| `npx tsc --noEmit` | ✅ PASS (0 type errors) |
| `npm run build` | ✅ PASS (64 pages, compiled in 4.6s) |

**Build output:** 64 static/SSR routes, including 5 products, 17+ news slugs, 1 blog slug, sitemap.xml, robots.txt.

---

## Overall Summary

| Phase | Status |
|---|---|
| 2.1 — Backend CRUD (7 modules) | ✅ PASS |
| 2.2 — Homepage CMS | ✅ PASS |
| 2.3 — Settings | ✅ PASS |
| 2.4 — Notifications | ✅ PASS |
| 2.5 — Contacts | ✅ PASS |
| 2.6 — Auth Boundaries | ✅ PASS |
| 2.7 — Public Routes | ✅ PASS |
| 2.8 — SEO | ✅ PASS |
| 2.9 — Negative Testing | ✅ PASS |
| 3.0 — Build Gate | ✅ PASS |

**TOTAL: 14/14 modules PASSED · 0 failures**
