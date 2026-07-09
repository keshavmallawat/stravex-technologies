import {
  ShieldCheck,
  Cpu,
  Lightning,
  PuzzlePiece,
  Target,
  Gauge,
  Newspaper,
  Mountains,
  WifiSlash,
  Factory,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/section";
import { RadarBackdrop } from "@/components/radar-backdrop";
import { ButtonLink } from "@/components/button-link";
import { ProductCard } from "@/components/product-card";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { SpineLabel } from "@/components/spine-label";
import { ChapterNav } from "@/components/chapter-nav";
import { getPublishedProducts } from "@/lib/products-data";
import { getPublishedNewsPosts } from "@/lib/news-data";
import { getEnabledHomepageSections, type HomepageSectionData } from "@/lib/homepage-data";
import { getSiteSettings } from "@/lib/settings-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeo("home"), getSiteSettings()]);
  return applySeoOverride(override, {
    title: settings.seoDefaultTitle || "Stravex Technologies",
    description: settings.seoDefaultDescription || "",
  });
}

// Icons are matched to items by position — content (label/description) is
// CMS-editable, the icon set/order is a fixed part of the section's design.
const WHY_STRAVEX_ICONS: Icon[] = [Mountains, WifiSlash, Factory];
const CAPABILITY_ICONS: Icon[] = [ShieldCheck, Target, Gauge, Cpu, PuzzlePiece, Lightning];

const chapters = [
  { id: "ecosystem", label: "Ecosystem" },
  { id: "why-stravex", label: "Why Stravex" },
  { id: "mission", label: "Mission" },
  { id: "capabilities", label: "Capabilities" },
  { id: "press", label: "News" },
  { id: "contact", label: "Contact" },
];

export default async function Home() {
  const [products, sections, newsPosts] = await Promise.all([
    getPublishedProducts(),
    getEnabledHomepageSections(),
    getPublishedNewsPosts(),
  ]);
  const featuredProducts = products.filter((p) => p.featured);
  const sectionByKey = new Map(sections.map((s) => [s.key, s]));

  return (
    <>
      <SpineLabel />
      <ChapterNav chapters={chapters} />

      {sectionByKey.has("hero") && (
        <HeroSection section={sectionByKey.get("hero")!} productCount={products.length} />
      )}
      {sectionByKey.has("ecosystem") && (
        <EcosystemSection section={sectionByKey.get("ecosystem")!} products={featuredProducts} />
      )}
      {sectionByKey.has("why-stravex") && (
        <WhyStravexSection section={sectionByKey.get("why-stravex")!} />
      )}
      {sectionByKey.has("mission") && <MissionSection section={sectionByKey.get("mission")!} />}
      {sectionByKey.has("capabilities") && (
        <CapabilitiesSection section={sectionByKey.get("capabilities")!} />
      )}
      {sectionByKey.has("press") && newsPosts.length > 0 && (
        <PressSection section={sectionByKey.get("press")!} newsPosts={newsPosts.slice(0, 3)} />
      )}
      {sectionByKey.has("cta") && <CtaSection section={sectionByKey.get("cta")!} />}
    </>
  );
}

