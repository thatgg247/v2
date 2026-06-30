import type { NextAuthConfig } from "next-auth";

const PUBLIC_ROUTES = ["/login", "/signup", "/verify-email", "/reset-password"];

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublic =
        PUBLIC_ROUTES.some((r) => nextUrl.pathname.startsWith(r)) ||
        nextUrl.pathname.startsWith("/api/auth") ||
        nextUrl.pathname.startsWith("/api/webhooks");
      if (isPublic) return true;
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
