// apps/web/src/widgets/sidebar/ui/Sidebar.tsx
"use client";

import React, { useState } from "react";
import { useStyletron } from "baseui";
import { LabelLarge, LabelMedium } from "baseui/typography";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Users } from "lucide-react";

import { UserProfileMenu } from "./UserProfileMenu";
import { NAVIGATION_CONFIG } from "@/shared/config/navigation";
import { usePermissions } from "@/entities/user/lib/usePermissions";
import { useUIStore } from "@/shared/model/uiStore";

export const Sidebar = () => {
  const [css, theme] = useStyletron();
  const { isSidebarExpanded: isExpanded, toggleSidebar } = useUIStore();

  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();

  // Inyectamos nuestro hook de seguridad
  const { hasPermission } = usePermissions();

  // Filtramos las rutas a las que el usuario tiene acceso
  const authorizedRoutes = NAVIGATION_CONFIG.filter((route) =>
    hasPermission(route.requiredPermission),
  );

  return (
    <aside
      className={css({
        width: isExpanded ? "260px" : "80px", // Animación de ancho
        height: "100vh",
        backgroundColor: theme.colors.backgroundInversePrimary,
        color: theme.colors.contentInversePrimary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: isExpanded ? "24px 16px" : "24px 8px",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: `1px solid ${theme.colors.borderOpaque}`,
        transition: "width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", // Transición suave
        zIndex: 100,
      })}
    >
      {/* Botón flotante para expandir/colapsar */}
      <button
        onClick={toggleSidebar}
        className={css({
          position: "absolute",
          right: "-12px",
          top: "32px",
          backgroundColor: theme.colors.buttonPrimaryFill,
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        })}
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div>
        {/* LOGO AREA */}
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
            paddingLeft: isExpanded ? "8px" : "0",
            justifyContent: isExpanded ? "flex-start" : "center",
          })}
        >
          {/* Logo Icono Simulado */}
          <div
            className={css({
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: theme.colors.buttonPrimaryFill,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#fff",
              flexShrink: 0,
            })}
          >
            CL
          </div>
          {isExpanded && (
            <LabelLarge color={theme.colors.contentInversePrimary}>
              Codinglab
            </LabelLarge>
          )}
        </div>

        {/* LISTA DE NAVEGACIÓN */}
        <nav
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          })}
        >
          {authorizedRoutes.map((route) => {
            // Lógica para detectar ruta activa (soporta i18n ej. /es/dashboard o /en/dashboard)
            const isActive = pathname.includes(route.path);

            return (
              <div
                key={route.id}
                onClick={() =>
                  router.push(`/${pathname.split("/")[1]}${route.path}`)
                } // Respeta el idioma actual
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: isActive
                    ? theme.colors.buttonPrimaryFill
                    : "transparent",
                  color: isActive
                    ? "#ffffff"
                    : theme.colors.contentInverseSecondary,
                  transition: "all 0.2s ease-in-out",
                  justifyContent: isExpanded ? "flex-start" : "center",
                  ":hover": {
                    backgroundColor: isActive
                      ? theme.colors.buttonPrimaryHover
                      : theme.colors.backgroundTertiary,
                    color: isActive
                      ? "#ffffff"
                      : theme.colors.contentInversePrimary,
                  },
                })}
              >
                <route.icon size={20} className={css({ flexShrink: 0 })} />

                {isExpanded && (
                  <LabelMedium
                    color="inherit"
                    className={css({ whiteSpace: "nowrap" })}
                  >
                    {t(route.labelKey)}
                  </LabelMedium>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* FOOTER: Menú de Usuario (Que ya armamos) */}
      <div
        className={css({
          borderTop: `1px solid ${theme.colors.borderOpaque}`,
          paddingTop: "16px",
          display: "flex",
          justifyContent: isExpanded ? "flex-start" : "center",
        })}
      >
        {/* Aquí podrías crear una versión colapsada de UserProfileMenu que muestre solo el avatar si !isExpanded */}
        {isExpanded ? (
          <UserProfileMenu />
        ) : (
          <div
            className={css({
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: theme.colors.backgroundTertiary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <Users size={18} color={theme.colors.contentInverseSecondary} />
          </div>
        )}
      </div>
    </aside>
  );
};
