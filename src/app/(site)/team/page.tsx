import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { MediaFrame } from "@/components/media-frame";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { getPublishedTeamMembers } from "@/lib/team-data";
import { resolveTeamMemberPhotoSrc } from "@/lib/team-photo";
import { getActivePartners } from "@/lib/partners-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("team");
  return applySeoOverride(override, {
    title: "Team | Stravex Technologies",
    description:
      "The founding team behind Stravex Technologies' indigenous defence systems.",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default async function TeamPage() {
  const [founders, incubators] = await Promise.all([
    getPublishedTeamMembers(),
    getActivePartners("incubator"),
  ]);
  const combinedExpertise = Array.from(
    new Set(founders.flatMap((f) => f.expertiseTags))
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="grid h-full grid-cols-6 opacity-30">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-r border-night-border" />
            ))}
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[50vh] w-full max-w-[1280px] flex-col justify-center px-6 py-28 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Founding Team ]
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              Three founders. One engineering-led mission.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Krishna Mallawat, Atharva Dalvi, and Harsh Patil combine
              strategic vision, technical depth, and operational execution to
              build India&apos;s indigenous defence technology ecosystem.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Founders */}
      <Section tone="light">
        <SectionHeading
          index="01"
          eyebrow="Leadership"
          title="The people building Stravex."
        />

        <RevealGroup className="mt-14 flex flex-col">
          {founders.map((founder, i) => (
            <RevealItem key={founder.id}>
              <div className="grid grid-cols-1 gap-6 border-t border-ink/10 py-10 lg:grid-cols-12 lg:gap-8">
                <div className="flex items-center gap-3 lg:col-span-1 lg:block">
                  <span className="font-mono-label text-sm text-ink/30">
                    [ {String(i + 1).padStart(2, "0")} ]
                  </span>
                </div>

                <div className="lg:col-span-3">
                  <MediaFrame
                    aspect="3 / 4"
                    tone="light"
                    className="max-w-[200px]"
                    src={resolveTeamMemberPhotoSrc(founder.name, founder.photoUrl)}
                    alt={`Photograph of ${founder.name}, ${founder.role}`}
                    sizes="(max-width: 768px) 200px, 200px"
                    priority={i === 0}
                  >
                    <span className="font-display text-4xl font-bold text-brand/30">
                      {initials(founder.name)}
                    </span>
                    <span className="font-mono-label mt-4 text-[9px] uppercase text-ink/30">
                      [ Portrait — to be added ]
                    </span>
                  </MediaFrame>
                </div>

                <div className="lg:col-span-3">
                  {founder.department && (
                    <span className="font-mono-label text-[11px] uppercase text-brand">
                      [ {founder.department} ]
                    </span>
                  )}
                  <h3 className="mt-2 text-xl font-semibold text-ink">
                    {founder.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-ink/55">{founder.role}</p>
                </div>

                <div className="lg:col-span-5">
                  <p className="text-base leading-relaxed text-ink/70">
                    {founder.bio}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {founder.expertiseTags.map((skill) => (
                      <span
                        key={skill}
                        className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Combined expertise */}
      <Section tone="mist">
        <SectionHeading
          index="02"
          eyebrow="Combined Expertise"
          title={`Full-stack coverage across ${combinedExpertise.length} engineering disciplines.`}
          description="Between them, the founding team spans strategy, hardware, AI/ML, and operational deployment — the full pipeline a defence system needs to go from concept to field."
        />
        <div className="mt-10 flex flex-wrap gap-2.5">
          {combinedExpertise.map((skill) => (
            <span
              key={skill}
              className="font-mono-label border border-ink/15 bg-white px-3.5 py-2 text-xs uppercase text-ink/70"
            >
              {skill}
            </span>
          ))}
        </div>
      </Section>

      {/* Incubation / backing */}
      {incubators.length > 0 && (
        <Section tone="light">
          <SectionHeading index="03" eyebrow="Backed By" title="Grown inside India's engineering institutions." />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {incubators.map((incubator) => (
              <div key={incubator.id} className="border border-ink/10 p-7">
                <span className="font-mono-label text-xs uppercase text-brand">[ Incubator ]</span>
                <h3 className="mt-3 text-lg font-semibold text-ink">{incubator.name}</h3>
                {incubator.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">
                    {incubator.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section tone="night" className="!py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono-label text-xs uppercase text-brand">[ 04 ]</span>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Want to work on problems like these?
          </h2>
          <p className="max-w-lg text-balance text-night-muted">
            Stravex is a small, founder-led team solving hard, unglamorous
            problems in tactical hardware.
          </p>
          <ButtonLink href="/careers">View careers</ButtonLink>
        </div>
      </Section>
    </>
  );
}
