"use client";

import { useStyletron } from "baseui";
import { Menu, X } from "lucide-react";
import { useUIStore } from "@/shared/model/uiStore";

export function MobileTopBar() {
  const [css, theme] = useStyletron();
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const openMobileMenu = useUIStore((s) => s.openMobileMenu);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);

  return (
    <div
      className={css({
        display: "none",
        "@media (max-width: 768px)": {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          height: "56px",
          paddingLeft: "16px",
          paddingRight: "16px",
          backgroundColor: theme.colors.backgroundInversePrimary,
          zIndex: 200,
          boxSizing: "border-box",
        },
      })}
    >
      <button
        onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
        className={css({
          background: "none",
          border: "none",
          padding: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          color: "#ffffff",
          ":hover": {
            backgroundColor: theme.colors.backgroundTertiary,
          },
        })}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Logo centered */}
      <div
        className={css({
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        })}
      >
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
            color: "#ffffff",
            fontSize: "12px",
            fontFamily: "var(--font-inter), sans-serif",
          })}
        >
          CL
        </div>
      </div>

      {/* Spacer to balance the hamburger */}
      <div className={css({ width: "38px" })} />
    </div>
  );
}
