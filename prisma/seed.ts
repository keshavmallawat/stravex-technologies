import "dotenv/config";
import { prisma } from "../src/lib/prisma";

/**
 * Seeds the admin allowlist from the ADMIN_EMAILS env var (comma-separated).
 * Only emails in this table are allowed to sign in to /admin via Google OAuth.
 * Re-run any time with: npx prisma db seed
 */
async function seedAdminAllowlist() {
  const raw = process.env.ADMIN_EMAILS ?? "";
  const emails = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (emails.length === 0) {
    console.warn(
      "⚠ ADMIN_EMAILS is not set — no one will be able to sign in to /admin. " +
        "Add ADMIN_EMAILS=you@example.com to .env and re-run `npx prisma db seed`."
    );
    return;
  }

  for (const email of emails) {
    await prisma.adminAllowlist.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    console.log(`✓ Admin allowlisted: ${email}`);
  }
}

async function main() {
  await seedAdminAllowlist();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
