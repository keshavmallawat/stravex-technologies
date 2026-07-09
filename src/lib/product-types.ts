export { slugify } from "./slug";

export interface WorkflowStage {
  stage: string;
  description: string;
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface FeatureListSection {
  heading: string;
  items: string[];
}

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;
export type ProductWorkflowStatus = (typeof PRODUCT_STATUSES)[number];

export interface ProductFormValues {
  name: string;
  slug: string;
  category: string;
  status: ProductWorkflowStatus;
  displayStatus: string;
  featured: boolean;
  heroImageAspect: string;
  tagline: string;
  positioning: string;
  purpose: string;
  problemStatement: string;
  missionProfile: string;
  designGoals: string[];
  workflow: WorkflowStage[];
  coreCapabilities: string[];
  keyFeatures: string[];
  technicalSpecs: TechnicalSpec[];
  applications: string[];
  relatedTechnologies: string[];
  extraFeatureLists: FeatureListSection[];
  heroPosterUrl: string;
  galleryUrls: string[];
  datasheetUrl: string;
  heroTitle: string;
  ctaLabel: string;
  ctaHref: string;
  relatedProductSlugs: string[];
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
}

export const emptyProductForm: ProductFormValues = {
  name: "",
  slug: "",
  category: "",
  status: "draft",
  displayStatus: "In Development",
  featured: false,
  heroImageAspect: "16 / 10",
  tagline: "",
  positioning: "",
  purpose: "",
  problemStatement: "",
  missionProfile: "",
  designGoals: [],
  workflow: [],
  coreCapabilities: [],
  keyFeatures: [],
  technicalSpecs: [],
  applications: [],
  relatedTechnologies: [],
  extraFeatureLists: [],
  heroPosterUrl: "",
  galleryUrls: [],
  datasheetUrl: "",
  heroTitle: "",
  ctaLabel: "",
  ctaHref: "",
  relatedProductSlugs: [],
  seoTitle: "",
  seoDescription: "",
  ogImageUrl: "",
};

