// apps/web/src/features/auth/model/actions.ts
"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { getLocale } from "next-intl/server";
import { ROUTES, AUTH_ERRORS } from "@/shared/config/constants";

export async function authenticate(formData: Record<string, any>) {
  try {
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false, // <-- ¡CLAVE! Detiene la redirección automática del servidor
    });

    // Si llega aquí sin arrojar error, las credenciales son válidas
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case AUTH_ERRORS.INVALID_CREDENTIALS:
          return { error: AUTH_ERRORS.INVALID_CREDENTIALS };
        default:
          return { error: AUTH_ERRORS.UNEXPECTED };
      }
    }
    // Si no es un error de Auth, lo relanzamos
    throw error;
  }
}

export async function handleSignOut() {
  const locale = await getLocale();
  await signOut({ redirectTo: `/${locale}${ROUTES.LOGIN}` }); // <-- Uso de constante
}
