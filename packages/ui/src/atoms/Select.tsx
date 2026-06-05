// apps/web/src/shared/ui/CustomSelect.tsx
"use client";

import React from "react";
import { Select, TYPE, Value } from "baseui/select";

interface Option {
  id: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: Value;
  onChange: (params: { value: Value }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: CustomSelectProps) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type={TYPE.search} // Habilita el comportamiento de búsqueda
      labelKey="label" // Mapeo de la propiedad visual
      valueKey="id" // Mapeo del identificador único
      overrides={{
        ControlContainer: {
          style: ({ $theme }) => ({
            borderRadius: "8px",
            fontFamily: "var(--font-neuton), serif",
          }),
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
      }}
    />
  );
};
