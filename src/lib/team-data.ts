import { prisma } from "@/lib/prisma";

export interface PublicTeamMember {
  id: string;
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  photoUrl: string | null;
  expertiseTags: string[];
  socialLinks: { linkedin?: string; twitter?: string; email?: string };
}

export async function getPublishedTeamMembers(): Promise<PublicTeamMember[]> {
  const members = await prisma.teamMember.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  return members.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    department: m.department,
    bio: m.bio,
    photoUrl: m.photoUrl,
    expertiseTags: m.expertiseTags as string[],
    socialLinks: (m.socialLinks ?? {}) as { linkedin?: string; twitter?: string; email?: string },
  }));
}
