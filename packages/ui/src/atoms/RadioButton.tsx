// apps/web/src/shared/ui/CustomRadio.tsx
"use client";

import React from "react";
import { RadioGroup, Radio, ALIGN } from "baseui/radio";

interface RadioOption {
  value: string;
  label: string;
}

interface CustomRadioProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  align?: ALIGN[keyof ALIGN];
}

export const RadioButton = ({
  name,
  options,
  value,
  onChange,
  align = ALIGN.vertical,
}: CustomRadioProps) => {
  return (
    <RadioGroup
      name={name}
      value={value}
      onChange={onChange}
      align={align}
      overrides={{
        RadioGroupRoot: {
          style: {
            gap: "12px",
          },
        },
      }}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          overrides={{
            Label: {
              style: {
                fontFamily: "var(--font-neuton), serif",
                fontSize: "16px",
              },
            },
            RadioMarkOuter: {
              style: ({ $theme, $checked }) => ({
                // El círculo exterior toma el color de marca al seleccionarse
                borderColor: $checked
                  ? $theme.colors.buttonPrimaryFill
                  : $theme.colors.borderOpaque,
              }),
            },
            RadioMarkInner: {
              style: ({ $theme, $checked }) => ({
                // El punto interior toma el color de marca
                backgroundColor: $checked
                  ? $theme.colors.buttonPrimaryFill
                  : undefined,
              }),
            },
          }}
        >
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
};
