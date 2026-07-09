import type { Metadata } from "next";
import { GoogleLogo, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "Admin Login | Stravex Technologies",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  async function signInAction() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl || "/admin" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night px-6 text-white">
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]"
      />
      <div className="relative w-full max-w-sm border border-night-border bg-night-elevated p-8">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-brand" weight="fill" />
          <span className="font-mono-label text-xs uppercase text-brand">
            [ Admin Access ]
          </span>
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">
          Stravex CMS
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-night-muted">
          Sign in with an authorized Google account to manage the website.
        </p>

        {error && (
          <div className="mt-5 border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {error === "AccessDenied"
              ? "This Google account is not authorized for admin access."
              : "Sign-in failed. Please try again."}
          </div>
        )}

        <form action={signInAction} className="mt-7">
          <button
            type="submit"
            className="font-mono-label inline-flex w-full cursor-pointer items-center justify-center gap-2.5 border border-brand bg-brand px-6 py-3.5 text-xs uppercase text-white transition-colors duration-200 hover:bg-brand-hover hover:border-brand-hover"
          >
            <GoogleLogo size={16} weight="bold" />
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-[11px] leading-relaxed text-night-muted/70">
          Access is restricted to pre-approved administrator accounts only.
        </p>
      </div>
    </div>
  );
}
