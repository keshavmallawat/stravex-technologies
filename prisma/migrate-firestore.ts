/**
 * One-time Firestore -> Prisma legacy content migration.
 *
 * Source: production Firestore project (see FIRESTORE_PROJECT_ID in .env).
 * Collections: `blogs`, `contact_submissions`.
 * Destination: Contact, BlogPost, NewsPost (Prisma / SQLite).
 *
 * Read-only against Firestore at every stage — this script never calls
 * .set()/.update()/.delete() against Firestore, only .get().
 *
 * Every Prisma write is either:
 *   - a `create` for a brand-new record, or
 *   - an `update` scoped to a single row matched by `firestoreId` (or, for
 *     the two confirmed replacement cases below, by the existing row's own
 *     slug), or
 *   - a `findUnique` read used only to decide whether to skip.
 * There is no deleteMany/truncate/reset anywhere in this file, and no
 * write ever touches a row it didn't create or that isn't one of the two
 * explicitly-approved replacement targets.
 *
 * Classification (Blog vs News) and the two duplicate-replacement mappings
 * below were decided through manual, full-content human review in chat —
 * not by an algorithm — and are hardcoded here deliberately, so a rerun
 * can never re-derive a different answer.
 *
 * Modes:
 *   --inspect         Schema + naive classification pass (early exploration).
 *   --review-content  Full content dump used for the human classification
 *                      review. No Prisma writes.
 *   --dry-run         Full read + mapping + report. Zero Prisma writes.
 *   --execute         Same as --dry-run, but actually writes.
 */
import "dotenv/config";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { prisma } from "../src/lib/prisma";

function getDb() {
  if (getApps().length === 0) {
    const projectId = process.env.FIRESTORE_PROJECT_ID;
    const clientEmail = process.env.FIRESTORE_CLIENT_EMAIL;
    const privateKey = process.env.FIRESTORE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing FIRESTORE_PROJECT_ID / FIRESTORE_CLIENT_EMAIL / FIRESTORE_PRIVATE_KEY in .env"
      );
    }

    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }
  return getFirestore();
}

// ---------------------------------------------------------------------------
// Final classification, approved after full-content human review.
// blogs/{docId} -> "blog" | "news"
// ---------------------------------------------------------------------------
const CLASSIFICATION: Record<string, "blog" | "news"> = {
  "0Syhvqwa6gNot7i5HNQx": "news", // No Drones Were Shot Down This Time — DGCD 2026
  "0wfAgUXLhGXVJTzY4L9G": "news", // Kharga Shakti 2026
  "AFI2u8onzuJtXbwiDQhe": "news", // Two Young Founders — StartupbyDOC
  "JR36K7GjnHPCctGJBSBR": "news", // 1.8K Likes Later — StartupG.in
  "Kqc9kNv2aRmD0Wy6Pco0": "news", // Demonstrated Before Southern Command
  "OfE950Meia8OwyJ9rqsF": "news", // Instagram Famous
  "TPPWfWdG9E86QKtDomYD": "news", // Indian-Made AI — ScoopEarth
  "a6qAZwrZTKWXB0NpIeTl": "news", // Geo News Update explainer (resolved ambiguous case)
  "eUTSZ5v7ICexQV86vXI5": "news", // Earns National Recognition — IADN Centre
  "edfkKQdWLs1t74JhHZSi": "news", // Indian Defence News Covers AgniStrike — REPLACEMENT
  "erzC6pLAVRbOcZnLEUEN": "news", // India Just Got Its Own Drone Killer — Venture Talk
  "fcN2SBse4kxzmxI9cPIm": "news", // Border Security — azadsamvad (bilingual)
  "i1KaxjDa96vuHS7Fm9VE": "blog", // The Drone Wars Have Already Begun — the one Blog
  "ke0AMyoNIvaFlIgXS7P9": "news", // BJP4India Posted AgniStrike
  "osu2V6QyG6cQX3C2bVMg": "news", // Others Built Drones — Indian Founders
  "yTBqpsFgFo58ASJ0wMjR": "news", // 10,500 Likes — startup.pedia
  "zt8iVebFFNACSzdXbxEB": "news", // Speed, AI, and a Three-Minute Kill Window — REPLACEMENT
};

// blogs/{docId} -> existing NewsPost.slug it replaces in place (confirmed
// duplicates of the earlier press.ts-seeded placeholders). Slug is preserved
// on update so the existing public URL never changes.
const REPLACEMENTS: Record<string, string> = {
  edfkKQdWLs1t74JhHZSi:
    "stravex-technologies-successfully-completes-army-trials-of-agnistrike-indias-first-indigenous-drone-interceptor",
  zt8iVebFFNACSzdXbxEB:
    "speed-ai-and-a-three-minute-kill-window-meet-stravex-technologies-agnistrike-system",
};

