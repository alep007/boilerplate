// apps/web/src/shared/ui/CustomTimepicker.tsx
"use client";

import React from "react";
import { TimePicker } from "baseui/timepicker";

interface CustomTimepickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  format?: "12" | "24";
  step?: number; // Intervalo en minutos (ej. 15, 30, 60)
}

export const Timepicker = ({
  value,
  onChange,
  format = "24",
  step = 30,
}: CustomTimepickerProps) => {
  return (
    <TimePicker
      value={value}
      onChange={onChange}
      format={format}
      step={step}
      creatable // Permite al usuario escribir una hora manualmente si no está en la lista
      overrides={{
        Select: {
          Props: {
            overrides: {
              ControlContainer: {
                style: {
                  borderRadius: "8px",
                  fontFamily: "var(--font-neuton), serif",
                },
              },
              ValueContainer: {
                style: {
                  fontFamily: "var(--font-neuton), serif",
                },
              },
              DropdownListItem: {
                style: {
                  fontFamily: "var(--font-neuton), serif",
                },
              },
            },
          },
        },
      }}
    />
  );
};
