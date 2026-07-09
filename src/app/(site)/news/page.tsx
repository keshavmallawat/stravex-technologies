import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { MediaFrame } from "@/components/media-frame";
import { PlaceholderNoteLight } from "@/components/badge";
import { RevealGroup, RevealItem, FadeIn } from "@/components/reveal";
import { getPublishedNewsPosts, type PublicNewsPost } from "@/lib/news-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("news");
  return applySeoOverride(override, {
    title: "News | Stravex Technologies",
    description:
      "Press coverage and announcements from Stravex Technologies' indigenous tactical defence systems.",
  });
}

function newsHref(item: PublicNewsPost) {
  return item.externalUrl || `/news/${item.slug}`;
}

function linkProps(item: PublicNewsPost) {
  return item.externalUrl ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

export default async function NewsPage() {
  const posts = await getPublishedNewsPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Masthead hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="relative mx-auto flex min-h-[38vh] w-full max-w-[1280px] flex-col justify-end px-6 pb-14 pt-32 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Issue 01 ]
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              News
            </h1>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Press coverage and announcements about Stravex systems. For
              company-authored articles, see the{" "}
              <Link href="/blog" className="cursor-pointer text-brand underline underline-offset-2">
                Blog
              </Link>
              .
            </p>
          </FadeIn>
        </div>
        <div className="border-t border-night-border" />
      </section>

      {!featured ? (
        <Section tone="light">
          <SectionHeading
            index="01"
            eyebrow="Nothing Yet"
            title="No news published yet."
          />
          <div className="mt-10 max-w-2xl">
            <PlaceholderNoteLight>
              Press coverage and company announcements will appear here as
              they are published.
            </PlaceholderNoteLight>
          </div>
        </Section>
      ) : (
        <>
          {/* Featured story */}
          <Section tone="light" className="!pt-16">
            <span className="font-mono-label text-xs uppercase text-ink/40">
              [ Featured {featured.outlet ? "— Third-Party Coverage" : ""} ]
            </span>
            <FadeIn>
              <a
                href={newsHref(featured)}
                {...linkProps(featured)}
                className="group mt-6 grid cursor-pointer grid-cols-1 gap-8 border-t border-ink/10 pt-10 lg:grid-cols-3"
              >
                <div className="lg:col-span-1">
                  <MediaFrame
                    aspect="4 / 3"
                    tone="light"
                    icon={Newspaper}
                    label="Media Thumbnail"
                    sublabel={featured.outlet ?? "Stravex Technologies"}
                    src={featured.featuredImageUrl ?? undefined}
                  />
                </div>
                <div className="lg:col-span-2">
                  <span className="font-mono-label text-xs uppercase text-ink/40">
                    {featured.outlet ?? "Stravex Technologies"}
                  </span>
                  <h2 className="mt-3 text-balance text-2xl font-semibold leading-snug text-ink group-hover:text-brand md:text-3xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
                      {featured.excerpt}
                    </p>
                  )}
                  <span className="font-mono-label mt-6 inline-block text-xs uppercase text-brand">
                    [ {featured.outlet ? `Read at ${featured.outlet}` : "Read more"} ]
                  </span>
                </div>
              </a>
            </FadeIn>
          </Section>

          {/* Other coverage */}
          {rest.length > 0 && (
            <Section tone="mist" className="!pt-10">
              <SectionHeading index="01" eyebrow="More Coverage" title="Additional press mentions" />
              <RevealGroup className="mt-10 flex flex-col">
                {rest.map((item, i) => (
                  <RevealItem key={item.slug}>
                    <a
                      href={newsHref(item)}
                      {...linkProps(item)}
                      className="group grid cursor-pointer grid-cols-1 gap-4 border-t border-ink/10 py-6 transition-colors hover:bg-white md:grid-cols-12 md:items-center md:px-6"
                    >
                      <span className="font-mono-label text-sm text-ink/30 md:col-span-1">
                        [ {String(i + 2).padStart(2, "0")} ]
                      </span>
                      <div className="md:col-span-2">
                        <MediaFrame
                          aspect="4 / 3"
                          tone="light"
                          icon={Newspaper}
                          label="Thumbnail"
                          className="max-w-[120px]"
                          src={item.featuredImageUrl ?? undefined}
                        />
                      </div>
                      <span className="font-mono-label text-xs uppercase text-ink/40 md:col-span-2">
                        {item.outlet ?? "Stravex Technologies"}
                      </span>
                      <h3 className="text-base font-medium leading-snug text-ink group-hover:text-brand md:col-span-5">
                        {item.title}
                      </h3>
                      <span className="font-mono-label text-xs uppercase text-ink/50 transition-colors group-hover:text-brand md:col-span-2 md:text-right">
                        [ Read ]
                      </span>
                    </a>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Section>
          )}
        </>
      )}

      {/* CTA */}
      <Section tone="night" className="!py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="font-mono-label text-xs uppercase text-brand">[ 02 ]</span>
          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Press or media enquiry?
          </h2>
          <p className="max-w-lg text-balance text-night-muted">
            Reach out to the Stravex team directly.
          </p>
          <ButtonLink href="/contact">Contact Stravex</ButtonLink>
        </div>
      </Section>
    </>
  );
}
