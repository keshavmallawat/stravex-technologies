"use client";

import { useEffect, useRef, useState } from "react";

export interface Chapter {
  id: string;
  label: string;
}

export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [chapters]);

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex"
    >
      {chapters.map((chapter, i) => {
        const isActive = active === chapter.id;
        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-current={isActive ? "true" : undefined}
            aria-label={chapter.label}
            className="group relative flex cursor-pointer items-center justify-center py-1"
          >
            <span className="font-mono-label mix-blend-difference pointer-events-none absolute right-full mr-3 whitespace-nowrap text-[10px] uppercase text-white opacity-0 transition-opacity duration-200 group-hover:opacity-70">
              {String(i + 1).padStart(2, "0")} — {chapter.label}
            </span>
            <span
              className={`mix-blend-difference block rounded-full border border-white transition-all duration-300 ${
                isActive ? "h-2.5 w-2.5 bg-white" : "h-1.5 w-1.5 bg-transparent opacity-70"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
