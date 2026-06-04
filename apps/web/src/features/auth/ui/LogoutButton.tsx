// apps/web/src/features/auth/ui/LogoutButton.tsx
"use client";

import { Button } from "@repo/ui";
import { useTranslations } from "next-intl";
import { handleSignOut } from "../model/actions";

export const LogoutButton = () => {
  const t = useTranslations("Auth");

  return (
    <Button
      onClick={() => handleSignOut()}
      kind="secondary" // Propiedad nativa de Base Web para estilos secundarios
      overrides={{
        BaseButton: {
          style: {
            width: "100%",
            backgroundColor: "#242424",
            color: "#ff4d4f",
            ":hover": {
              backgroundColor: "#ff4d4f",
              color: "#ffffff",
            },
          },
        },
      }}
    >
      {t("logoutButton")}
    </Button>
  );
};