interface InvalidDoc {
  collection: string;
  id: string;
  reason: string;
}
interface ReplacementEntry {
  firestoreId: string;
  existingSlug: string;
  existingTitle: string;
  newTitle: string;
}

async function runMigration(write: boolean) {
  const startedAt = Date.now();
  const db = getDb();
  const migrationId = `migrate-${new Date().toISOString().replace(/[:.]/g, "-")}`;

  const report = {
    migrationId,
    timestamp: new Date().toISOString(),
    firestoreProjectId: process.env.FIRESTORE_PROJECT_ID,
    mode: write ? ("execute" as const) : ("dry-run" as const),
    status: "success" as "success" | "failed",
    durationMs: 0,
    totals: { contactsFound: 0, articlesFound: 0 },
    classification: { blogs: 0, news: 0 },
    planned: {
      contactsCreated: 0,
      contactsSkipped: 0,
      blogsCreated: 0,
      newsCreated: 0,
      newsReplaced: 0,
      duplicatesSkipped: 0,
    },
    replacements: [] as ReplacementEntry[],
    invalidDocuments: [] as InvalidDoc[],
    sampleRecords: [] as Record<string, unknown>[],
  };

  try {
    // --- Contacts ---
    const contactsSnap = await db.collection("contact_submissions").get();
    report.totals.contactsFound = contactsSnap.size;

    for (const doc of contactsSnap.docs) {
      const d = doc.data();
      const name = String(d.name ?? "").trim();
      const email = String(d.email ?? "").trim();
      if (!name || !email) {
        report.invalidDocuments.push({
          collection: "contact_submissions",
          id: doc.id,
          reason: "missing name or email",
        });
        continue;
      }

      const existing = await prisma.contact.findUnique({ where: { firestoreId: doc.id } });
      if (existing) {
        report.planned.contactsSkipped++;
        report.planned.duplicatesSkipped++;
        continue;
      }

      const mapped = {
        firestoreId: doc.id,
        name,
        company: d.company ? String(d.company).trim() || null : null,
        email,
        phone: d.phone ? String(d.phone).trim() || null : null,
        message: String(d.message ?? "").trim(),
        status: "unread",
        createdAt: d.created_at instanceof Timestamp ? d.created_at.toDate() : new Date(),
      };

      if (write) {
        await prisma.contact.create({ data: mapped });
      }
      report.planned.contactsCreated++;
      if (report.sampleRecords.length < 5) {
        report.sampleRecords.push({ type: "contact", ...mapped, createdAt: mapped.createdAt.toISOString() });
      }
    }

    // --- Articles ---
    const blogsSnap = await db.collection("blogs").get();
    report.totals.articlesFound = blogsSnap.size;

    for (const doc of blogsSnap.docs) {
      const d = doc.data();
      const title = String(d.title ?? "").trim();
      const content = String(d.content ?? "");
      if (!title || !content) {
        report.invalidDocuments.push({ collection: "blogs", id: doc.id, reason: "missing title or content" });
        continue;
      }

      const verdict = CLASSIFICATION[doc.id];
      if (!verdict) {
        report.invalidDocuments.push({
          collection: "blogs",
          id: doc.id,
          reason:
            "no classification decision recorded for this document id — unexpected/new document since the review, needs manual review before import",
        });
        continue;
      }
      report.classification[verdict === "blog" ? "blogs" : "news"]++;

      const seo = (d.seo ?? {}) as Record<string, unknown>;
      const mapped = {
        firestoreId: doc.id,
        title,
        slug: String(d.slug ?? "").trim(),
        excerpt: d.excerpt ? String(d.excerpt).trim() || null : null,
        content,
        featuredImageUrl: d.coverImage ? String(d.coverImage) : null,
        tags: (Array.isArray(d.tags) ? d.tags : []) as string[],
        seoTitle: (seo.metaTitle as string) || null,
        seoDescription: (seo.metaDescription as string) || null,
        ogImageUrl: (seo.ogImage as string) || null,
        authorName: (d.author as { name?: string } | undefined)?.name ?? null,
        viewCount: typeof d.views === "number" ? d.views : 0,
        publishedAt: d.publishedAt instanceof Timestamp ? d.publishedAt.toDate() : null,
        status: "published",
      };

      const replaceSlug = REPLACEMENTS[doc.id];
      if (replaceSlug) {
        const existingBySlug = await prisma.newsPost.findUnique({ where: { slug: replaceSlug } });
        if (existingBySlug?.firestoreId === doc.id) {
          // Already adopted in a previous run.
          report.planned.duplicatesSkipped++;
          continue;
        }

        report.replacements.push({
          firestoreId: doc.id,
          existingSlug: replaceSlug,
          existingTitle: existingBySlug?.title ?? "(existing row not found)",
          newTitle: title,
        });

        if (write && existingBySlug) {
          await prisma.newsPost.update({
            where: { slug: replaceSlug },
            data: {
              firestoreId: mapped.firestoreId,
              title: mapped.title,
              // slug intentionally left unchanged — preserves the public URL
              excerpt: mapped.excerpt,
              content: mapped.content,
              featuredImageUrl: mapped.featuredImageUrl,
              tags: mapped.tags as object,
              seoTitle: mapped.seoTitle,
              seoDescription: mapped.seoDescription,
              ogImageUrl: mapped.ogImageUrl,
              authorName: mapped.authorName,
              viewCount: mapped.viewCount,
              publishedAt: mapped.publishedAt,
            },
          });
        }
        report.planned.newsReplaced++;
        continue;
      }

      const existing =
        verdict === "blog"
          ? await prisma.blogPost.findUnique({ where: { firestoreId: doc.id } })
          : await prisma.newsPost.findUnique({ where: { firestoreId: doc.id } });
      if (existing) {
        report.planned.duplicatesSkipped++;
        continue;
      }

      if (write) {
        if (verdict === "blog") {
          await prisma.blogPost.create({ data: { ...mapped, tags: mapped.tags as object } });
        } else {
          await prisma.newsPost.create({ data: { ...mapped, tags: mapped.tags as object } });
        }
      }
      if (verdict === "blog") report.planned.blogsCreated++;
      else report.planned.newsCreated++;

      if (report.sampleRecords.length < 10) {
        report.sampleRecords.push({
          type: verdict,
          ...mapped,
          publishedAt: mapped.publishedAt?.toISOString() ?? null,
        });
      }
    }
  } catch (err) {
    report.status = "failed";
    console.error(err);
  }

  report.durationMs = Date.now() - startedAt;

  const reportsDir = path.join(process.cwd(), "migration-reports");
  await mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `migration-report-${migrationId}.json`);
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log("=".repeat(78));
  console.log(`MIGRATION REPORT (${report.mode.toUpperCase()}) — status: ${report.status}`);
  console.log("=".repeat(78));
  console.log(`Report saved to: ${reportPath}\n`);
  console.log("Source Firestore");
  console.log(`  Contacts:  ${report.totals.contactsFound}`);
  console.log(`  Articles:  ${report.totals.articlesFound}`);
  console.log("\nClassification");
  console.log(`  Blogs:      ${report.classification.blogs}`);
  console.log(`  News:       ${report.classification.news}`);
  console.log(`\nDestination ${write ? "(actual)" : "(expected)"}`);
  console.log(
    `  Contacts: +${report.planned.contactsCreated}  (already-imported, skipped: ${report.planned.contactsSkipped})`
  );
  console.log(`  Blogs:    +${report.planned.blogsCreated}`);
  console.log(
    `  News:     +${report.planned.newsCreated}  (replacing ${report.planned.newsReplaced} existing seeded rows in place)`
  );
  console.log(`  Duplicates skipped (already migrated): ${report.planned.duplicatesSkipped}`);
  console.log(`  Invalid documents (skipped): ${report.invalidDocuments.length}`);
  console.log("=".repeat(78));

  if (report.invalidDocuments.length > 0) {
    console.log("\nInvalid documents:");
    for (const inv of report.invalidDocuments) console.log(`  [${inv.collection}/${inv.id}] ${inv.reason}`);
  }

  if (report.replacements.length > 0) {
    console.log("\nReplacements (existing seeded News rows updated in place, slug preserved):");
    for (const r of report.replacements) {
      console.log(`  [${r.firestoreId}] "${r.newTitle}"`);
      console.log(`    -> replaces existing slug "${r.existingSlug}" (was: "${r.existingTitle}")`);
    }
  }

  if (!write) {
    console.log("\nReady to execute? Re-run with --execute only after this report is reviewed and approved.");
  }

  return report;
}

async function main() {
  const mode = process.argv[2];
  if (mode === "--dry-run") {
    await runMigration(false);
  } else if (mode === "--execute") {
    await runMigration(true);
  } else {
    console.error("Usage: tsx prisma/migrate-firestore.ts --dry-run | --execute");
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
