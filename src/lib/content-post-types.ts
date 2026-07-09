export const CONTENT_STATUSES = ["draft", "scheduled", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export interface ContentPostFormValues {
  title: string;
  slug: string;
  status: ContentStatus;
  excerpt: string;
  content: string; // Tiptap HTML
  featuredImageUrl: string;
  galleryUrls: string[];
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  publishedAt: string; // yyyy-mm-ddThh:mm, empty = not set
  // News-only fields, ignored for Blog
  outlet: string;
  externalUrl: string;
}

export const emptyContentPostForm: ContentPostFormValues = {
  title: "",
  slug: "",
  status: "draft",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  galleryUrls: [],
  category: "",
  tags: [],
  seoTitle: "",
  seoDescription: "",
  ogImageUrl: "",
  publishedAt: "",
  outlet: "",
  externalUrl: "",
};
