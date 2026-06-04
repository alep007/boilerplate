// apps/web/src/widgets/sidebar/ui/Sidebar.tsx
"use client";

import React from "react";
import { LanguageSwitcher } from "@/features/i18n/ui/LanguageSwitcher";
import { LogoutButton } from "@/features/auth/ui/LogoutButton";

export const Sidebar = () => {
  return (
    <aside
      style={{
        width: "260px",
        height: "100vh",
        backgroundColor: "#141414",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 16px",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid #242424",
      }}
    >
      {/* Sección Superior: Logo y Enlaces de Navegación */}
      <div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "32px",
            fontFamily: "sans-serif",
            color: "#276EF1",
            paddingLeft: "8px",
          }}
        >
          Control Panel
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#242424",
              fontFamily: "sans-serif",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Dashboard
          </div>
          {/* Aquí añadirás más moléculas de navegación en el futuro */}
        </nav>
      </div>

      {/* Sección Inferior: Características (Features) de Configuración */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          borderTop: "1px solid #242424",
          paddingTop: "16px",
        }}
      >
        <LanguageSwitcher />
        <LogoutButton />
      </div>
    </aside>
  );
};
