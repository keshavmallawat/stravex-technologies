import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL("/admin", origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
