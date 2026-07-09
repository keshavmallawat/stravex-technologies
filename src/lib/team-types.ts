export const TEAM_MEMBER_STATUSES = ["draft", "published"] as const;
export type TeamMemberStatus = (typeof TEAM_MEMBER_STATUSES)[number];

export interface TeamMemberFormValues {
  name: string;
  role: string;
  department: string;
  bio: string;
  photoUrl: string;
  expertiseTags: string[];
  socialLinkedin: string;
  socialTwitter: string;
  socialEmail: string;
  status: TeamMemberStatus;
  featured: boolean;
}

export const emptyTeamMemberForm: TeamMemberFormValues = {
  name: "",
  role: "",
  department: "",
  bio: "",
  photoUrl: "",
  expertiseTags: [],
  socialLinkedin: "",
  socialTwitter: "",
  socialEmail: "",
  status: "draft",
  featured: false,
};
