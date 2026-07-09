import Link from "next/link";
import { EnvelopeSimple, MapPin, Phone, LinkedinLogo, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Container } from "./container";
import { Logo } from "./logo";
import { getPublishedProducts } from "@/lib/products-data";
import type { SiteSettingsData } from "@/lib/settings-data";

export async function Footer({ settings }: { settings: SiteSettingsData }) {
  const products = await getPublishedProducts();
  return (
    <footer className="border-t border-night-border bg-night text-white">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo dark darkSrc={settings.logoDarkUrl} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-night-muted">
            {settings.footerTagline}
          </p>
          <div className="mt-6 space-y-2 text-sm text-night-muted">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand" />
              <span>
                {settings.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeSimple size={16} className="shrink-0 text-brand" />
              <a
                href={`mailto:${settings.email}`}
                className="cursor-pointer transition-colors hover:text-brand"
              >
                {settings.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-brand" />
              <a
                href={settings.phoneHref}
                className="cursor-pointer transition-colors hover:text-brand"
              >
                {settings.phone}
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            {settings.socialLinks.linkedin && (
              <a
                href={settings.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stravex Technologies on LinkedIn"
                className="flex h-9 w-9 cursor-pointer items-center justify-center border border-night-border text-white/70 transition-colors hover:border-brand hover:text-brand"
              >
                <LinkedinLogo size={16} />
              </a>
            )}
            {settings.socialLinks.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stravex Technologies on Instagram"
                className="flex h-9 w-9 cursor-pointer items-center justify-center border border-night-border text-white/70 transition-colors hover:border-brand hover:text-brand"
              >
                <InstagramLogo size={16} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-mono-label text-xs uppercase text-night-muted">
            Navigate
          </h3>
          <ul className="mt-4 space-y-2.5">
            {settings.navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="cursor-pointer text-sm text-white/80 transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono-label text-xs uppercase text-night-muted">
            Ecosystem
          </h3>
          <ul className="mt-4 space-y-2.5">
            {products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  className="cursor-pointer text-sm text-white/80 transition-colors hover:text-brand"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-night-border py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-xs text-night-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <p className="font-mono-label uppercase">Indigenous. Engineering-led. Mission-ready.</p>
        </Container>
      </div>
    </footer>
  );
}
