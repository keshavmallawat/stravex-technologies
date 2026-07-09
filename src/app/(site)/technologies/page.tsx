import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { getPublishedTechnologies } from "@/lib/technologies-data";
import { getPublishedProducts } from "@/lib/products-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("technologies");
  return applySeoOverride(override, {
    title: "Technologies | Stravex Technologies",
    description:
      "The engineering capabilities that power every Stravex system — counter-drone systems, autonomous operations, indigenous hardware, and training & support infrastructure.",
  });
}

export default async function TechnologiesPage() {
  const [technologies, products] = await Promise.all([
    getPublishedTechnologies(),
    getPublishedProducts(),
  ]);
  const productByslug = new Map(products.map((p) => [p.slug, p]));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[18, 38, 58, 78].map((top, i) => (
            <div
              key={top}
              className="absolute left-0 right-0 border-t border-night-border"
              style={{ top: `${top}%`, opacity: 0.5 + i * 0.05 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-night/20 via-transparent to-night" />
        </div>
        <div className="relative mx-auto flex min-h-[55vh] w-full max-w-[1280px] flex-col justify-center px-6 py-28 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Engineering Capabilities ]
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              One technology ecosystem.
              <br />
              Four capability areas.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Stravex products aren&apos;t built from off-the-shelf parts —
              they share a common engineering base across counter-drone
              systems, autonomy, indigenous hardware, and field infrastructure.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Technology index */}
      <Section tone="light">
        <SectionHeading
          index="01"
          eyebrow="Capability Stack"
          title="What each capability area actually enables."
          description="Each area below is applied across multiple products — not a standalone service, but a shared capability that compounds across the ecosystem."
        />

        <RevealGroup className="mt-14 flex flex-col">
          {technologies.map((tech, i) => (
            <RevealItem key={tech.slug}>
              <div
                id={tech.slug}
                className="scroll-mt-28 grid grid-cols-1 gap-6 border-t border-ink/10 py-10 md:grid-cols-12 md:gap-8"
              >
                <div className="md:col-span-1">
                  <span className="font-mono-label text-sm text-ink/30">
                    [ {String(i + 1).padStart(2, "0")} ]
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-xl font-semibold text-ink">{tech.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-ink/60 md:col-span-4">
                  {tech.description}
                </p>
                <div className="flex flex-wrap items-start gap-2 md:col-span-3">
                  {tech.appliedInProductSlugs.map((slug) => {
                    const product = productByslug.get(slug);
                    return product ? (
                      <Link
                        key={slug}
                        href={`/products/${slug}`}
                        className="group font-mono-label inline-flex cursor-pointer items-center gap-1 border border-ink/15 px-2.5 py-1.5 text-[10px] uppercase text-ink/60 transition-colors hover:border-brand hover:text-brand"
                      >
                        {product.name}
                        <ArrowUpRight size={10} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* CTA */}
      <Section tone="night" className="!py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono-label text-xs uppercase text-brand">[ 02 ]</span>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            See these disciplines applied in the field.
          </h2>
          <p className="max-w-lg text-balance text-night-muted">
            Explore the systems these technologies power, or reach out directly
            for a technical briefing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/products">Explore products</ButtonLink>
            <ButtonLink href="/contact" variant="ghost" showArrow={false}>
              Contact Stravex
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
