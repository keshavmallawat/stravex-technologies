import type { Metadata } from "next";
import { SealCheck, Wrench, Factory, Buildings } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { PlaceholderNoteLight } from "@/components/badge";
import { MediaFrame } from "@/components/media-frame";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { getActivePartners } from "@/lib/partners-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("about");
  return applySeoOverride(override, {
    title: "About | Stravex Technologies",
    description:
      "Stravex Technologies is an Indian defence technology company engineering indigenous tactical systems — our story, mission, engineering philosophy, and values.",
  });
}

const philosophy = [
  { name: "Indigenous engineering", detail: "Designed and manufactured in India, not licensed or re-badged from foreign suppliers." },
  { name: "Precision engineering", detail: "Every subsystem tuned for accuracy under real operational constraints, not lab conditions." },
  { name: "Mission-critical reliability", detail: "Built to function when failure carries real operational consequences." },
  { name: "AI-assisted autonomy", detail: "Optical detection, classification, and flight stabilization reduce operator workload." },
  { name: "Modular architecture", detail: "Shared components and swappable payloads across the product ecosystem." },
  { name: "Rapid deployment", detail: "Systems designed to go from storage to operational within minutes." },
  { name: "Operational simplicity", detail: "Interfaces built for trained field personnel, not specialist engineers." },
  { name: "Technical credibility", detail: "Every claim traceable to an engineering decision, not a marketing one." },
  { name: "Field readiness", detail: "Tested against the conditions systems will actually operate in." },
  { name: "Systems thinking", detail: "Products are designed as parts of a pipeline, not standalone hardware." },
];

const values = [
  {
    title: "Indigenous by design",
    body: "We build the electronics, flight control, and interception hardware ourselves — dependency on foreign supply chains is a strategic risk, not a convenience trade-off.",
  },
  {
    title: "Systems, not standalone products",
    body: "Every system is engineered to plug into a larger pipeline — detection feeds interception, training feeds deployment, repair feeds redeployment.",
  },
  {
    title: "Field-first, not lab-first",
    body: "We design for Indian operational conditions from the outset, rather than adapting a lab prototype after the fact.",
  },
  {
    title: "Say what's proven, and what isn't",
    body: "Every system on this site is labeled by its actual development stage. We don't blur the line between shipped and in-progress.",
  },
];

const missionLabels = [
  { label: "Operational Readiness" },
  { label: "Sovereign Technology" },
  { label: "Battlefield Empowerment" },
];

const insideStravex = [
  { label: "Engineering Lab", icon: Wrench },
  { label: "Manufacturing / R&D", icon: Factory },
  { label: "Office", icon: Buildings },
];

const timeline = [
  {
    label: "Origin",
    body: "Stravex Technologies founded in Navi Mumbai to build indigenous tactical defence systems.",
  },
  {
    label: "Incubation",
    body: "Incubated under the Marathwada Accelerator for Growth & Incubation (MAGIC) and IIT Ropar's Technology Business Incubator Foundation (TBIF).",
  },
  {
    label: "Ecosystem build-out",
    body: "Five systems — AgniStrike, FPV Drones, Indigenous Flight Controller & ESC, RAKSHAKH, and RUDRA — enter active engineering development.",
    placeholder: false,
  },
  {
    label: "What's next",
    body: "Field validation milestones, partnerships, and deployment timelines will be announced here as they are confirmed.",
    placeholder: true,
  },
];

