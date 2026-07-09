import Link from "next/link";
import {
  Package,
  NotePencil,
  Newspaper,
  EnvelopeSimple,
  Briefcase,
  Images,
  ChartLineUp,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format-date";

export const metadata = {
  title: "Dashboard | Stravex CMS",
};

async function getStats() {
  const [
    products,
    blogPosts,
    newsPosts,
    contactsTotal,
    contactsUnread,
    applicationsTotal,
    applicationsNew,
    mediaTotal,
    jobOpeningsPublished,
    teamMembersPublished,
    partnersActive,
    technologiesPublished,
    solutionsPublished,
  ] = await Promise.all([
    prisma.product.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    }),
    prisma.blogPost.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    }),
    prisma.newsPost.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: true,
    }),
    prisma.contact.count({ where: { deletedAt: null } }),
    prisma.contact.count({ where: { deletedAt: null, status: "unread" } }),
    prisma.careerApplication.count({ where: { deletedAt: null } }),
    prisma.careerApplication.count({ where: { deletedAt: null, status: "new" } }),
    prisma.mediaAsset.count(),
    prisma.jobOpening.count({ where: { deletedAt: null, status: "published" } }),
    prisma.teamMember.count({ where: { deletedAt: null, status: "published" } }),
    prisma.partner.count({ where: { deletedAt: null, status: "active" } }),
    prisma.technology.count({ where: { deletedAt: null, status: "published" } }),
    prisma.solution.count({ where: { deletedAt: null, status: "published" } }),
  ]);

  const countByStatus = (rows: { status: string; _count: number }[], status: string) =>
    rows.find((r) => r.status === status)?._count ?? 0;

  const totalOf = (rows: { status: string; _count: number }[]) =>
    rows.reduce((sum, r) => sum + r._count, 0);

  return {
    products: {
      total: totalOf(products),
      published: countByStatus(products, "published"),
      draft: countByStatus(products, "draft"),
      archived: countByStatus(products, "archived"),
    },
    blogPosts: {
      total: totalOf(blogPosts),
      published: countByStatus(blogPosts, "published"),
      draft: countByStatus(blogPosts, "draft"),
      scheduled: countByStatus(blogPosts, "scheduled"),
      archived: countByStatus(blogPosts, "archived"),
    },
    newsPosts: {
      total: totalOf(newsPosts),
      published: countByStatus(newsPosts, "published"),
      draft: countByStatus(newsPosts, "draft"),
      scheduled: countByStatus(newsPosts, "scheduled"),
      archived: countByStatus(newsPosts, "archived"),
    },
    contactsTotal,
    contactsUnread,
    applicationsTotal,
    applicationsNew,
    mediaTotal,
    jobOpeningsPublished,
    teamMembersPublished,
    partnersActive,
    technologiesPublished,
    solutionsPublished,
  };
}

interface ActivityItem {
  type: string;
  label: string;
  href: string;
  at: Date;
}

