export const BLOCK_TYPES = [
  "hero",
  "text",
  "two-column",
  "gallery",
  "video",
  "poster",
  "timeline",
  "workflow",
  "specs-table",
  "cta",
  "download",
  "faq",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  hero: "Hero",
  text: "Text",
  "two-column": "Two Column",
  gallery: "Gallery",
  video: "Video",
  poster: "Poster",
  timeline: "Timeline",
  workflow: "Workflow",
  "specs-table": "Specs Table",
  cta: "Call to Action",
  download: "Download",
  faq: "FAQ",
};

export interface HeroBlockContent {
  heading: string;
  subheading?: string;
  imageUrl?: string;
}
export interface TextBlockContent {
  heading?: string;
  body: string;
}
export interface TwoColumnBlockContent {
  left: string;
  right: string;
}
export interface GalleryBlockContent {
  images: string[];
}
export interface VideoBlockContent {
  url: string;
  caption?: string;
}
export interface PosterBlockContent {
  imageUrl: string;
  caption?: string;
}
export interface TimelineItem {
  date: string;
  title: string;
  description: string;
}
export interface TimelineBlockContent {
  items: TimelineItem[];
}
export interface WorkflowStageItem {
  stage: string;
  description: string;
}
export interface WorkflowBlockContent {
  stages: WorkflowStageItem[];
}
export interface SpecsTableRow {
  label: string;
  value: string;
}
export interface SpecsTableBlockContent {
  rows: SpecsTableRow[];
}
export interface CtaBlockContent {
  heading: string;
  body?: string;
  buttonLabel: string;
  buttonHref: string;
}
export interface DownloadBlockContent {
  label: string;
  fileUrl: string;
}
export interface FaqItem {
  question: string;
  answer: string;
}
export interface FaqBlockContent {
  items: FaqItem[];
}

export type BlockContent =
  | HeroBlockContent
  | TextBlockContent
  | TwoColumnBlockContent
  | GalleryBlockContent
  | VideoBlockContent
  | PosterBlockContent
  | TimelineBlockContent
  | WorkflowBlockContent
  | SpecsTableBlockContent
  | CtaBlockContent
  | DownloadBlockContent
  | FaqBlockContent;

export interface ProductContentBlockValues {
  id: string;
  type: BlockType;
  sortOrder: number;
  content: BlockContent;
}

export function emptyBlockContent(type: BlockType): BlockContent {
  switch (type) {
    case "hero":
      return { heading: "" };
    case "text":
      return { body: "" };
    case "two-column":
      return { left: "", right: "" };
    case "gallery":
      return { images: [] };
    case "video":
      return { url: "" };
    case "poster":
      return { imageUrl: "" };
    case "timeline":
      return { items: [] };
    case "workflow":
      return { stages: [] };
    case "specs-table":
      return { rows: [] };
    case "cta":
      return { heading: "", buttonLabel: "", buttonHref: "" };
    case "download":
      return { label: "", fileUrl: "" };
    case "faq":
      return { items: [] };
  }
}
