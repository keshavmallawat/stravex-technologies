import {
  SquaresFour,
  Package,
  NotePencil,
  Newspaper,
  EnvelopeSimple,
  Briefcase,
  Images,
  GearSix,
  House,
  Users,
  Handshake,
  Cpu,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: Icon;
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: SquaresFour },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Homepage", href: "/admin/homepage", icon: House },
  { label: "Blog Manager", href: "/admin/blog", icon: NotePencil },
  { label: "News Manager", href: "/admin/news", icon: Newspaper },
  { label: "Contact Manager", href: "/admin/contacts", icon: EnvelopeSimple },
  { label: "Careers", href: "/admin/careers", icon: Briefcase },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Partners", href: "/admin/partners", icon: Handshake },
  { label: "Technologies & Solutions", href: "/admin/technologies", icon: Cpu },
  { label: "SEO Manager", href: "/admin/seo", icon: MagnifyingGlass },
  { label: "Media Library", href: "/admin/media", icon: Images },
  { label: "Settings", href: "/admin/settings", icon: GearSix },
];
