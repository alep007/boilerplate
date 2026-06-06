"use client";

import React from "react";
import { useStyletron } from "baseui";

// ── Col ───────────────────────────────────────────────────────────────────────

export interface ColProps {
  /** Column span out of 12 (the parent FormSection grid). Defaults to 12 (full row). */
  span?: number;
  children: React.ReactNode;
}

/** Spans N columns inside a FormSection's 12-column grid. Collapses to full width on mobile. */
export function Col({ span = 12, children }: ColProps) {
  const [css] = useStyletron();
  return (
    <div
      className={css({
        gridColumn: `span ${span}`,
        minWidth: 0, // prevent grid blowout from long text
        "@media (max-width: 640px)": {
          gridColumn: "span 12",
        },
      })}
    >
      {children}
    </div>
  );
}

// ── FormSection ───────────────────────────────────────────────────────────────

export interface FormSectionProps {
  number: number;
  title: string;
  /** Lucide (or any) icon component. Receives size + color as props. */
  icon: React.ElementType;
  children: React.ReactNode;
}

/**
 * Card that groups related form fields under a numbered heading.
 * Children should be `<Col span={N}>` wrappers to control field width in the 12-column grid.
 */
export function FormSection({ number, title, icon: Icon, children }: FormSectionProps) {
  const [css, theme] = useStyletron();
  const white = (theme.colors as Record<string, string>).mono100 ?? "#ffffff";

  return (
    <div
      className={css({
        border: `1px solid ${theme.colors.borderOpaque}`,
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: white,
      })}
    >
      {/* ── Section header ── */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 20px",
          backgroundColor: theme.colors.backgroundSecondary,
          borderBottom: `1px solid ${theme.colors.borderOpaque}`,
        })}
      >
        <Icon
          size={17}
          color={theme.colors.buttonPrimaryFill}
          strokeWidth={2.2}
        />
        <span
          className={css({
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            lineHeight: "20px",
            color: theme.colors.contentPrimary,
          })}
        >
          {number}. {title}
        </span>
      </div>

      {/* ── 12-column grid body ── */}
      <div
        className={css({
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "16px",
          alignItems: "start",
        })}
      >
        {children}
      </div>
    </div>
  );
}
