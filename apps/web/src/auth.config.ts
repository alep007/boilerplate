// apps/web/src/auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // Redirige aquí cuando no hay sesión
  },
  // callbacks: {
  //   authorized({ auth, request: { nextUrl } }) {
  //     const isLoggedIn = !!auth?.user;
  //     const isOnDashboard = nextUrl.pathname === "/"; // O si usas "/dashboard"

  //     if (isOnDashboard) {
  //       if (isLoggedIn) return true;
  //       return false; // Falso = Redirigir al login
  //     } else if (isLoggedIn) {
  //       // Si ya está logueado y trata de ir al /login, lo mandamos al inicio
  //       return Response.redirect(new URL("/", nextUrl));
  //     }
  //     return true;
  //   },
  // },
  providers: [], // Lo dejamos vacío aquí a propósito
} satisfies NextAuthConfig;
