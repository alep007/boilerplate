// apps/web/src/auth.ts
import NextAuth, { type NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

const result: NextAuthResult = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credenciales",
      // Esta función se ejecuta cuando el usuario hace submit
      async authorize(credentials) {
        // --- AQUÍ IRÁ TU LLAMADA TANSTACK/FETCH AL BACKEND REAL ---

        // Mock de prueba para el boilerplate:
        if (
          credentials?.email === "admin@demo.com" &&
          credentials?.password === "123456"
        ) {
          return { id: "1", name: "Administrador", email: "admin@demo.com" };
        }

        return null; // Credenciales inválidas
      },
    }),
  ],
});

export const { auth, signIn, signOut, handlers: { GET, POST } } = result;
