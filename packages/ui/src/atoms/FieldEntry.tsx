"use client";

import React from "react";
import { useStyletron } from "baseui";

export interface FieldEntryProps {
  label: string;
  value?: React.ReactNode;
  /** Render value in JetBrains Mono */
  mono?: boolean;
}

/** Uppercase micro-label above a bold value — used in specs grids. Returns null when value is empty. */
export function FieldEntry({ label, value, mono }: FieldEntryProps) {
  const [css, theme] = useStyletron();
  if (!value && value !== 0) return null;
  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "4px" })}>
      <span
        className={css({
          fontSize: "10px",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: theme.colors.contentSecondary,
          fontFamily: "var(--font-inter), sans-serif",
        })}
      >
        {label}
      </span>
      <span
        className={css({
          fontSize: "15px",
          fontWeight: "600",
          color: theme.colors.contentPrimary,
          lineHeight: "1.4",
          fontFamily: mono
            ? "var(--font-mono), monospace"
            : "var(--font-inter), sans-serif",
        })}
      >
        {value}
      </span>
    </div>
  );
}
