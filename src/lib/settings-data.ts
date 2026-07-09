import { prisma } from "@/lib/prisma";

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
}

export interface AnalyticsIds {
  ga4?: string;
  gtm?: string;
  metaPixel?: string;
}

export interface NavLinkEntry {
  label: string;
  href: string;
}

export interface SiteSettingsData {
  companyName: string;
  addressLines: string[];
  email: string;
  phone: string;
  phoneHref: string;
  businessHoursDays: string;
  businessHoursTime: string;
  socialLinks: SocialLinks;
  navLinks: NavLinkEntry[];
  footerTagline: string;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  ogDefaultImageUrl: string | null;
  faviconUrl: string | null;
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  analyticsIds: AnalyticsIds;
}

const DEFAULT_NAV_LINKS: NavLinkEntry[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Technologies", href: "/technologies" },
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "News", href: "/news" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const DEFAULTS: Omit<SiteSettingsData, "navLinks"> & { navLinks: NavLinkEntry[] } = {
  companyName: "Stravex Technologies",
  addressLines: ["Haware Fantasia Business Park,", "Vashi, Navi Mumbai,", "Maharashtra, India"],
  email: "info@stravextechnologies.com",
  phone: "+91 84258 02309",
  phoneHref: "tel:+918425802309",
  businessHoursDays: "Monday – Saturday",
  businessHoursTime: "10:00 AM – 7:00 PM",
  socialLinks: {
    linkedin: "https://www.linkedin.com/company/stravex-technologies/",
    instagram: "https://www.instagram.com/stravextechnologies",
  },
  navLinks: DEFAULT_NAV_LINKS,
  footerTagline:
    "Engineering India's indigenous tactical defence ecosystem — detection, interception, autonomy, avionics, training, and field sustainment, built as one integrated platform.",
  seoDefaultTitle: "Stravex Technologies | Indigenous Tactical Defence Systems",
  seoDefaultDescription:
    "Stravex Technologies engineers India's indigenous tactical defence ecosystem — drone interception, autonomous aerial platforms, avionics, pilot training, and field sustainment infrastructure.",
  ogDefaultImageUrl: null,
  faviconUrl: null,
  logoLightUrl: null,
  logoDarkUrl: null,
  analyticsIds: {},
};

function toSettingsData(row: {
  companyName: string;
  addressLines: unknown;
  email: string;
  phone: string;
  phoneHref: string;
  businessHoursDays: string;
  businessHoursTime: string;
  socialLinks: unknown;
  navLinks: unknown;
  footerTagline: string;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  ogDefaultImageUrl: string | null;
  faviconUrl: string | null;
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  analyticsIds: unknown;
}): SiteSettingsData {
  const navLinks = row.navLinks as NavLinkEntry[];
  return {
    companyName: row.companyName,
    addressLines: row.addressLines as string[],
    email: row.email,
    phone: row.phone,
    phoneHref: row.phoneHref,
    businessHoursDays: row.businessHoursDays,
    businessHoursTime: row.businessHoursTime,
    socialLinks: row.socialLinks as SocialLinks,
    navLinks: navLinks.length > 0 ? navLinks : DEFAULT_NAV_LINKS,
    footerTagline: row.footerTagline,
    seoDefaultTitle: row.seoDefaultTitle,
    seoDefaultDescription: row.seoDefaultDescription,
    ogDefaultImageUrl: row.ogDefaultImageUrl,
    faviconUrl: row.faviconUrl,
    logoLightUrl: row.logoLightUrl,
    logoDarkUrl: row.logoDarkUrl,
    analyticsIds: row.analyticsIds as AnalyticsIds,
  };
}

/**
 * Lazily creates the singleton row with hardcoded defaults if missing, so a
 * dev `prisma migrate reset` (or a fresh deploy before the seed script runs)
 * can never leave the public site without settings.
 */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (existing) return toSettingsData(existing);

  const created = await prisma.siteSettings.create({
    data: {
      id: "singleton",
      companyName: DEFAULTS.companyName,
      addressLines: DEFAULTS.addressLines as object,
      email: DEFAULTS.email,
      phone: DEFAULTS.phone,
      phoneHref: DEFAULTS.phoneHref,
      businessHoursDays: DEFAULTS.businessHoursDays,
      businessHoursTime: DEFAULTS.businessHoursTime,
      socialLinks: DEFAULTS.socialLinks as object,
      navLinks: DEFAULTS.navLinks as object,
      footerTagline: DEFAULTS.footerTagline,
      seoDefaultTitle: DEFAULTS.seoDefaultTitle,
      seoDefaultDescription: DEFAULTS.seoDefaultDescription,
      ogDefaultImageUrl: DEFAULTS.ogDefaultImageUrl,
      faviconUrl: DEFAULTS.faviconUrl,
      logoLightUrl: DEFAULTS.logoLightUrl,
      logoDarkUrl: DEFAULTS.logoDarkUrl,
      analyticsIds: DEFAULTS.analyticsIds as object,
    },
  });

  return toSettingsData(created);
}