export default async function AboutPage() {
  const affiliations = await getActivePartners("incubator");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_60%_60%_at_30%_40%,black,transparent)]" />
        <div className="relative mx-auto flex min-h-[55vh] w-full max-w-[1280px] flex-col justify-center px-6 py-28 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              19.0330°N · 73.0297°E — Navi Mumbai, India
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              An engineering company first. A defence company by mission.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Stravex Technologies is an Indian defence technology company
              engineering indigenous tactical systems for modern defence
              operations — built as one ecosystem, not a catalogue of
              unrelated hardware.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story */}
      <Section tone="light">
        <SectionHeading index="01" eyebrow="Company Story" title="Why Stravex exists" />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2">
            <p className="text-balance text-lg leading-relaxed text-ink/75 md:text-xl">
              Stravex Technologies is building India&apos;s indigenous drone
              and counter-drone ecosystem — engineering solutions that reduce
              dependence on imported defence systems and address the
              operational realities of modern warfare. Our systems support
              counter-drone defence, autonomous operations, pilot training,
              and mobile repair infrastructure, all engineered for Indian
              conditions.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="border-l-2 border-brand pl-6">
              <p className="font-mono-label text-xs uppercase text-ink/40">
                [ Positioning ]
              </p>
              <p className="mt-3 text-balance text-lg font-medium leading-snug text-ink">
                Indigenous engineering, engineered as one ecosystem — not a
                catalogue of isolated hardware.
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section tone="mist">
        <SectionHeading index="02" eyebrow="Why Stravex" title="Mission &amp; Vision" />
        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-2">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Mission ]
            </span>
            <p className="mt-4 text-balance text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              To secure India&apos;s skies by engineering high-performance,
              fully indigenous drone and counter-drone systems — eliminating
              foreign dependency and delivering strategic autonomy to our
              defence forces.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {missionLabels.map((item) => (
                <span
                  key={item.label}
                  className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/60"
                >
                  {item.label}
                </span>
              ))}
            </div>
            <div className="mt-3">
              <PlaceholderNoteLight>
                One-line description for each supporting label to be added
              </PlaceholderNoteLight>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Vision ]
            </span>
            <p className="mt-4 text-balance text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
              To expand Indian innovation in defence technology, architect the
              infrastructure of an Aatmanirbhar Bharat, and set global
              standards for indigenous drone and counter-drone systems.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* Why indigenous matters */}
      <Section tone="light">
        <SectionHeading
          index="03"
          eyebrow="Why It Matters"
          title="Why indigenous technology, specifically"
        />
        <div className="mt-10 max-w-3xl">
          <p className="text-balance text-lg leading-relaxed text-ink/70">
            Components like flight controllers, motor controllers, and
            optical detection systems are among the most import-dependent
            parts of Indian UAV manufacturing. A supply chain built on
            foreign hardware is a strategic liability during exactly the
            moments when autonomy matters most. Building these systems
            in-house — from avionics to interception hardware — is what makes
            the rest of the ecosystem possible without relying on parts or
            permissions from outside India.
          </p>
        </div>
      </Section>

      {/* Engineering philosophy */}
      <Section tone="mist">
        <SectionHeading
          index="04"
          eyebrow="Engineering Philosophy"
          title="Ten principles every system is measured against."
        />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {philosophy.map((item, i) => (
            <RevealItem key={item.name}>
              <div className="flex gap-4 border-t border-ink/10 pt-5">
                <span className="font-mono-label mt-0.5 text-xs text-brand">
                  [ {String(i + 1).padStart(2, "0")} ]
                </span>
                <div>
                  <span className="text-sm font-semibold text-ink">{item.name}</span>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{item.detail}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Timeline */}
      <Section tone="light">
        <SectionHeading index="05" eyebrow="Timeline" title="Where we are, and where we're going." />
        <RevealGroup className="mt-14 flex flex-col">
          {timeline.map((item, i) => (
            <RevealItem key={item.label}>
              <div className="grid grid-cols-1 gap-3 border-t border-ink/10 py-8 md:grid-cols-12 md:gap-6">
                <span className="font-mono-label text-sm text-ink/30 md:col-span-1">
                  [ {String(i + 1).padStart(2, "0")} ]
                </span>
                <h3 className="text-lg font-semibold text-ink md:col-span-3">
                  {item.label}
                </h3>
                <p className="text-sm leading-relaxed text-ink/60 md:col-span-6">
                  {item.body}
                </p>
                <div className="md:col-span-2 md:text-right">
                  {item.placeholder && <PlaceholderNoteLight>To be announced</PlaceholderNoteLight>}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Incubated & Supported By */}
      {affiliations.length > 0 && (
        <Section tone="mist">
          <SectionHeading
            index="06"
            eyebrow="Incubated &amp; Supported By"
            title="Affiliations"
            description="Confirmed incubator relationships. Official logo assets will replace these placeholders once provided."
          />
          <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {affiliations.map((item) => (
              <RevealItem key={item.id}>
                <div className="flex h-full flex-col border border-ink/15 bg-white transition-colors duration-300 hover:border-brand/40">
                  <MediaFrame
                    aspect="16 / 9"
                    tone="light"
                    src={item.logoUrl ?? undefined}
                    alt={`${item.name} logo`}
                    icon={SealCheck}
                    label="Logo Pending"
                    sublabel="Official asset to follow"
                    className="grayscale"
                    bordered={false}
                  />
                  <div className="flex flex-1 flex-col border-t border-ink/10 p-5">
                    <h3 className="text-base font-semibold text-ink">{item.name}</h3>
                    {item.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-ink/55">
                        {item.description}
                      </p>
                    )}
                    <span className="font-mono-label mt-4 inline-block w-fit border border-brand/30 bg-brand-soft px-2.5 py-1 text-[10px] uppercase text-brand">
                      [ Incubated ]
                    </span>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* Inside Stravex */}
      <Section tone="light">
        <SectionHeading
          index="07"
          eyebrow="Inside Stravex"
          title="Where the systems get built."
        />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {insideStravex.map((item) => (
            <RevealItem key={item.label}>
              <MediaFrame aspect="4 / 3" tone="light" icon={item.icon} label={item.label} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Values */}
      <Section tone="mist">
        <SectionHeading index="08" eyebrow="Values" title="How we make engineering decisions." />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {values.map((value) => (
            <RevealItem key={value.title}>
              <div className="h-full border border-ink/10 bg-white p-7">
                <h3 className="text-lg font-semibold text-ink">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{value.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* CTA */}
      <Section tone="night" className="!py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono-label text-xs uppercase text-brand">[ 09 ]</span>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Want to know more about how we build?
          </h2>
          <p className="max-w-lg text-balance text-night-muted">
            Meet the team, explore the systems, or get in touch directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ButtonLink href="/team">Meet the team</ButtonLink>
            <ButtonLink href="/contact" variant="ghost" showArrow={false}>
              Contact Stravex
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
