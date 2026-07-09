import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { getPublishedSolutions } from "@/lib/solutions-data";
import { getPublishedProducts } from "@/lib/products-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("solutions");
  return applySeoOverride(override, {
    title: "Solutions | Stravex Technologies",
    description:
      "Operational use cases for Stravex systems — counter-UAS, border security, critical infrastructure, tactical operations, pilot training, and mobile battlefield support.",
  });
}

export default async function SolutionsPage() {
  const [solutions, products] = await Promise.all([
    getPublishedSolutions(),
    getPublishedProducts(),
  ]);
  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-grid absolute inset-0 opacity-25" />
          {[
            "top-8 left-8 border-l border-t",
            "top-8 right-8 border-r border-t",
            "bottom-8 left-8 border-l border-b",
            "bottom-8 right-8 border-r border-b",
          ].map((pos) => (
            <div key={pos} className={`absolute h-10 w-10 border-brand/40 ${pos}`} />
          ))}
        </div>
        <div className="relative mx-auto flex min-h-[55vh] w-full max-w-[1280px] flex-col justify-center px-6 py-28 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Operational Use Cases ]
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              Built around the mission, not the product catalogue.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Every operational scenario below draws on one or more Stravex
              systems, deployed together or independently depending on the
              mission.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Solutions grid */}
      <Section tone="light">
        <SectionHeading
          index="01"
          eyebrow="Use Cases"
          title="Six operational scenarios, one integrated ecosystem."
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, i) => (
            <RevealItem key={solution.slug}>
              <div className="flex h-full flex-col justify-between bg-white p-8">
                <div>
                  <span className="font-mono-label text-xs text-ink/30">
                    [ {String(i + 1).padStart(2, "0")} ]
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">
                    {solution.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">
                    {solution.description}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {solution.relatedProductSlugs.map((slug) => {
                    const product = getProductBySlug(slug);
                    if (!product) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/products/${slug}`}
                        className="group font-mono-label inline-flex cursor-pointer items-center gap-1 border border-ink/15 px-2.5 py-1.5 text-[10px] uppercase text-ink/60 transition-colors hover:border-brand hover:text-brand"
                      >
                        {product.name}
                        <ArrowUpRight size={10} weight="bold" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    );
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
            Not sure which system fits your scenario?
          </h2>
          <p className="max-w-lg text-balance text-night-muted">
            Talk to the Stravex team about your operational requirements.
          </p>
          <ButtonLink href="/contact">Contact Stravex</ButtonLink>
        </div>
      </Section>
    </>
  );
}
