// apps/web/src/widgets/sidebar/ui/Sidebar.tsx
"use client";

import React from "react";
import { useStyletron } from "baseui";
import { HeadingSmall, LabelLarge } from "baseui/typography";
import { UserProfileMenu } from "./UserProfileMenu"; // <-- Importamos nuestro nuevo Widget

export const Sidebar = () => {
  const [css, theme] = useStyletron();

  return (
    <aside
      className={css({
        width: "260px",
        height: "100vh",
        backgroundColor: theme.colors.backgroundInversePrimary,
        color: theme.colors.contentInversePrimary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 16px",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: `1px solid ${theme.colors.borderOpaque}`,
      })}
    >
      <div>
        <HeadingSmall
          className={css({
            marginBottom: "32px",
            color: theme.colors.buttonPrimaryFill,
            paddingLeft: "8px",
            marginTop: 0,
          })}
        >
          Control Panel
        </HeadingSmall>

        <nav
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          })}
        >
          <div
            className={css({
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: theme.colors.backgroundTertiary,
              cursor: "pointer",
            })}
          >
            <LabelLarge>Dashboard</LabelLarge>
          </div>
        </nav>
      </div>

      {/* Sección Inferior: El Perfil y el Menú */}
      <div
        className={css({
          width: "100%",
          borderTop: `1px solid ${theme.colors.borderOpaque}`,
          paddingTop: "16px",
        })}
      >
        <UserProfileMenu />
      </div>
    </aside>
  );
};
