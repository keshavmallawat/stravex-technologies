import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PencilSimpleLine, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/button-link";
import { PlaceholderNoteLight } from "@/components/badge";
import { FadeIn, RevealGroup, RevealItem } from "@/components/reveal";
import { getPublishedBlogPosts } from "@/lib/blog-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("blog");
  return applySeoOverride(override, {
    title: "Blog | Stravex Technologies",
    description: "Engineering notes and updates from the Stravex Technologies team.",
  });
}

const exampleDirections = [
  "Engineering write-ups on individual systems",
  "Why indigenous hardware matters for Indian UAV manufacturing",
  "Field notes from training and deployment",
  "Product milestones as development progresses",
];

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      {/* Masthead hero */}
      <section className="relative overflow-hidden bg-night text-white">
        <div className="relative mx-auto flex min-h-[38vh] w-full max-w-[1280px] flex-col justify-end px-6 pb-14 pt-32 md:px-10">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Engineering Notes ]
            </span>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
              Blog
            </h1>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-night-muted md:text-lg">
              Company-authored articles from the Stravex team. For
              independent coverage, see{" "}
              <Link href="/news" className="cursor-pointer text-brand underline underline-offset-2">
                News
              </Link>
              .
            </p>
          </FadeIn>
        </div>
        <div className="border-t border-night-border" />
      </section>

      {posts.length === 0 ? (
        <>
          {/* Empty state */}
          <Section tone="light">
            <SectionHeading
              index="01"
              eyebrow="First Post Pending"
              title="Nothing published yet — here's the kind of content this space is for."
            />
            <div className="mt-10 max-w-2xl">
              <PlaceholderNoteLight>
                No articles have been published yet. This page will host
                engineering write-ups, product updates, and field notes as they
                are written.
              </PlaceholderNoteLight>
            </div>

            <div className="mt-12 flex flex-col">
              {exampleDirections.map((topic, i) => (
                <div
                  key={topic}
                  className="flex items-center gap-4 border-t border-ink/10 py-5 text-ink/50"
                >
                  <PencilSimpleLine size={16} className="shrink-0 text-ink/30" />
                  <span className="font-mono-label text-xs text-ink/30">
                    [ {String(i + 1).padStart(2, "0")} ]
                  </span>
                  <span className="text-sm">{topic}</span>
                  <span className="font-mono-label ml-auto text-[10px] uppercase text-ink/30">
                    Example
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section tone="night" className="!py-24">
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="font-mono-label text-xs uppercase text-brand">[ 02 ]</span>
              <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Want to be notified when we publish?
              </h2>
              <p className="max-w-lg text-balance text-night-muted">
                Reach out and we&apos;ll keep you posted on new engineering notes.
              </p>
              <ButtonLink href="/contact">Contact Stravex</ButtonLink>
            </div>
          </Section>
        </>
      ) : (
        <Section tone="light">
          <SectionHeading index="01" eyebrow="Latest" title="Engineering notes from the team." />
          <RevealGroup className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <RevealItem key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full cursor-pointer flex-col border border-ink/10 bg-white transition-colors hover:border-brand"
                >
                  {post.featuredImageUrl && (
                    <div className="relative aspect-video w-full overflow-hidden bg-mist">
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.category && (
                      <span className="font-mono-label text-[11px] uppercase text-brand">
                        {post.category}
                      </span>
                    )}
                    <h3 className="mt-2 text-lg font-semibold text-ink">{post.title}</h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm text-ink/60">{post.excerpt}</p>
                    )}
                    <span className="font-mono-label mt-auto flex items-center gap-1.5 pt-6 text-xs uppercase text-ink/50 group-hover:text-brand">
                      Read more
                      <ArrowUpRight size={12} weight="bold" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      )}
    </>
  );
}
