import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <AdminShell user={session.user} signOutAction={signOutAction}>
      {children}
    </AdminShell>
  );
}
