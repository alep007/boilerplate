// apps/web/src/middleware.ts
import createMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { ROUTES, LANGUAGES } from "./shared/config/constants"; // <-- Importamos

const intlMiddleware = createMiddleware({
  locales: [LANGUAGES.ES, LANGUAGES.EN],
  defaultLocale: LANGUAGES.ES,
  localePrefix: "always",
});

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.includes(ROUTES.LOGIN);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(ROUTES.HOME, req.nextUrl));
    }
    return intlMiddleware(req);
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL(ROUTES.LOGIN, req.nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
