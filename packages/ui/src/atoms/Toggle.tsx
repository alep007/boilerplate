"use client";

import { useStyletron } from "baseui";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/** Pill toggle switch. Label renders to the left of the pill. */
export function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  const [css, theme] = useStyletron();
  return (
    <label
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
      })}
    >
      {label && (
        <span
          className={css({
            fontSize: "14px",
            fontWeight: "500",
            color: theme.colors.contentSecondary,
            fontFamily: "var(--font-inter), sans-serif",
            whiteSpace: "nowrap",
          })}
        >
          {label}
        </span>
      )}
      <div className={css({ position: "relative", width: "44px", height: "24px" })}>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className={css({
            opacity: 0,
            width: 0,
            height: 0,
            position: "absolute",
          })}
        />
        {/* Track */}
        <div
          className={css({
            position: "absolute",
            inset: "0",
            borderRadius: "12px",
            backgroundColor: checked
              ? theme.colors.buttonPrimaryFill
              : theme.colors.borderOpaque,
            transition: "background-color 180ms ease",
          })}
        />
        {/* Thumb */}
        <div
          className={css({
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            transition: "left 180ms ease",
          })}
        />
      </div>
    </label>
  );
}
