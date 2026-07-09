import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeamMemberForm } from "@/components/admin/team/team-form";
import type { TeamMemberFormValues } from "@/lib/team-types";

export const metadata = {
  title: "Edit Team Member | Stravex CMS",
};

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });

  if (!member) notFound();

  const socialLinks = (member.socialLinks ?? {}) as { linkedin?: string; twitter?: string; email?: string };

  const initialValues: TeamMemberFormValues = {
    name: member.name,
    role: member.role,
    department: member.department ?? "",
    bio: member.bio ?? "",
    photoUrl: member.photoUrl ?? "",
    expertiseTags: member.expertiseTags as string[],
    socialLinkedin: socialLinks.linkedin ?? "",
    socialTwitter: socialLinks.twitter ?? "",
    socialEmail: socialLinks.email ?? "",
    status: member.status as TeamMemberFormValues["status"],
    featured: member.featured,
  };

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Team / Edit ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{member.name}</h2>

      <div className="mt-6">
        <TeamMemberForm memberId={member.id} initialValues={initialValues} />
      </div>
    </div>
  );
}
