import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Package, CubeTransparent, Camera } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { StatusBadge } from "@/components/badge";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { MotifBackdrop, MotifVariant } from "@/components/product/motif-backdrop";
import { Workflow } from "@/components/product/workflow";
import { MediaFrame } from "@/components/media-frame";
import { BlockRenderer } from "@/components/product/block-renderer";
import type { PublicProduct } from "@/lib/products-data";
import type { PublicTechnology } from "@/lib/technologies-data";
import type { ProductContentBlockValues } from "@/lib/product-block-types";

export function ProductDetailView({
  product,
  relatedProducts,
  allTechnologies,
  next,
  contentBlocks = [],
  isPreview = false,
}: {
  product: PublicProduct;
  relatedProducts: PublicProduct[];
  allTechnologies: PublicTechnology[];
  next?: PublicProduct;
  contentBlocks?: ProductContentBlockValues[];
  isPreview?: boolean;
}) {
  const technologyByName = new Map(allTechnologies.map((t) => [t.name, t]));
  const diagramImage = product.galleryUrls[0];
  const fieldPhotoImage = product.galleryUrls[1];
  const ctaLabel = product.ctaLabel || "Contact Stravex";
  const ctaHref = product.ctaHref || "/contact";

  return (
    <>
      {isPreview && (
        <div className="bg-amber-soft border-b border-amber/40 px-6 py-2 text-center">
          <span className="font-mono-label text-[10px] uppercase text-amber">
            [ Preview — {product.displayStatus === "In Development" ? "Not Published" : "Draft"} ]
          </span>
        </div>
      )}
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <MotifBackdrop variant={product.slug as MotifVariant} />
        <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 px-6 py-24 md:px-10 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div>
            <FadeIn>
              <Link
                href="/products"
                className="font-mono-label inline-flex cursor-pointer items-center gap-2 text-xs uppercase text-night-muted transition-colors hover:text-brand"
              >
                <ArrowLeft size={12} weight="bold" />
                All systems
              </Link>
            </FadeIn>
            <FadeIn delay={0.06}>
              <span className="font-mono-label mt-6 block text-xs uppercase text-brand">
                [ {product.category} ]
              </span>
            </FadeIn>
            <FadeIn delay={0.12}>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
                {product.heroTitle || product.name}
              </h1>
            </FadeIn>
            <FadeIn delay={0.18}>
              <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
                {product.positioning}
              </p>
            </FadeIn>
            <FadeIn delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <StatusBadge status={product.displayStatus} />
                {product.tagline && (
                  <span className="font-mono-label text-xs uppercase text-night-muted">
                    &ldquo;{product.tagline}&rdquo;
                  </span>
                )}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <MediaFrame
              aspect="1414 / 2000"
              icon={Package}
              label="Product Poster"
              sublabel={`${product.name} · Poster`}
              className="mx-auto max-w-md lg:max-w-[400px] xl:max-w-[450px]"
              src={product.heroPosterUrl ?? undefined}
              alt={`High-resolution render of ${product.name}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 450px"
              priority={true}
            />
          </FadeIn>
        </div>
      </section>

      {/* Problem / Solution */}
      <Section tone="light">
        <SectionHeading index="01" eyebrow="Operational Context" title="Problem &amp; Engineering Solution" />
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-ink/40">[ Problem ]</span>
            <p className="mt-4 text-balance text-xl leading-relaxed text-ink/75 md:text-2xl">
              {product.problemStatement}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <span className="font-mono-label text-xs uppercase text-brand">[ Solution ]</span>
            <p className="mt-4 text-balance text-xl leading-relaxed text-ink md:text-2xl">
              {product.purpose}
            </p>
          </FadeIn>
        </div>

        {product.missionProfile && (
          <FadeIn delay={0.16}>
            <p className="mt-12 max-w-3xl border-t border-ink/10 pt-8 text-base leading-relaxed text-ink/60">
              {product.missionProfile}
            </p>
          </FadeIn>
        )}
      </Section>

      {/* Workflow */}
      <Section tone="mist">
        <SectionHeading
          index="02"
          eyebrow="Architecture"
          title="How the system works, stage by stage."
        />
        <div className="mt-12">
          <MediaFrame
            aspect="21 / 9"
            tone="light"
            icon={CubeTransparent}
            label="Exploded View / System Diagram"
            sublabel={`${product.name} · Technical illustration`}
            src={diagramImage}
            alt={`Technical diagram of ${product.name}`}
          />
        </div>
        <div className="mt-14">
          <Workflow stages={product.workflow} />
        </div>
      </Section>

      {/* Capabilities + Technical highlights */}
      <Section tone="light">
        <SectionHeading index="03" eyebrow="Capabilities" title="What the system does — and how it's built." />
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Core Capabilities ]
            </span>
            <RevealGroup className="mt-5 flex flex-col">
              {product.coreCapabilities.map((cap) => (
                <RevealItem key={cap}>
                  <div className="border-t border-ink/10 py-3 text-sm text-ink/75">{cap}</div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
          <div>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Technical Highlights ]
            </span>
            <RevealGroup className="mt-5 flex flex-col">
              {product.keyFeatures.map((feat) => (
                <RevealItem key={feat}>
                  <div className="border-t border-ink/10 py-3 text-sm text-ink/75">{feat}</div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>

        {product.extraFeatureLists.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-12 border-t border-ink/10 pt-12 lg:grid-cols-2">
            {product.extraFeatureLists.map((section) => (
              <div key={section.heading}>
                <span className="font-mono-label text-xs uppercase text-ink/40">
                  [ {section.heading} ]
                </span>
                <ul className="mt-4 space-y-2 text-sm text-ink/70">
                  {section.items.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {product.technicalSpecs.length > 0 && (
          <div className="mt-14 border-t border-ink/10 pt-12">
            <span className="font-mono-label text-xs uppercase text-ink/40">
              [ Technical Specifications ]
            </span>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {product.technicalSpecs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between border-b border-ink/10 py-2 text-sm"
                >
                  <span className="text-ink/50">{spec.label}</span>
                  <span className="font-medium text-ink">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.designGoals.length > 0 && (
          <div className="mt-14 border-t border-ink/10 pt-12">
            <span className="font-mono-label text-xs uppercase text-ink/40">
              [ Design Goals ]
            </span>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.designGoals.map((g) => (
                <span
                  key={g}
                  className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/70"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Applications + status + related tech */}
      <Section tone="mist">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading index="04" eyebrow="Applications" title="Where this system operates." />
            <div className="mt-8 flex flex-wrap gap-2">
              {product.applications.map((a) => (
                <span
                  key={a}
                  className="font-mono-label border border-ink/15 bg-white px-3 py-1.5 text-[11px] uppercase text-ink/70"
                >
                  {a}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <MediaFrame
                aspect="4 / 3"
                tone="light"
                icon={Camera}
                label="Field Deployment Photography"
                sublabel={`${product.name} · Operational context`}
                src={fieldPhotoImage}
                alt={`Field deployment photo of ${product.name}`}
              />
            </div>
          </div>

          <div>
            <span className="font-mono-label text-xs uppercase text-ink/40">
              [ Development Status ]
            </span>
            <div className="mt-4">
              <StatusBadge status={product.displayStatus} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink/55">
              This system is under active engineering development. Specifications
              and capabilities are subject to change as the platform matures.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-ink/10 pt-10">
          <span className="font-mono-label text-xs uppercase text-ink/40">
            [ Related Technologies ]
          </span>
          <div className="mt-5 flex flex-wrap gap-3">
            {product.relatedTechnologies.map((techName) => {
              const tech = technologyByName.get(techName);
              return (
                <Link
                  key={techName}
                  href={tech ? `/technologies#${tech.slug}` : "/technologies"}
                  className="group inline-flex cursor-pointer items-center gap-1.5 border border-ink/15 bg-white px-4 py-2 text-sm text-ink/75 transition-colors hover:border-brand hover:text-brand"
                >
                  {techName}
                  <ArrowUpRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Section tone="light">
          <SectionHeading index="05" eyebrow="You Might Also Like" title="Related systems." />
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((rp) => (
              <RevealItem key={rp.slug}>
                <Link
                  href={`/products/${rp.slug}`}
                  className="group flex cursor-pointer flex-col justify-between border border-ink/10 bg-white p-6 transition-colors hover:border-brand"
                >
                  <div>
                    <span className="font-mono-label text-[11px] uppercase text-brand">
                      {rp.category}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-ink">{rp.name}</h3>
                    <p className="mt-2 text-sm text-ink/60">{rp.positioning}</p>
                  </div>
                  <span className="font-mono-label mt-6 inline-flex items-center gap-1.5 text-xs uppercase text-ink/60 group-hover:text-brand">
                    View system
                    <ArrowUpRight size={12} weight="bold" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* Optional page-builder content blocks */}
      <BlockRenderer blocks={contentBlocks} />

      {/* Next product + CTA */}
      <Section tone="night" className="!py-24">
        <div className={`grid grid-cols-1 items-center gap-10 ${next ? "lg:grid-cols-2" : ""}`}>
          <div>
            <span className="font-mono-label text-xs uppercase text-brand">[ 06 ]</span>
            <h2 className="mt-4 max-w-md text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Interested in {product.name}?
            </h2>
            <p className="mt-4 max-w-md text-balance text-night-muted">
              Reach out for technical documentation, partnership discussions, or
              procurement enquiries.
            </p>
            <div className="mt-8">
              <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
            </div>
          </div>

          {next && (
            <Link
              href={`/products/${next.slug}`}
              className="group flex cursor-pointer flex-col justify-between border border-night-border p-8 transition-colors hover:border-brand/50"
            >
              <span className="font-mono-label text-xs uppercase text-night-muted">
                [ Next System ]
              </span>
              <div>
                <h3 className="mt-6 text-2xl font-semibold text-white group-hover:text-brand">
                  {next.name}
                </h3>
                <p className="mt-2 text-sm text-night-muted">{next.category}</p>
              </div>
              <span className="font-mono-label mt-8 inline-flex items-center gap-2 text-xs uppercase text-white/70 group-hover:text-brand">
                View system
                <ArrowUpRight size={13} weight="bold" />
              </span>
            </Link>
          )}
        </div>
      </Section>
    </>
  );
}
