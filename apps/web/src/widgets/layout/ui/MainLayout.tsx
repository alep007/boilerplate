// apps/web/src/widgets/layout/ui/MainLayout.tsx
"use client";

import React from "react";
import { useStyletron } from "baseui";
import { useUIStore } from "@/shared/model/uiStore";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [css, theme] = useStyletron();
  const isExpanded = useUIStore((state) => state.isSidebarExpanded);

  return (
    <main
      className={css({
        flex: 1,
        // Aquí ocurre la magia: El margen reacciona a Zustand
        marginLeft: isExpanded ? "260px" : "80px",
        padding: "40px",
        backgroundColor: theme.colors.backgroundPrimary,
        minHeight: "100vh",
        transition: "margin-left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
      })}
    >
      {children}
    </main>
  );
};
