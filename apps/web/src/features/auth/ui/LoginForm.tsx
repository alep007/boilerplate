// apps/web/src/features/auth/ui/LoginForm.tsx
"use client";

import { useState, useMemo } from "react";
import { DeclarativeForm, componentTypes } from "@repo/forms";
import { useTranslations } from "next-intl";
import { authenticate } from "../model/actions";
import {
  I18N_NAMESPACES,
  AUTH_KEYS,
  AUTH_ERRORS,
} from "@/shared/config/constants"; // <-- Importamos

export const LoginForm = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Usamos el namespace centralizado
  const t = useTranslations(I18N_NAMESPACES.AUTH);

  const loginSchema = useMemo(
    () => ({
      fields: [
        {
          component: componentTypes.TEXT_FIELD,
          name: "email",
          label: t(AUTH_KEYS.EMAIL_LABEL),
          type: "email",
          placeholder: t(AUTH_KEYS.EMAIL_PLACEHOLDER),
          isRequired: true,
          validate: [
            { type: "required", message: t(AUTH_KEYS.EMAIL_REQUIRED) },
          ],
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: "password",
          label: t(AUTH_KEYS.PASSWORD_LABEL),
          type: "password",
          placeholder: t(AUTH_KEYS.PASSWORD_PLACEHOLDER),
          isRequired: true,
          validate: [
            { type: "required", message: t(AUTH_KEYS.PASSWORD_REQUIRED) },
          ],
        },
        {
          component: componentTypes.CHECKBOX,
          name: "rememberMe",
          label: t(AUTH_KEYS.REMEMBER_ME),
        },
      ],
    }),
    [t],
  );

  const handleLoginSubmit = async (values: Record<string, any>) => {
    setErrorMsg(null);
    const errorCode = await authenticate(values);

    if (errorCode) {
      // Comparamos usando las constantes del sistema
      if (errorCode === AUTH_ERRORS.INVALID_CREDENTIALS) {
        setErrorMsg(t(AUTH_KEYS.INVALID_CREDENTIALS));
      } else {
        setErrorMsg(t(AUTH_KEYS.UNEXPECTED_ERROR));
      }
    }
  };

  return (
    <div>
      {errorMsg && (
        <div style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>
          {errorMsg}
        </div>
      )}
      <DeclarativeForm schema={loginSchema} onSubmit={handleLoginSubmit} />
    </div>
  );
};
