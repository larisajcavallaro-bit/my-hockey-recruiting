import { auth } from "@/auth-middleware";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isAuthPage =
    pathname.startsWith("/auth/sign-in") ||
    pathname.startsWith("/auth/sign-up") ||
    pathname.startsWith("/auth/forgot") ||
    pathname.startsWith("/auth/update-password") ||
    pathname.startsWith("/auth/email-verify") ||
    pathname.startsWith("/auth/set-new-password");

  const isDashboard =
    pathname.startsWith("/parent-dashboard") ||
    pathname.startsWith("/coach-dashboard") ||
    pathname.startsWith("/admin-dashboard");

  if (isDashboard && !isLoggedIn) {
    const signIn = new URL("/auth/sign-in", req.url);
    signIn.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signIn);
  }

  // Admin: only ADMIN role can access. Redirect others to their dashboard.
  if (pathname.startsWith("/admin-dashboard")) {
    const role = req.auth?.user?.role;
    if (role !== "ADMIN") {
      const dashboard =
        role === "COACH" ? "/coach-dashboard" : "/parent-dashboard";
      return Response.redirect(new URL(dashboard, req.url));
    }
  }

  // Don't redirect away from sign-in — users should always see the form when they click Sign In
  const isSignInPage = pathname.startsWith("/auth/sign-in");
  if (isAuthPage && isLoggedIn && !isSignInPage) {
    const role = req.auth?.user?.role;
    const dashboard =
      role === "ADMIN"
        ? "/admin-dashboard"
        : role === "COACH"
          ? "/coach-dashboard"
          : "/parent-dashboard";
    return Response.redirect(new URL(dashboard, req.url));
  }

  return undefined;
});

export const config = {
  matcher: [
    "/parent-dashboard/:path*",
    "/coach-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/forgot-password-verify",
    "/auth/set-new-password",
    "/auth/forgot-otp",
    "/auth/update-password",
    "/auth/email-verify",
  ],
};
