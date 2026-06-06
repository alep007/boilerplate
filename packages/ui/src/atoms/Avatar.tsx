"use client";

import { useStyletron } from "baseui";

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0]![0]! + words[1]![0]!).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export interface AvatarProps {
  name: string;
  size?: number;
}

/** Circular avatar showing the first two initials of a name. */
export function Avatar({ name, size = 40 }: AvatarProps) {
  const [css, theme] = useStyletron();
  const fontSize = Math.round(size * 0.36);
  return (
    <div
      className={css({
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: theme.colors.contentPrimary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        userSelect: "none",
      })}
    >
      <span
        className={css({
          fontSize: `${fontSize}px`,
          fontWeight: "700",
          color: "#ffffff",
          fontFamily: "var(--font-inter), sans-serif",
          letterSpacing: "0.02em",
        })}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}
