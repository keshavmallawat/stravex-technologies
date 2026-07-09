"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { SettingsFormValues } from "@/lib/settings-types";

export async function updateSettingsAction(values: SettingsFormValues) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      companyName: values.companyName,
      addressLines: values.addressLines as object,
      email: values.email,
      phone: values.phone,
      phoneHref: values.phoneHref,
      businessHoursDays: values.businessHoursDays,
      businessHoursTime: values.businessHoursTime,
      socialLinks: {
        linkedin: values.socialLinkedin || undefined,
        instagram: values.socialInstagram || undefined,
        twitter: values.socialTwitter || undefined,
        facebook: values.socialFacebook || undefined,
        youtube: values.socialYoutube || undefined,
      } as object,
      navLinks: values.navLinks as object,
      footerTagline: values.footerTagline,
      seoDefaultTitle: values.seoDefaultTitle || null,
      seoDefaultDescription: values.seoDefaultDescription || null,
      ogDefaultImageUrl: values.ogDefaultImageUrl || null,
      faviconUrl: values.faviconUrl || null,
      logoLightUrl: values.logoLightUrl || null,
      logoDarkUrl: values.logoDarkUrl || null,
      analyticsIds: {
        ga4: values.analyticsGa4 || undefined,
        gtm: values.analyticsGtm || undefined,
        metaPixel: values.analyticsMetaPixel || undefined,
      } as object,
    },
    create: {
      id: "singleton",
      companyName: values.companyName,
      addressLines: values.addressLines as object,
      email: values.email,
      phone: values.phone,
      phoneHref: values.phoneHref,
      businessHoursDays: values.businessHoursDays,
      businessHoursTime: values.businessHoursTime,
      socialLinks: {
        linkedin: values.socialLinkedin || undefined,
        instagram: values.socialInstagram || undefined,
        twitter: values.socialTwitter || undefined,
        facebook: values.socialFacebook || undefined,
        youtube: values.socialYoutube || undefined,
      } as object,
      navLinks: values.navLinks as object,
      footerTagline: values.footerTagline,
      seoDefaultTitle: values.seoDefaultTitle || null,
      seoDefaultDescription: values.seoDefaultDescription || null,
      ogDefaultImageUrl: values.ogDefaultImageUrl || null,
      faviconUrl: values.faviconUrl || null,
      logoLightUrl: values.logoLightUrl || null,
      logoDarkUrl: values.logoDarkUrl || null,
      analyticsIds: {
        ga4: values.analyticsGa4 || undefined,
        gtm: values.analyticsGtm || undefined,
        metaPixel: values.analyticsMetaPixel || undefined,
      } as object,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}
