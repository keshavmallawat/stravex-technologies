import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { PlaceholderNoteLight } from "@/components/badge";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { getPublishedJobOpenings } from "@/lib/job-openings-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("careers");
  return applySeoOverride(override, {
    title: "Careers | Stravex Technologies",
    description:
      "Join Stravex Technologies to work on hard, unglamorous engineering problems in indigenous tactical hardware.",
  });
}

const reasons = [
  {
    title: "Problems without off-the-shelf answers",
    body: "Detection, interception, indigenous avionics — none of this comes from a library or an API. You're building it from first principles.",
  },
  {
    title: "Small team, real ownership",
    body: "Early-stage engineering teams mean your decisions ship, not get lost in a backlog.",
  },
  {
    title: "Full-stack hardware exposure",
    body: "Work across AI/computer vision, embedded firmware, mechanical design, and field operations — not one narrow slice.",
  },
  {
    title: "Built for the field, not the demo",
    body: "Every system is judged by whether it works in real operational conditions, not how it looks in a pitch deck.",
  },
];

const disciplines = [
  "AI & Computer Vision Engineering",
  "Avionics & Embedded Systems",
  "Aerospace & Mechanical Engineering",
  "Field Operations & Training",
  "Manufacturing & Systems Integration",
];

export default async function CareersPage() {
  const jobOpenings = await getPublishedJobOpenings();
  const hasOpenings = jobOpenings.length > 0;
  const openPositionsIndex = "03";
  const ctaIndex = hasOpenings ? "04" : "03";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_60%_60%_at_70%_40%,black,transparent)]" />
        <div className="relative mx-auto flex min-h-[55vh] w-full max-w-[1280px] flex-col justify-center px-6 py-28 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Careers ]
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              Solve problems that don&apos;t have off-the-shelf solutions.
            </h1>
          </FadeIn>
          <FadeIn delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Stravex is a small, engineering-led team building indigenous
              tactical hardware — from AI-driven interception to avionics
              built from scratch.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Why work here */}
      <Section tone="light">
        <SectionHeading index="01" eyebrow="Why Stravex" title="What working here actually looks like." />
        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {reasons.map((reason) => (
            <RevealItem key={reason.title}>
              <div className="h-full border border-ink/10 p-7">
                <h3 className="text-lg font-semibold text-ink">{reason.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{reason.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* Disciplines we hire for */}
      <Section tone="mist">
        <SectionHeading index="02" eyebrow="Where We Hire" title="Disciplines across the ecosystem." />
        <RevealGroup className="mt-10 flex flex-col">
          {disciplines.map((d, i) => (
            <RevealItem key={d}>
              <div className="flex items-center justify-between border-t border-ink/10 py-5">
                <div className="flex items-center gap-4">
                  <span className="font-mono-label text-xs text-ink/30">
                    [ {String(i + 1).padStart(2, "0")} ]
                  </span>
                  <span className="text-base font-medium text-ink">{d}</span>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
        {!hasOpenings && (
          <div className="mt-10 max-w-2xl">
            <PlaceholderNoteLight>
              Specific open roles are not yet listed. If your background fits
              one of the disciplines above, reach out directly with your
              resume.
            </PlaceholderNoteLight>
            <div className="mt-6">
              <ButtonLink href="/careers/apply">Submit a General Application</ButtonLink>
            </div>
          </div>
        )}
      </Section>

      {/* Open Positions */}
      {hasOpenings && (
        <Section tone="light">
          <SectionHeading
            index={openPositionsIndex}
            eyebrow="Open Positions"
            title="Current openings."
          />
          <RevealGroup className="mt-12 flex flex-col gap-6">
            {jobOpenings.map((job) => (
              <RevealItem key={job.id}>
                <div className="border border-ink/10 p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-ink">{job.title}</h3>
                      <p className="font-mono-label mt-1 text-[11px] uppercase text-brand">
                        {job.department}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/60">
                        {job.employmentType}
                      </span>
                      <span className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/60">
                        {job.location}
                      </span>
                      <span className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/60">
                        {job.workMode}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                    {job.responsibilities.length > 0 && (
                      <div>
                        <span className="font-mono-label text-xs uppercase text-ink/40">
                          [ Key Responsibilities ]
                        </span>
                        <ul className="mt-3 space-y-2 text-sm text-ink/70">
                          {job.responsibilities.map((r) => (
                            <li key={r}>— {r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {job.skills.length > 0 && (
                      <div>
                        <span className="font-mono-label text-xs uppercase text-ink/40">
                          [ Required Skills ]
                        </span>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="font-mono-label border border-ink/15 px-3 py-1.5 text-[11px] uppercase text-ink/60"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {job.requirements.length > 0 && (
                    <div className="mt-6 border-t border-ink/10 pt-6">
                      <span className="font-mono-label text-xs uppercase text-ink/40">
                        [ Requirements ]
                      </span>
                      <ul className="mt-3 space-y-2 text-sm text-ink/70">
                        {job.requirements.map((r) => (
                          <li key={r}>— {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.salary && (
                    <p className="mt-6 text-sm text-ink/50">
                      <span className="font-mono-label uppercase text-ink/40">Salary: </span>
                      {job.salary}
                    </p>
                  )}

                  <div className="mt-7">
                    <ButtonLink href={`/careers/apply?jobId=${job.id}`}>
                      Apply Now
                    </ButtonLink>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}

      {/* CTA */}
      <Section tone="night" className="!py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono-label text-xs uppercase text-brand">[ {ctaIndex} ]</span>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Don&apos;t see an open role that fits?
          </h2>
          <p className="max-w-lg text-balance text-night-muted">
            Send your resume and a note about what you want to build — we read
            every one.
          </p>
          <ButtonLink href="/careers/apply">Submit a General Application</ButtonLink>
        </div>
      </Section>
    </>
  );
}
