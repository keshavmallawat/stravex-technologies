import { TeamMemberForm } from "@/components/admin/team/team-form";

export const metadata = {
  title: "New Team Member | Stravex CMS",
};

export default function NewTeamMemberPage() {
  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Team / New ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">New Team Member</h2>

      <div className="mt-6">
        <TeamMemberForm />
      </div>
    </div>
  );
}
