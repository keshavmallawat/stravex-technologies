import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/section";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/reveal";
import type { PublicNewsPost } from "@/lib/news-data";

export function NewsPostView({
  post,
  isPreview = false,
}: {
  post: Pick<
    PublicNewsPost,
    "title" | "outlet" | "externalUrl" | "featuredImageUrl" | "content"
  >;
  isPreview?: boolean;
}) {
  return (
    <>
      {isPreview && (
        <div className="bg-amber-soft border-b border-amber/40 px-6 py-2 text-center">
          <span className="font-mono-label text-[10px] uppercase text-amber">
            [ Draft Preview — Not Publicly Visible ]
          </span>
        </div>
      )}
      <section className="border-b border-ink/10 bg-white">
        <Container className="py-20 md:py-24">
          <FadeIn>
            <Link
              href="/news"
              className="font-mono-label inline-flex cursor-pointer items-center gap-2 text-xs uppercase text-ink/50 transition-colors hover:text-brand"
            >
              <ArrowLeft size={12} weight="bold" />
              All news
            </Link>
          </FadeIn>
          <FadeIn delay={0.06}>
            <span className="font-mono-label mt-6 block text-xs uppercase text-brand">
              [ {post.outlet ?? "Stravex Technologies"} ]
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">
              {post.title}
            </h1>
          </FadeIn>
          {post.externalUrl && (
            <FadeIn delay={0.14}>
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-label mt-5 inline-flex cursor-pointer items-center gap-1.5 border border-brand px-4 py-2.5 text-xs uppercase text-brand hover:bg-brand-soft"
              >
                Originally published at {post.outlet ?? "source"}
                <ArrowUpRight size={12} weight="bold" />
              </a>
            </FadeIn>
          )}
        </Container>
      </section>

      {post.featuredImageUrl && (
        <div className="relative aspect-[21/9] w-full bg-mist">
          <Image
            src={post.featuredImageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <Section tone="light">
        <div
          className="mx-auto max-w-3xl text-base leading-relaxed text-ink/80 [&_a]:text-brand [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-brand/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:my-6 [&_img]:w-full [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Section>
    </>
  );
}
