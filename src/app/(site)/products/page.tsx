import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Package } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { StatusBadge } from "@/components/badge";
import { MediaFrame } from "@/components/media-frame";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { getPublishedProducts } from "@/lib/products-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("products");
  return applySeoOverride(override, {
    title: "Products | Stravex Technologies",
    description:
      "Five integrated tactical defence systems — detection, interception, autonomous flight, avionics, pilot training, and field sustainment.",
  });
}

const ecosystemCoverage = [
  "Detection",
  "Interception",
  "Autonomous Flight",
  "UAV Electronics",
  "Pilot Training",
  "Mission Simulation",
  "Drone Manufacturing",
  "Field Repair & Maintenance",
  "Payload Integration",
  "Tactical Deployment",
];

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto flex min-h-[60vh] w-full max-w-[1280px] flex-col justify-center px-6 py-28 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Product Ecosystem ]
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              Five systems.
              <br />
              One tactical defence platform.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Stravex builds an integrated ecosystem of indigenous tactical
              technologies rather than isolated products — spanning detection,
              interception, autonomous flight, avionics, pilot training, and
              field sustainment.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Coverage tags */}
      <Section tone="light" className="!py-14">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          <span className="font-mono-label text-xs uppercase text-ink/40">
            System coverage —
          </span>
          {ecosystemCoverage.map((item) => (
            <span
              key={item}
              className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/70"
            >
              {item}
            </span>
          ))}
        </div>
      </Section>

      {/* Poster cards */}
      <Section tone="mist">
        <SectionHeading
          index="01"
          eyebrow="The Systems"
          title="Every product engineered as part of one pipeline."
          description="From spotting a threat to relaunching a repaired aircraft in the field — each system below covers one stage of the tactical UAV lifecycle."
        />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {products.map((product, index) => (
            <RevealItem key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                className="group flex flex-col md:flex-row cursor-pointer border border-night-border bg-night-elevated transition-colors duration-200 hover:border-brand/50"
              >
                <div className="w-full md:w-[40%] flex-shrink-0 border-b border-night-border md:border-b-0 md:border-r">
                  <MediaFrame
                    aspect="1414 / 2000"
                    icon={Package}
                    label="Product Poster"
                    sublabel={`${product.name} · Poster`}
                    bordered={false}
                    src={product.heroPosterUrl ?? undefined}
                    alt={`Render poster of ${product.name}`}
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-7 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono-label text-xs text-night-muted">
                      [ {String(index + 1).padStart(2, "0")} ]
                    </span>
                    <StatusBadge status={product.displayStatus} />
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="font-mono-label mt-1 text-[11px] uppercase text-brand">
                    {product.category}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-night-muted">
                    {product.positioning}
                  </p>

                  <div className="font-mono-label mt-8 flex items-center gap-2 text-xs uppercase text-white/80 transition-colors duration-200 group-hover:text-brand">
                    [ View system
                    <ArrowUpRight
                      size={13}
                      weight="bold"
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                    ]
                  </div>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* CTA */}
      <Section tone="night" className="!py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono-label text-xs uppercase text-brand">[ 02 ]</span>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Interested in a system briefing?
          </h2>
          <p className="max-w-lg text-balance text-night-muted">
            Reach out for technical documentation, partnership discussions, or
            procurement enquiries.
          </p>
          <ButtonLink href="/contact">Contact Stravex</ButtonLink>
        </div>
      </Section>
    </>
  );
}
