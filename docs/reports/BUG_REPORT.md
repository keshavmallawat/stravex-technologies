# Bug Report — Stravex CMS RC1

**Date:** 2026-07-09  
**Total Bugs Found:** 2  
**Total Bugs Fixed:** 2  
**Outstanding Bugs:** 0

---

## BUG-001 · MEDIUM · Fixed

**File:** `src/app/admin/(dashboard)/careers/applications/actions.ts`  
**Title:** Non-function export in `"use server"` file caused runtime crash  
**Severity:** MEDIUM (broke QA API proxy; does not affect admin UI directly)

**Root Cause:**  
`APPLICATION_STATUSES` (a `const` array) and `ApplicationStatus` (a `type`) were exported from a `"use server"` file. Next.js enforces that `"use server"` modules may only export async functions — exporting non-async-function values throws `invalid-use-server-value` at runtime, which crashed the entire `/api/qa-runner` proxy when this module was imported.

**Graphify Impact Analysis:**  
Community 4 (Careers + Contacts). Graphify confirmed `APPLICATION_STATUSES` had no callers outside this file. Fix is fully isolated.

**Fix Applied:**  
- Removed the `export` keyword from `APPLICATION_STATUSES` const  
- Replaced `const APPLICATION_STATUSES` + derived type with a direct union type: `export type ApplicationStatus = "new" | "reviewing" | ...`

**Evidence:** Dev server log: `invalid_use_server_value` at `route.ts:13`. Fixed → QA proxy passed.  
**Regression:** None. Only `ApplicationStatus` type consumers exist inside the admin UI, which remains unaffected.

---

## BUG-002 · LOW · Fixed

**File:** `src/app/admin/(dashboard)/careers/applications/actions.ts`  
**Title:** `APPLICATION_STATUSES` const unused after removing export — ESLint warning

**Root Cause:**  
After BUG-001 fix, the `const APPLICATION_STATUSES` was kept private but only used to derive the type via `typeof`. ESLint's `@typescript-eslint/no-unused-vars` flagged it as assigned but never used as a value — causing `npm run lint` to fail with 1 warning (at `--max-warnings=0`).

**Fix Applied:**  
Replaced the array const + derived `typeof` pattern with a direct union type literal. This is cleaner, eliminates the runtime constant entirely, and passes lint clean.

**Evidence:** ESLint output: `'APPLICATION_STATUSES' is assigned a value but only used as a type`. Fixed → `npm run lint` passes with 0 warnings.

---

## Summary

| ID | Severity | Status | Description |
|---|---|---|---|
| BUG-001 | MEDIUM | ✅ FIXED | Non-function export in use server file |
| BUG-002 | LOW | ✅ FIXED | Unused const after BUG-001 fix |
