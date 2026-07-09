import Image from "next/image";
import { FileArrowDown } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { Workflow } from "@/components/product/workflow";
import type {
  ProductContentBlockValues,
  HeroBlockContent,
  TextBlockContent,
  TwoColumnBlockContent,
  GalleryBlockContent,
  VideoBlockContent,
  PosterBlockContent,
  TimelineBlockContent,
  WorkflowBlockContent,
  SpecsTableBlockContent,
  CtaBlockContent,
  DownloadBlockContent,
  FaqBlockContent,
} from "@/lib/product-block-types";

export function BlockRenderer({ blocks }: { blocks: ProductContentBlockValues[] }) {
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block) => (
        <SingleBlock key={block.id} block={block} />
      ))}
    </>
  );
}

function SingleBlock({ block }: { block: ProductContentBlockValues }) {
  switch (block.type) {
    case "hero": {
      const c = block.content as HeroBlockContent;
      return (
        <section className="relative overflow-hidden bg-night text-white">
          {c.imageUrl && (
            <Image
              src={c.imageUrl}
              alt={c.heading}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
          )}
          <div className="relative mx-auto max-w-[1280px] px-6 py-24 md:px-10">
            <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              {c.heading}
            </h2>
            {c.subheading && (
              <p className="mt-4 max-w-xl text-balance text-base text-night-muted md:text-lg">
                {c.subheading}
              </p>
            )}
          </div>
        </section>
      );
    }
    case "text": {
      const c = block.content as TextBlockContent;
      return (
        <Section tone="light">
          {c.heading && <SectionHeading title={c.heading} />}
          <p className="mt-6 max-w-3xl text-balance text-base leading-relaxed text-ink/70">
            {c.body}
          </p>
        </Section>
      );
    }
    case "two-column": {
      const c = block.content as TwoColumnBlockContent;
      return (
        <Section tone="mist">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <p className="text-base leading-relaxed text-ink/70">{c.left}</p>
            <p className="text-base leading-relaxed text-ink/70">{c.right}</p>
          </div>
        </Section>
      );
    }
    case "gallery": {
      const c = block.content as GalleryBlockContent;
      if (c.images.length === 0) return null;
      return (
        <Section tone="light">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.images.map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden bg-mist">
                <Image src={url} alt="" fill className="object-cover" sizes="33vw" />
              </div>
            ))}
          </div>
        </Section>
      );
    }
    case "video": {
      const c = block.content as VideoBlockContent;
      if (!c.url) return null;
      return (
        <Section tone="night">
          <div className="mx-auto aspect-video max-w-4xl overflow-hidden">
            <video src={c.url} controls className="h-full w-full" />
          </div>
          {c.caption && (
            <p className="mt-3 text-center text-sm text-night-muted">{c.caption}</p>
          )}
        </Section>
      );
    }
    case "poster": {
      const c = block.content as PosterBlockContent;
      if (!c.imageUrl) return null;
      return (
        <Section tone="light">
          <div className="mx-auto max-w-3xl">
            <div className="relative aspect-[4/3] overflow-hidden bg-mist">
              <Image src={c.imageUrl} alt={c.caption ?? ""} fill className="object-cover" sizes="768px" />
            </div>
            {c.caption && <p className="mt-3 text-sm text-ink/50">{c.caption}</p>}
          </div>
        </Section>
      );
    }
    case "timeline": {
      const c = block.content as TimelineBlockContent;
      if (c.items.length === 0) return null;
      return (
        <Section tone="mist">
          <div className="flex flex-col gap-8">
            {c.items.map((item, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 border-t border-ink/10 pt-6 sm:grid-cols-[140px_1fr]">
                <span className="font-mono-label text-xs uppercase text-brand">{item.date}</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      );
    }
    case "workflow": {
      const c = block.content as WorkflowBlockContent;
      if (c.stages.length === 0) return null;
      return (
        <Section tone="light">
          <Workflow stages={c.stages} />
        </Section>
      );
    }
    case "specs-table": {
      const c = block.content as SpecsTableBlockContent;
      if (c.rows.length === 0) return null;
      return (
        <Section tone="mist">
          <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {c.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 text-sm"
              >
                <span className="text-ink/50">{row.label}</span>
                <span className="font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        </Section>
      );
    }
    case "cta": {
      const c = block.content as CtaBlockContent;
      return (
        <Section tone="night">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight">
              {c.heading}
            </h2>
            {c.body && <p className="max-w-lg text-balance text-night-muted">{c.body}</p>}
            <ButtonLink href={c.buttonHref}>{c.buttonLabel}</ButtonLink>
          </div>
        </Section>
      );
    }
    case "download": {
      const c = block.content as DownloadBlockContent;
      if (!c.fileUrl) return null;
      return (
        <Section tone="light">
          <a
            href={c.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-fit cursor-pointer items-center gap-3 border border-ink/15 bg-white px-6 py-4 transition-colors hover:border-brand"
          >
            <FileArrowDown size={20} className="text-brand" />
            <span className="text-sm font-medium text-ink group-hover:text-brand">
              {c.label}
            </span>
          </a>
        </Section>
      );
    }
    case "faq": {
      const c = block.content as FaqBlockContent;
      if (c.items.length === 0) return null;
      return (
        <Section tone="mist">
          <div className="flex flex-col gap-6">
            {c.items.map((item, i) => (
              <div key={i} className="border-t border-ink/10 pt-6">
                <h3 className="text-base font-semibold text-ink">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    }
    default:
      return null;
  }
}
