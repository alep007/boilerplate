"use client";

import { useStyletron } from "baseui";

export interface DatePickerProps {
  value: Date | null | Array<Date | null | undefined> | undefined;
  onChange: (params: { date: Date | null }) => void;
  placeholder?: string;
  minDate?: Date;
  disabled?: boolean;
  error?: boolean;
}

function toISODate(d: Date): string {
  // toISOString gives "YYYY-MM-DDTHH:mm:ss.sssZ"; split always has index 0
  return d.toISOString().split("T")[0] as string;
}

function toInputValue(value: DatePickerProps["value"]): string {
  const date = Array.isArray(value) ? value[0] : value;
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "" : toISODate(d);
}

function toMinValue(minDate?: Date): string {
  return minDate ? toISODate(minDate) : "";
}

// BaseUI's Datepicker calls ReactDOM.findDOMNode which was removed in React 19.
// Native <input type="date"> is the React 19 compatible replacement.
export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  minDate,
  disabled,
  error,
}: DatePickerProps) {
  const [css, theme] = useStyletron();

  return (
    <input
      type="date"
      value={toInputValue(value)}
      min={toMinValue(minDate)}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value;
        if (!raw) {
          onChange({ date: null });
          return;
        }
        const parts = raw.split("-").map(Number) as [number, number, number];
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        onChange({ date });
      }}
      className={css({
        height: "48px",
        width: "100%",
        padding: "0 16px",
        borderRadius: "8px",
        border: `2px solid ${error ? theme.colors.borderNegative : theme.colors.borderOpaque}`,
        backgroundColor: disabled
          ? theme.colors.backgroundTertiary
          : theme.colors.backgroundPrimary,
        color: theme.colors.contentPrimary,
        fontSize: "16px",
        fontFamily: "inherit",
        outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        ":focus": {
          borderColor: theme.colors.borderSelected,
          boxShadow: `0 0 0 3px ${theme.colors.borderSelected}22`,
        },
        "colorScheme": "light",
      })}
    />
  );
}