function HeroSection({
  section,
  productCount,
}: {
  section: HomepageSectionData;
  productCount: number;
}) {
  return (
    <section id="hero" className="relative overflow-hidden bg-night text-white">
      <RadarBackdrop />
      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-[1280px] flex-col justify-center px-6 py-32 md:px-10">
        <FadeIn>
          <span className="font-mono-label text-xs uppercase text-brand">
            [ {section.eyebrow} ]
          </span>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            {section.heading}
          </h1>
        </FadeIn>
        <FadeIn delay={0.16}>
          <p className="mt-7 max-w-xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
            {section.body}
          </p>
        </FadeIn>
        <FadeIn delay={0.24}>
          <div className="mt-10 flex flex-wrap gap-4">
            {section.ctaLabel && section.ctaHref && (
              <ButtonLink href={section.ctaHref}>{section.ctaLabel}</ButtonLink>
            )}
            {section.secondaryCtaLabel && section.secondaryCtaHref && (
              <ButtonLink href={section.secondaryCtaHref} variant="ghost" showArrow={false}>
                {section.secondaryCtaLabel}
              </ButtonLink>
            )}
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.3} className="relative z-10">
        <div className="mx-auto flex w-full max-w-[1280px] justify-end px-6 pb-10 md:px-10">
          <div className="border border-night-border bg-night-elevated/80 px-6 py-4 backdrop-blur">
            <p className="font-mono-label text-[10px] uppercase text-night-muted">
              {section.badgeLabel}
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {String(productCount).padStart(2, "0")} Systems{" "}
              <span className="text-night-muted">/</span> 01 Platform
            </p>
            <p className="font-mono-label mt-1 text-[10px] uppercase text-night-muted">
              {section.badgeSubline}
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function EcosystemSection({
  section,
  products,
}: {
  section: HomepageSectionData;
  products: Awaited<ReturnType<typeof getPublishedProducts>>;
}) {
  return (
    <Section id="ecosystem" tone="night">
      <SectionHeading
        index="01"
        eyebrow={section.eyebrow}
        tone="dark"
        title={section.heading ?? ""}
        description={section.body ?? undefined}
      />
      <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <RevealItem key={product.slug}>
            <ProductCard product={product} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

function WhyStravexSection({ section }: { section: HomepageSectionData }) {
  return (
    <Section id="why-stravex" tone="light">
      <SectionHeading index="02" eyebrow={section.eyebrow} title={section.heading ?? ""} />
      <RevealGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {section.items.map((item, i) => {
          const Icon = WHY_STRAVEX_ICONS[i] ?? WHY_STRAVEX_ICONS[0];
          return (
            <RevealItem key={item.label}>
              <div className="h-full border border-ink/10 p-7">
                <Icon size={26} className="text-brand" weight="light" />
                <h3 className="mt-5 text-lg font-semibold text-ink">{item.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{item.description}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

function MissionSection({ section }: { section: HomepageSectionData }) {
  return (
    <Section id="mission" tone="mist" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-soft opacity-60 blur-3xl"
      />
      <div className="relative">
        <SectionHeading index="03" eyebrow={section.eyebrow} title={section.heading ?? ""} />
        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-2">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">[ Mission ]</span>
            <p className="mt-5 text-balance text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              {section.missionText}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <span className="font-mono-label text-xs uppercase text-brand">[ Vision ]</span>
            <p className="mt-5 text-balance text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              {section.visionText}
            </p>
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

function CapabilitiesSection({ section }: { section: HomepageSectionData }) {
  return (
    <Section id="capabilities" tone="light">
      <SectionHeading index="04" eyebrow={section.eyebrow} title={section.heading ?? ""} />
      <RevealGroup className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item, i) => {
          const Icon = CAPABILITY_ICONS[i] ?? CAPABILITY_ICONS[0];
          return (
            <RevealItem key={item.label}>
              <div className="flex gap-4 border-t border-ink/10 pt-5">
                <Icon size={22} className="mt-0.5 shrink-0 text-brand" weight="light" />
                <div>
                  <span className="text-sm font-semibold text-ink">{item.label}</span>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{item.description}</p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

function PressSection({
  section,
  newsPosts,
}: {
  section: HomepageSectionData;
  newsPosts: Awaited<ReturnType<typeof getPublishedNewsPosts>>;
}) {
  return (
    <Section id="press" tone="mist">
      <SectionHeading
        index="05"
        eyebrow={section.eyebrow}
        title={section.heading ?? ""}
        description={section.body ?? undefined}
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {newsPosts.map((item) => (
          <a
            key={item.slug}
            href={item.externalUrl || `/news/${item.slug}`}
            {...(item.externalUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex cursor-pointer flex-col gap-3 border border-ink/10 bg-white p-6 transition-colors duration-200 hover:border-brand/50"
          >
            <Newspaper size={20} className="text-brand" />
            <span className="font-mono-label text-[11px] uppercase text-ink/40">
              {item.outlet ?? "Stravex Technologies"}
            </span>
            <h3 className="text-sm font-medium leading-snug text-ink group-hover:text-brand">
              {item.title}
            </h3>
            {item.excerpt && (
              <p className="text-xs leading-relaxed text-ink/55">{item.excerpt}</p>
            )}
          </a>
        ))}
      </div>
    </Section>
  );
}

function CtaSection({ section }: { section: HomepageSectionData }) {
  return (
    <Section id="contact" tone="night" className="!py-24">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="font-mono-label text-xs uppercase text-brand">[ 06 ]</span>
        <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          {section.heading}
        </h2>
        <p className="max-w-lg text-balance text-night-muted">{section.body}</p>
        {section.ctaLabel && section.ctaHref && (
          <ButtonLink href={section.ctaHref}>{section.ctaLabel}</ButtonLink>
        )}
      </div>
    </Section>
  );
}
