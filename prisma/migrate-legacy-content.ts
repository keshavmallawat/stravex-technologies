/**
 * One-off, idempotent migration of the only real pre-existing content in
 * this project into the new CMS tables. Safe to rerun (upserts by a natural
 * unique key each time). See prisma/seed-products.ts for the equivalent
 * one-time Products migration, already run separately.
 *
 * Currently migrates:
 *   - The 3 real press mentions in src/data/press.ts -> NewsPost
 *   - The 3 real founders (previously hardcoded on the Team page) -> TeamMember
 *   - The 2 real incubators (previously hardcoded on About/Team pages) -> Partner
 *   - The 4 real technologies + 6 real solutions (previously hardcoded) -> Technology / Solution
 *
 * Not migrated (nothing real exists to migrate): Contact submissions, Blog
 * posts.
 */
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/slug";
import { pressItems } from "../src/data/press";
import { technologies } from "../src/data/technologies";
import { solutions } from "../src/data/solutions";

const founders = [
  {
    name: "Krishna Mallawat",
    role: "CEO & Co-founder",
    department: "Leadership",
    bio: "Drives Stravex's development of indigenous defence technologies spanning electronics, embedded systems, AI/ML, and autonomous systems — engineering solutions built around national security, operational readiness, and technological self-reliance.",
    expertiseTags: ["Electronics", "Embedded Systems", "AI & ML", "Defence Systems"],
    sortOrder: 0,
  },
  {
    name: "Atharva Dalvi",
    role: "CTO & Co-founder",
    department: "Technology",
    bio: "Leads Stravex's technical vision — advanced hardware, embedded technologies, AI-powered systems, and next-generation UAV platforms for defence applications.",
    expertiseTags: ["Hardware Design", "AI & ML", "IoT", "Embedded Systems"],
    sortOrder: 1,
  },
  {
    name: "Harsh Patil",
    role: "COO & Co-founder",
    department: "Operations",
    bio: "Leads operations from concept to deployment, ensuring Stravex systems are engineered, manufactured, validated, and deployed with reliability, precision, and operational excellence.",
    expertiseTags: ["Drone Systems Engineering", "Control Systems", "Hardware Design", "System Integration"],
    sortOrder: 2,
  },
];

async function migrateFoundersToTeam() {
  for (const founder of founders) {
    const existing = await prisma.teamMember.findFirst({ where: { name: founder.name } });
    if (existing) {
      console.log(`Skipped (already exists) -> TeamMember: ${founder.name}`);
      continue;
    }
    await prisma.teamMember.create({
      data: {
        name: founder.name,
        role: founder.role,
        department: founder.department,
        bio: founder.bio,
        expertiseTags: founder.expertiseTags as object,
        status: "published",
        sortOrder: founder.sortOrder,
      },
    });
    console.log(`Migrated founder -> TeamMember: ${founder.name}`);
  }
}

async function migratePressToNews() {
  for (const item of pressItems) {
    const slug = slugify(item.title);
    await prisma.newsPost.upsert({
      where: { slug },
      update: {},
      create: {
        title: item.title,
        slug,
        status: "published",
        excerpt: item.summary,
        content: `<p>${item.summary}</p>`,
        outlet: item.outlet,
        externalUrl: item.url,
        publishedAt: item.date ? new Date(item.date) : new Date(),
      },
    });
    console.log(`Migrated press item -> NewsPost: ${item.title}`);
  }
}

const incubators = [
  {
    name: "MAGIC",
    description: "Marathwada Accelerator for Growth & Incubation.",
    sortOrder: 0,
  },
  {
    name: "IIT Ropar TBIF",
    description: "Technology Business Incubator Foundation, IIT Ropar.",
    sortOrder: 1,
  },
];

async function migrateIncubatorsToPartners() {
  for (const incubator of incubators) {
    await prisma.partner.upsert({
      where: { id: `incubator-${incubator.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `incubator-${incubator.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: incubator.name,
        description: incubator.description,
        category: "incubator",
        status: "active",
        sortOrder: incubator.sortOrder,
      },
    });
    console.log(`Migrated incubator -> Partner: ${incubator.name}`);
  }
}

async function migrateTechnologiesAndSolutions() {
  const products = await prisma.product.findMany({ select: { slug: true, name: true } });
  const slugByName = new Map(products.map((p) => [p.name, p.slug]));

  for (const [i, tech] of technologies.entries()) {
    const appliedInProductSlugs = tech.appliedIn
      .map((name) => slugByName.get(name))
      .filter((s): s is string => Boolean(s));

    await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: {},
      create: {
        name: tech.name,
        slug: tech.slug,
        description: tech.description,
        appliedInProductSlugs: appliedInProductSlugs as object,
        status: "published",
        sortOrder: i,
      },
    });
    console.log(`Migrated technology -> Technology: ${tech.name}`);
  }

  for (const [i, solution] of solutions.entries()) {
    await prisma.solution.upsert({
      where: { slug: solution.slug },
      update: {},
      create: {
        name: solution.name,
        slug: solution.slug,
        description: solution.description,
        relatedProductSlugs: solution.relatedProducts as object,
        status: "published",
        sortOrder: i,
      },
    });
    console.log(`Migrated solution -> Solution: ${solution.name}`);
  }
}

async function main() {
  await migratePressToNews();
  await migrateFoundersToTeam();
  await migrateIncubatorsToPartners();
  await migrateTechnologiesAndSolutions();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
