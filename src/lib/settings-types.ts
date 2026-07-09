import type { SiteSettingsData, NavLinkEntry } from "@/lib/settings-data";

export interface SettingsFormValues {
  companyName: string;
  addressLines: string[];
  email: string;
  phone: string;
  phoneHref: string;
  businessHoursDays: string;
  businessHoursTime: string;
  socialLinkedin: string;
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;
  socialYoutube: string;
  navLinks: NavLinkEntry[];
  footerTagline: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  ogDefaultImageUrl: string;
  faviconUrl: string;
  logoLightUrl: string;
  logoDarkUrl: string;
  analyticsGa4: string;
  analyticsGtm: string;
  analyticsMetaPixel: string;
}

export function settingsToFormValues(s: SiteSettingsData): SettingsFormValues {
  return {
    companyName: s.companyName,
    addressLines: s.addressLines,
    email: s.email,
    phone: s.phone,
    phoneHref: s.phoneHref,
    businessHoursDays: s.businessHoursDays,
    businessHoursTime: s.businessHoursTime,
    socialLinkedin: s.socialLinks.linkedin ?? "",
    socialInstagram: s.socialLinks.instagram ?? "",
    socialTwitter: s.socialLinks.twitter ?? "",
    socialFacebook: s.socialLinks.facebook ?? "",
    socialYoutube: s.socialLinks.youtube ?? "",
    navLinks: s.navLinks,
    footerTagline: s.footerTagline,
    seoDefaultTitle: s.seoDefaultTitle ?? "",
    seoDefaultDescription: s.seoDefaultDescription ?? "",
    ogDefaultImageUrl: s.ogDefaultImageUrl ?? "",
    faviconUrl: s.faviconUrl ?? "",
    logoLightUrl: s.logoLightUrl ?? "",
    logoDarkUrl: s.logoDarkUrl ?? "",
    analyticsGa4: s.analyticsIds.ga4 ?? "",
    analyticsGtm: s.analyticsIds.gtm ?? "",
    analyticsMetaPixel: s.analyticsIds.metaPixel ?? "",
  };
}
