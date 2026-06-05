"use client";

import { Datepicker } from "baseui/datepicker";
import { es } from "date-fns/locale";

export interface DatePickerProps {
  value: Date | null | Array<Date | null | undefined> | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (params: { date: any }) => void;
  placeholder?: string;
  minDate?: Date;
  disabled?: boolean;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "dd/mm/aaaa",
  minDate,
  disabled,
  error,
}: DatePickerProps) {
  return (
    <Datepicker
      value={value as any}
      onChange={onChange as any}
      placeholder={placeholder}
      locale={es}
      formatString="dd/MM/yyyy"
      minDate={minDate}
      disabled={disabled}
      overrides={{
        Input: {
          props: {
            error,
            overrides: {
              Root: {
                style: ({ $theme }: { $theme: any }) => ({
                  borderRadius: "8px",
                  borderColor: error
                    ? $theme.colors.borderNegative
                    : undefined,
                }),
              },
            },
          },
        },
      }}
    />
  );
}