async function getRecentActivity(): Promise<ActivityItem[]> {
  const [contacts, applications, blogPosts, newsPosts, products] = await Promise.all([
    prisma.contact.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.careerApplication.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.blogPost.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.newsPost.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const items: ActivityItem[] = [
    ...contacts.map((c) => ({
      type: "Contact",
      label: `New enquiry from ${c.name}`,
      href: "/admin/contacts",
      at: c.createdAt,
    })),
    ...applications.map((a) => ({
      type: "Application",
      label: `${a.applicantName} applied for ${a.appliedRole}`,
      href: "/admin/careers?tab=applications",
      at: a.createdAt,
    })),
    ...blogPosts.map((b) => ({
      type: "Blog",
      label: `${b.status === "published" ? "Published" : "Updated"} "${b.title}"`,
      href: `/admin/blog/${b.id}`,
      at: b.updatedAt,
    })),
    ...newsPosts.map((n) => ({
      type: "News",
      label: `${n.status === "published" ? "Published" : "Updated"} "${n.title}"`,
      href: `/admin/news/${n.id}`,
      at: n.updatedAt,
    })),
    ...products.map((p) => ({
      type: "Product",
      label: `${p.status === "published" ? "Published" : "Updated"} "${p.name}"`,
      href: `/admin/products/${p.id}`,
      at: p.updatedAt,
    })),
  ];

  return items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 10);
}

function formatRelative(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(date);
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const activity = await getRecentActivity();

  const [recentContacts, recentApplications, recentBlogPosts, recentNewsPosts] =
    await Promise.all([
      prisma.contact.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.careerApplication.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.blogPost.findMany({
        where: { deletedAt: null, status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
      prisma.newsPost.findMany({
        where: { deletedAt: null, status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 5,
      }),
    ]);

  const statCards = [
    { label: "Total Products", value: stats.products.total, icon: Package, href: "/admin/products" },
    { label: "Total Blogs", value: stats.blogPosts.total, icon: NotePencil, href: "/admin/blog" },
    { label: "Total News", value: stats.newsPosts.total, icon: Newspaper, href: "/admin/news" },
    { label: "Contact Enquiries", value: stats.contactsTotal, icon: EnvelopeSimple, href: "/admin/contacts", badge: stats.contactsUnread > 0 ? `${stats.contactsUnread} unread` : undefined },
    { label: "Career Applications", value: stats.applicationsTotal, icon: Briefcase, href: "/admin/careers?tab=applications", badge: stats.applicationsNew > 0 ? `${stats.applicationsNew} new` : undefined },
    { label: "Media Files", value: stats.mediaTotal, icon: Images, href: "/admin/media" },
  ];

  const draftVsPublished = [
    { label: "Products", published: stats.products.published, draft: stats.products.draft, other: stats.products.archived },
    { label: "Blogs", published: stats.blogPosts.published, draft: stats.blogPosts.draft, other: stats.blogPosts.scheduled + stats.blogPosts.archived },
    { label: "News", published: stats.newsPosts.published, draft: stats.newsPosts.draft, other: stats.newsPosts.scheduled + stats.newsPosts.archived },
  ];

  const siteContentStats = [
    { label: "Job Openings", value: stats.jobOpeningsPublished, href: "/admin/careers" },
    { label: "Team Members", value: stats.teamMembersPublished, href: "/admin/team" },
    { label: "Partners & Incubators", value: stats.partnersActive, href: "/admin/partners" },
    { label: "Technologies", value: stats.technologiesPublished, href: "/admin/technologies" },
    { label: "Solutions", value: stats.solutionsPublished, href: "/admin/technologies" },
  ];

  const quickLinks = [
    { label: "Add Product", href: "/admin/products/new", icon: Package },
    { label: "Create Blog", href: "/admin/blog/new", icon: NotePencil },
    { label: "Create News", href: "/admin/news/new", icon: Newspaper },
    { label: "Upload Media", href: "/admin/media", icon: Images },
    { label: "View Contacts", href: "/admin/contacts", icon: EnvelopeSimple },
    { label: "View Applications", href: "/admin/careers?tab=applications", icon: Briefcase },
  ];

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Overview ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Welcome back</h2>
      <p className="mt-1.5 text-sm text-ink/55">
        A snapshot of the Stravex Technologies website content.
      </p>

      {/* Primary stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, href, badge }) => (
          <Link
            key={label}
            href={href}
            className="group border border-ink/10 bg-white p-6 transition-colors hover:border-brand"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-label text-[10px] uppercase text-ink/40">
                [ {label} ]
              </span>
              <Icon size={16} className="text-ink/30 transition-colors group-hover:text-brand" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-ink">{value}</p>
              {badge && (
                <span className="font-mono-label border border-amber/40 bg-amber-soft px-2 py-0.5 text-[9px] uppercase text-amber">
                  {badge}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Site content stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {siteContentStats.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="border border-ink/10 bg-white px-4 py-3 transition-colors hover:border-brand"
          >
            <p className="text-xl font-semibold text-ink">{value}</p>
            <p className="mt-0.5 text-[11px] text-ink/50">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Draft vs Published */}
          <span className="font-mono-label text-[10px] uppercase text-ink/40">
            [ Draft vs Published Content ]
          </span>
          <div className="mt-3 flex flex-col gap-3 border border-ink/10 bg-white p-5">
            {draftVsPublished.map((row) => {
              const total = row.published + row.draft + row.other || 1;
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">{row.label}</span>
                    <span className="text-ink/45">
                      {row.published} published · {row.draft} draft
                      {row.other > 0 ? ` · ${row.other} other` : ""}
                    </span>
                  </div>
                  <div className="mt-1.5 flex h-2 w-full overflow-hidden bg-mist">
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${(row.published / total) * 100}%` }}
                    />
                    <div
                      className="bg-amber"
                      style={{ width: `${(row.draft / total) * 100}%` }}
                    />
                    <div
                      className="bg-ink/20"
                      style={{ width: `${(row.other / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent activity feed */}
          <span className="font-mono-label mt-8 block text-[10px] uppercase text-ink/40">
            [ Recent Activity ]
          </span>
          <div className="mt-3 border border-ink/10 bg-white">
            {activity.length === 0 ? (
              <p className="p-5 text-sm text-ink/45">No activity yet.</p>
            ) : (
              activity.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center justify-between gap-4 border-b border-ink/5 px-5 py-3 text-sm transition-colors last:border-0 hover:bg-mist/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono-label border border-ink/15 px-1.5 py-0.5 text-[9px] uppercase text-ink/45">
                      {item.type}
                    </span>
                    <span className="text-ink/75">{item.label}</span>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-ink/35">
                    <Clock size={11} />
                    {formatRelative(item.at)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Recent contacts */}
          <div>
            <span className="font-mono-label text-[10px] uppercase text-ink/40">
              [ Recent Contact Submissions ]
            </span>
            <div className="mt-3 border border-ink/10 bg-white">
              {recentContacts.length === 0 ? (
                <p className="p-4 text-xs text-ink/45">None yet.</p>
              ) : (
                recentContacts.map((c) => (
                  <Link
                    key={c.id}
                    href="/admin/contacts"
                    className="block border-b border-ink/5 px-4 py-2.5 text-xs transition-colors last:border-0 hover:bg-mist/60"
                  >
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-ink/45">{c.company || c.email}</p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent applications */}
          <div>
            <span className="font-mono-label text-[10px] uppercase text-ink/40">
              [ Recent Career Applications ]
            </span>
            <div className="mt-3 border border-ink/10 bg-white">
              {recentApplications.length === 0 ? (
                <p className="p-4 text-xs text-ink/45">None yet.</p>
              ) : (
                recentApplications.map((a) => (
                  <Link
                    key={a.id}
                    href="/admin/careers?tab=applications"
                    className="block border-b border-ink/5 px-4 py-2.5 text-xs transition-colors last:border-0 hover:bg-mist/60"
                  >
                    <p className="font-medium text-ink">{a.applicantName}</p>
                    <p className="text-ink/45">{a.appliedRole}</p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recently published blogs */}
          <div>
            <span className="font-mono-label text-[10px] uppercase text-ink/40">
              [ Recently Published Blogs ]
            </span>
            <div className="mt-3 border border-ink/10 bg-white">
              {recentBlogPosts.length === 0 ? (
                <p className="p-4 text-xs text-ink/45">None yet.</p>
              ) : (
                recentBlogPosts.map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/blog/${b.id}`}
                    className="block truncate border-b border-ink/5 px-4 py-2.5 text-xs font-medium text-ink transition-colors last:border-0 hover:bg-mist/60"
                  >
                    {b.title}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recently published news */}
          <div>
            <span className="font-mono-label text-[10px] uppercase text-ink/40">
              [ Recently Published News ]
            </span>
            <div className="mt-3 border border-ink/10 bg-white">
              {recentNewsPosts.length === 0 ? (
                <p className="p-4 text-xs text-ink/45">None yet.</p>
              ) : (
                recentNewsPosts.map((n) => (
                  <Link
                    key={n.id}
                    href={`/admin/news/${n.id}`}
                    className="block truncate border-b border-ink/5 px-4 py-2.5 text-xs font-medium text-ink transition-colors last:border-0 hover:bg-mist/60"
                  >
                    {n.title}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <span className="font-mono-label text-[10px] uppercase text-ink/40">
          [ Quick Actions ]
        </span>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex cursor-pointer items-center gap-3 border border-ink/10 bg-white px-5 py-4 transition-colors duration-150 hover:border-brand"
            >
              <Icon size={18} className="text-ink/40 transition-colors group-hover:text-brand" />
              <span className="text-sm font-medium text-ink">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics placeholder */}
      <div className="mt-10">
        <span className="font-mono-label text-[10px] uppercase text-ink/40">
          [ Website Analytics ]
        </span>
        <div className="mt-3 flex flex-col items-center justify-center gap-2 border border-dashed border-ink/15 bg-white px-6 py-10 text-center">
          <ChartLineUp size={26} weight="thin" className="text-ink/25" />
          <span className="font-mono-label text-[10px] uppercase text-ink/40">
            [ Coming in a Future Phase ]
          </span>
          <p className="max-w-sm text-xs text-ink/50">
            Traffic, conversion, and engagement analytics will appear here once
            connected in Settings.
          </p>
        </div>
      </div>
    </div>
  );
}
