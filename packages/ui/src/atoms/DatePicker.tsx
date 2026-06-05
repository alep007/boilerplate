// apps/web/src/shared/ui/CustomDatepicker.tsx
"use client";

import React from "react";
import { Datepicker } from "baseui/datepicker";
import { es } from "date-fns/locale"; // Para internacionalizar el calendario en español

interface CustomDatepickerProps {
  value: Date | null | (Date | null)[];
  onChange: (params: { date: Date | null | (Date | null)[] }) => void;
  placeholder?: string;
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = "Seleccione una fecha",
}: CustomDatepickerProps) => {
  return (
    <Datepicker
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      locale={es} // Aplica los meses y días en español nativo
      formatString="dd/MM/yyyy"
      overrides={{
        Input: {
          Props: {
            overrides: {
              Root: {
                style: {
                  borderRadius: "8px",
                  fontFamily: "var(--font-neuton), serif",
                },
              },
            },
          },
        },
        CalendarHeader: {
          style: {
            fontFamily: "var(--font-neuton), serif",
          },
        },
        MonthYearSelectButton: {
          style: {
            fontFamily: "var(--font-neuton), serif",
          },
        },
        Day: {
          style: ({ $theme, $selected }) => ({
            fontFamily: "var(--font-neuton), serif",
            // Si el día está seleccionado, hereda automáticamente el mainColor dinámico
            backgroundColor: $selected
              ? $theme.colors.buttonPrimaryFill
              : undefined,
            ":hover": {
              backgroundColor: $selected
                ? $theme.colors.buttonPrimaryActive
                : $theme.colors.backgroundSecondary,
            },
          }),
        },
      }}
    />
  );
};
