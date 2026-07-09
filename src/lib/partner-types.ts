export const PARTNER_CATEGORIES = ["incubator", "partner"] as const;
export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

export const PARTNER_STATUSES = ["active", "inactive"] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export interface PartnerFormValues {
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  category: PartnerCategory;
  status: PartnerStatus;
}

export const emptyPartnerForm: PartnerFormValues = {
  name: "",
  description: "",
  logoUrl: "",
  websiteUrl: "",
  category: "incubator",
  status: "active",
};
