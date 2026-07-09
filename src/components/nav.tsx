"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "./container";
import { Logo } from "./logo";
import type { NavLinkEntry } from "@/lib/settings-data";

export function Nav({
  navLinks,
  logoLightUrl,
}: {
  navLinks: NavLinkEntry[];
  logoLightUrl?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-ink/10"
          : "bg-white/0 border-b border-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="cursor-pointer" aria-label="Stravex Technologies home">
          <Logo lightSrc={logoLightUrl} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer text-sm font-medium transition-colors duration-200 ${
                  active ? "text-brand" : "text-ink/70 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="font-mono-label hidden cursor-pointer border border-ink/20 px-5 py-2.5 text-xs uppercase text-ink transition-colors duration-200 hover:border-brand hover:text-brand lg:inline-flex"
        >
          [ Get in Touch ]
        </Link>

        <button
          type="button"
          className="font-mono-label cursor-pointer border border-ink/20 px-3 py-2 text-xs uppercase text-ink transition-colors duration-200 hover:border-brand hover:text-brand lg:hidden"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          [ {open ? "Close" : "Menu"} ]
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-ink/10 bg-white lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex cursor-pointer items-baseline gap-3 px-3 py-3 text-base font-medium text-ink/80 hover:bg-mist hover:text-ink"
                >
                  <span className="font-mono-label text-xs text-ink/35">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="font-mono-label mt-2 cursor-pointer border border-ink/20 px-5 py-3 text-center text-xs uppercase text-ink"
              >
                [ Get in Touch ]
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
