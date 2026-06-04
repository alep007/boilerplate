// apps/web/src/features/auth/ui/LoginForm.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation"; // <-- 1. Importamos el router del cliente
import { DeclarativeForm, componentTypes } from "@repo/forms";
import { useTranslations } from "next-intl";
import { authenticate } from "../model/actions";
import { useUserStore, UserProfile } from "@/entities/user/model/store";
import {
  I18N_NAMESPACES,
  AUTH_KEYS,
  AUTH_ERRORS,
  ROUTES,
} from "@/shared/config/constants";

export const LoginForm = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations(I18N_NAMESPACES.AUTH);

  // Extraemos la acción de Zustand para guardar el usuario
  const setUser = useUserStore((state) => state.setUser);

  const loginSchema = useMemo(
    () => ({
      // ... tu schema intacto ...
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
    const result = await authenticate(values);

    // 3. Evaluamos la nueva respuesta del servidor
    if (result?.error) {
      if (result.error === AUTH_ERRORS.INVALID_CREDENTIALS) {
        setErrorMsg(t(AUTH_KEYS.INVALID_CREDENTIALS));
      } else {
        setErrorMsg(t(AUTH_KEYS.UNEXPECTED_ERROR));
      }
    } else if (result?.success) {
      const mockUserBackendPayload: UserProfile = {
        name: "Pepes",
        lastName: "domain",
        email: values.email,
        profilePicture:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=DemoABI",
        mainColor: "#FFC043",
        permissions: [
          "viewDashboardModule",
          "viewUsersModule",
          "viewPermissionsModule",
        ],
      };

      setUser(mockUserBackendPayload);

      router.push(ROUTES.HOME);
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
