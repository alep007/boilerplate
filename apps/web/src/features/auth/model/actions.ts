// apps/web/src/features/auth/model/actions.ts
"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { getLocale } from "next-intl/server";
import { ROUTES, AUTH_ERRORS } from "@/shared/config/constants"; // <-- Importamos

export async function authenticate(formData: Record<string, any>) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirectTo: ROUTES.HOME, // <-- Uso de constante
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case AUTH_ERRORS.INVALID_CREDENTIALS: // <-- Uso de constante
          return AUTH_ERRORS.INVALID_CREDENTIALS;
        default:
          return AUTH_ERRORS.UNEXPECTED; // <-- Uso de constante
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  const locale = await getLocale();
  await signOut({ redirectTo: `/${locale}${ROUTES.LOGIN}` }); // <-- Uso de constante
}
