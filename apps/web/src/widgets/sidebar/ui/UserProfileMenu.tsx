// apps/web/src/widgets/sidebar/ui/UserProfileMenu.tsx
"use client";

import React, { useContext, useTransition } from "react";
import { useStyletron } from "baseui";
import { Avatar } from "baseui/avatar";
import { LabelSmall, ParagraphXSmall } from "baseui/typography";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { Button, KIND, SHAPE } from "baseui/button";
import { Overflow } from "baseui/icon";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { handleSignOut } from "@/features/auth/model/actions";
import { ThemeContext } from "@/app/[locale]/StyletronProvider";
import { useUserStore } from "@/entities/user/model/store"; // <-- Importamos Zustand

export const UserProfileMenu = () => {
  const [css, theme] = useStyletron();

  const user = useUserStore((state) => state.user);
  const clearSession = useUserStore((state) => state.clearSession);

  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { themeMode, toggleTheme } = useContext(ThemeContext);

  const toggleLanguage = () => {
    const nextLocale = locale === "es" ? "en" : "es";
    const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
    startTransition(() => {
      router.replace(newPathname);
    });
  };

  const userName = user ? `${user.name} ${user.lastName}` : "Cargando...";
  const userEmail = user ? user.email : "usuario@deltax.la";
  const userAvatar = user ? user.profilePicture : "";

  const MenuItem = ({
    label,
    onClick,
    isDestructive = false,
  }: {
    label: string;
    onClick: () => void;
    isDestructive?: boolean;
  }) => (
    <div
      onClick={onClick}
      className={css({
        padding: "12px 16px",
        cursor: "pointer",
        color: isDestructive
          ? theme.colors.negative
          : theme.colors.contentPrimary,
        ":hover": { backgroundColor: theme.colors.backgroundSecondary },
      })}
    >
      <LabelSmall color="inherit">{label}</LabelSmall>
    </div>
  );

  return (
    <StatefulPopover
      placement={PLACEMENT.topRight}
      popoverMargin={8}
      content={({ close }) => (
        <div
          className={css({
            width: "220px",
            display: "flex",
            flexDirection: "column",
            padding: "8px 0",
          })}
        >
          <MenuItem
            label={
              themeMode === "light"
                ? "Activar Modo Oscuro"
                : "Activar Modo Claro"
            }
            onClick={() => {
              toggleTheme();
              close();
            }}
          />
          <MenuItem
            label={t("switchLanguage")}
            onClick={() => {
              toggleLanguage();
              close();
            }}
          />
          <div
            className={css({
              height: "1px",
              backgroundColor: theme.colors.borderOpaque,
              margin: "8px 0",
            })}
          />
          <MenuItem
            label="Cerrar Sesión"
            isDestructive
            onClick={() => {
              clearSession(); // 2. Limpiamos Zustand antes de salir
              handleSignOut();
              close();
            }}
          />
        </div>
      )}
    >
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyBox: "space-between",
          justifyContent: "space-between",
          padding: "12px",
          borderRadius: "8px",
          cursor: "pointer",
          ":hover": { backgroundColor: theme.colors.backgroundTertiary },
        })}
      >
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "12px",
          })}
        >
          <Avatar name={userName} size="36px" src={userAvatar} />
          <div className={css({ display: "flex", flexDirection: "column" })}>
            {/* 3. El nombre y apellido cambian dinámicamente aquí */}
            <LabelSmall color={theme.colors.contentInversePrimary}>
              {userName}
            </LabelSmall>
            <ParagraphXSmall
              color={theme.colors.contentInverseSecondary}
              margin={0}
            >
              {userEmail}
            </ParagraphXSmall>
          </div>
        </div>

        <Button
          kind={KIND.tertiary}
          shape={SHAPE.circle}
          size="compact"
          overrides={{
            BaseButton: {
              style: { color: theme.colors.contentInversePrimary },
            },
          }}
        >
          <Overflow size={24} />
        </Button>
      </div>
    </StatefulPopover>
  );
};
