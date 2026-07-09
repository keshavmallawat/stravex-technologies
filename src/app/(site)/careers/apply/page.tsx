import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/section";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/reveal";
import { CareerApplicationForm } from "@/components/career-application-form";
import { getPublishedJobOpeningById } from "@/lib/job-openings-data";

export const metadata: Metadata = {
  title: "Apply | Stravex Technologies",
  description: "Submit your application to join Stravex Technologies.",
};

export default async function CareerApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>;
}) {
  const { jobId } = await searchParams;
  const job = jobId ? await getPublishedJobOpeningById(jobId) : null;
  const roleLabel = job?.title ?? "General Application";

  return (
    <>
      <section className="border-b border-ink/10 bg-white">
        <Container className="py-24 md:py-28">
          <FadeIn>
            <Link
              href="/careers"
              className="font-mono-label inline-flex cursor-pointer items-center gap-2 text-xs uppercase text-ink/50 transition-colors hover:text-brand"
            >
              <ArrowLeft size={12} weight="bold" />
              All openings
            </Link>
          </FadeIn>
          <FadeIn delay={0.06}>
            <span className="font-mono-label mt-6 block text-xs uppercase text-brand">
              [ Application ]
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">
              {roleLabel}
            </h1>
          </FadeIn>
          {job && (
            <FadeIn delay={0.14}>
              <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-ink/60">
                {job.department} · {job.employmentType} · {job.location}
              </p>
            </FadeIn>
          )}
        </Container>
      </section>

      <Section tone="light">
        <div className="mx-auto max-w-2xl">
          <CareerApplicationForm jobOpeningId={job?.id} roleLabel={roleLabel} />
        </div>
      </Section>
    </>
  );
}
