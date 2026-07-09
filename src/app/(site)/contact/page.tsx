import type { Metadata } from "next";
import { EnvelopeSimple, MapPin, Clock, Phone, LinkedinLogo, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Section } from "@/components/section";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { FadeIn } from "@/components/reveal";
import { getSiteSettings } from "@/lib/settings-data";
import { getPageSeo, applySeoOverride } from "@/lib/seo-data";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeo("contact");
  return applySeoOverride(override, {
    title: "Contact | Stravex Technologies",
    description:
      "Get in touch with Stravex Technologies for partnership, procurement, press, or careers enquiries.",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Minimal hero */}
      <section className="border-b border-ink/10 bg-white">
        <Container className="py-24 md:py-28">
          <FadeIn>
            <span className="font-mono-label text-xs uppercase text-brand">
              [ Contact ]
            </span>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="mt-5 max-w-2xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl">
              Let&apos;s talk about your requirement.
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-ink/60">
              Procurement, partnerships, or press — reach out directly and the
              Stravex team will follow up.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Form + pathways */}
      <Section tone="light">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <span className="font-mono-label text-xs uppercase text-ink/40">
                [ Direct Contact ]
              </span>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <EnvelopeSimple size={18} className="mt-0.5 text-brand" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="cursor-pointer text-sm text-ink/70 transition-colors hover:text-brand"
                  >
                    {settings.email}
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 text-brand" />
                  <a
                    href={settings.phoneHref}
                    className="cursor-pointer text-sm text-ink/70 transition-colors hover:text-brand"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <span className="font-mono-label text-xs uppercase text-ink/40">
                [ Location ]
              </span>
              <div className="mt-4 flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand" />
                <p className="text-sm leading-relaxed text-ink/70">
                  {settings.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div>
              <span className="font-mono-label text-xs uppercase text-ink/40">
                [ Business Hours ]
              </span>
              <div className="mt-4 flex items-start gap-3">
                <Clock size={18} className="mt-0.5 text-brand" />
                <p className="text-sm leading-relaxed text-ink/70">
                  {settings.businessHoursDays}
                  <br />
                  {settings.businessHoursTime}
                </p>
              </div>
            </div>

            <div>
              <span className="font-mono-label text-xs uppercase text-ink/40">
                [ Follow ]
              </span>
              <div className="mt-4 flex items-center gap-3">
                {settings.socialLinks.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Stravex Technologies on LinkedIn"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center border border-ink/15 text-ink/60 transition-colors hover:border-brand hover:text-brand"
                  >
                    <LinkedinLogo size={18} />
                  </a>
                )}
                {settings.socialLinks.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Stravex Technologies on Instagram"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center border border-ink/15 text-ink/60 transition-colors hover:border-brand hover:text-brand"
                  >
                    <InstagramLogo size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
