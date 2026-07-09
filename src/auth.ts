import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const allowed = await prisma.adminAllowlist.findUnique({
        where: { email: user.email.toLowerCase() },
      });
      return Boolean(allowed);
    },
    async session({ session, user }) {
      const dbUser = user as typeof user & { role: string };
      if (session.user) {
        session.user.id = dbUser.id;
        session.user.role = dbUser.role;
      }
      return session;
    },
  },
});
