"use client";

import { Tag } from "baseui/tag";

export type BadgeVariant =
  | "neutral"
  | "blue"
  | "amber"
  | "purple"
  | "green"
  | "teal"
  | "red";

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  neutral: { bg: "#E8E8E8", text: "#545454" },
  blue:    { bg: "#DBEAFE", text: "#1D4ED8" },
  amber:   { bg: "#FEF3C7", text: "#92400E" },
  purple:  { bg: "#EDE9FE", text: "#6D28D9" },
  green:   { bg: "#D1FAE5", text: "#065F46" },
  teal:    { bg: "#CCFBF1", text: "#0F766E" },
  red:     { bg: "#FEE2E2", text: "#991B1B" },
};

export interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

export function Badge({ label, variant }: BadgeProps) {
  const colors = VARIANT_COLORS[variant];
  return (
    <Tag
      closeable={false}
      overrides={{
        Root: {
          style: {
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: "transparent",
            borderRadius: "4px",
            margin: "0",
            paddingTop: "2px",
            paddingBottom: "2px",
            paddingLeft: "8px",
            paddingRight: "8px",
          },
        },
        Text: {
          style: {
            fontSize: "12px",
            fontWeight: "600",
            maxWidth: "none",
          },
        },
      }}
    >
      {label}
    </Tag>
  );
}
