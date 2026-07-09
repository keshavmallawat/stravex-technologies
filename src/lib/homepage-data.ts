import { prisma } from "@/lib/prisma";

export const HOMEPAGE_SECTION_KEYS = [
  "hero",
  "ecosystem",
  "why-stravex",
  "mission",
  "capabilities",
  "press",
  "cta",
] as const;
export type HomepageSectionKey = (typeof HOMEPAGE_SECTION_KEYS)[number];

export interface HomepageItem {
  label: string;
  description: string;
}

export interface HomepageSectionData {
  key: HomepageSectionKey;
  heading: string | null;
  body: string | null;
  eyebrow: string;
  items: HomepageItem[];
  missionText: string;
  visionText: string;
  badgeLabel: string;
  badgeSubline: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  imageUrl: string | null;
  mediaUrls: string[];
  enabled: boolean;
  sortOrder: number;
}

interface DefaultSection {
  key: HomepageSectionKey;
  heading: string | null;
  body: string | null;
  eyebrow: string;
  items?: HomepageItem[];
  missionText?: string;
  visionText?: string;
  badgeLabel?: string;
  badgeSubline?: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  sortOrder: number;
}

// Mirrors the real, currently-live homepage copy exactly, so seeding this
// never changes what visitors see until an admin deliberately edits it.
const DEFAULT_SECTIONS: DefaultSection[] = [
  {
    key: "hero",
    eyebrow: "Indigenous Tactical Defence Systems",
    heading:
      "Securing India's skies. Engineering it indigenously. One integrated ecosystem.",
    body: "Stravex Technologies engineers tactical systems across drone interception, autonomous aerial platforms, avionics, pilot training, and field sustainment — built for Indian operational conditions.",
    badgeLabel: "Ecosystem status",
    badgeSubline: "Incubated · IIT-Ropar TBI",
    ctaLabel: "Explore the ecosystem",
    ctaHref: "/products",
    secondaryCtaLabel: "About Stravex",
    secondaryCtaHref: "/about",
    sortOrder: 0,
  },
  {
    key: "ecosystem",
    eyebrow: "One Integrated Ecosystem",
    heading: "Not isolated products — a complete tactical defence platform.",
    body: "Every Stravex system is engineered around precision, modularity, rapid deployment, and mission-critical reliability, covering detection, interception, autonomous flight, avionics, pilot training, and field sustainment.",
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    sortOrder: 1,
  },
  {
    key: "why-stravex",
    eyebrow: "Why Choose Stravex Technologies?",
    heading: "Not adapted from foreign systems — engineered for this theatre.",
    body: null,
    items: [
      {
        label: "Built for Indian Conditions",
        description:
          "Engineered specifically for terrain, climate, and threat environments faced by Indian forces — not adapted from foreign systems.",
      },
      {
        label: "GPS-Denied Operation",
        description:
          "Hard-kill counter-drone systems designed to function reliably even under electronic jamming and contested conditions.",
      },
      {
        label: "Indigenous by Design",
        description:
          "Core technologies developed in-house, enabling faster upgrades, deeper customization, and independence from foreign supply chains.",
      },
    ],
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    sortOrder: 2,
  },
  {
    key: "mission",
    eyebrow: "Why Stravex",
    heading: "Mission & Vision",
    body: null,
    missionText:
      "To secure India's skies by engineering high-performance, fully indigenous drone and counter-drone systems — eliminating foreign dependency and delivering strategic autonomy to our defence forces.",
    visionText:
      "To expand Indian innovation in defence technology, architect the infrastructure of an Aatmanirbhar Bharat, and set global standards for indigenous drone and counter-drone systems.",
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    sortOrder: 3,
  },
  {
    key: "capabilities",
    eyebrow: "Design Philosophy",
    heading: "Every system communicates the same engineering discipline.",
    body: null,
    items: [
      { label: "Indigenous engineering", description: "Designed and built in India, for Indian operational conditions." },
      { label: "Precision engineering", description: "Every system tuned for accuracy under real-world constraints." },
      { label: "Mission-critical reliability", description: "Built to perform when failure is not an option." },
      { label: "AI-assisted autonomy", description: "Optical detection, classification, and decision support." },
      { label: "Modular architecture", description: "Swappable payloads and components across the ecosystem." },
      { label: "Rapid deployment", description: "Field-ready systems built for speed of operation." },
    ],
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    sortOrder: 4,
  },
  {
    key: "press",
    eyebrow: "In The News",
    heading: "Third-party coverage of AgniStrike",
    body: "The following are independent press reports, not official Stravex statements. Each item links directly to the original outlet.",
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    sortOrder: 5,
  },
  {
    key: "cta",
    eyebrow: "",
    heading: "Ready to strengthen your operational capability?",
    body: "For partnership, procurement, or technical enquiries — reach out to the Stravex team.",
    ctaLabel: "Contact Stravex",
    ctaHref: "/contact",
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    sortOrder: 6,
  },
];

function toSectionData(row: {
  key: string;
  heading: string | null;
  body: string | null;
  content: unknown;
  ctaLabel: string | null;
  ctaHref: string | null;
  secondaryCtaLabel: string | null;
  secondaryCtaHref: string | null;
  imageUrl: string | null;
  mediaUrls: unknown;
  enabled: boolean;
  sortOrder: number;
}): HomepageSectionData {
  const content = (row.content ?? {}) as Record<string, unknown>;
  return {
    key: row.key as HomepageSectionKey,
    heading: row.heading,
    body: row.body,
    eyebrow: (content.eyebrow as string) ?? "",
    items: (content.items as HomepageItem[]) ?? [],
    missionText: (content.missionText as string) ?? "",
    visionText: (content.visionText as string) ?? "",
    badgeLabel: (content.badgeLabel as string) ?? "",
    badgeSubline: (content.badgeSubline as string) ?? "",
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    secondaryCtaLabel: row.secondaryCtaLabel,
    secondaryCtaHref: row.secondaryCtaHref,
    imageUrl: row.imageUrl,
    mediaUrls: (row.mediaUrls as string[]) ?? [],
    enabled: row.enabled,
    sortOrder: row.sortOrder,
  };
}

function defaultToContent(def: DefaultSection) {
  return {
    eyebrow: def.eyebrow,
    items: def.items ?? [],
    missionText: def.missionText ?? "",
    visionText: def.visionText ?? "",
    badgeLabel: def.badgeLabel ?? "",
    badgeSubline: def.badgeSubline ?? "",
  };
}

/** Lazily seeds any missing section rows with the real default copy above. */
export async function getHomepageSections(): Promise<HomepageSectionData[]> {
  const existing = await prisma.homepageSection.findMany();
  const existingKeys = new Set(existing.map((s) => s.key));

  const missing = DEFAULT_SECTIONS.filter((def) => !existingKeys.has(def.key));
  if (missing.length > 0) {
    await prisma.$transaction(
      missing.map((def) =>
        prisma.homepageSection.create({
          data: {
            key: def.key,
            heading: def.heading,
            body: def.body,
            content: defaultToContent(def) as object,
            ctaLabel: def.ctaLabel,
            ctaHref: def.ctaHref,
            secondaryCtaLabel: def.secondaryCtaLabel,
            secondaryCtaHref: def.secondaryCtaHref,
            mediaUrls: [] as unknown as object,
            sortOrder: def.sortOrder,
          },
        })
      )
    );
  }

  const rows = await prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map(toSectionData);
}

export async function getEnabledHomepageSections(): Promise<HomepageSectionData[]> {
  const sections = await getHomepageSections();
  return sections.filter((s) => s.enabled);
}
