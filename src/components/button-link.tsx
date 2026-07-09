import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ReactNode } from "react";

const base =
  "font-mono-label inline-flex items-center gap-2.5 border px-6 py-3.5 text-xs uppercase transition-colors duration-200 cursor-pointer";

const variants = {
  primary: `${base} border-brand bg-brand text-white hover:bg-brand-hover hover:border-brand-hover`,
  ghost: `${base} border-night-border text-white hover:border-brand hover:text-brand`,
  ghostLight: `${base} border-ink/20 text-ink hover:border-brand hover:text-brand`,
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  showArrow = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
  showArrow?: boolean;
  className?: string;
}) {
  const classes = `${variants[variant]} ${className}`;
  const content = (
    <>
      [ {children} {showArrow && <ArrowUpRight size={13} weight="bold" />} ]
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
