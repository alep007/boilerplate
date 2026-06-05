"use client";

import { Select as BaseSelect, TYPE, Value } from "baseui/select";

export interface SelectOption {
  id: string | number;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: Value;
  onChange: (params: { value: Value }) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  error,
}: SelectProps) {
  return (
    <BaseSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      type={TYPE.search}
      labelKey="label"
      valueKey="id"
      overrides={{
        ControlContainer: {
          style: ({ $theme }) => ({
            borderRadius: "8px",
            borderColor: error ? $theme.colors.borderNegative : undefined,
          }),
        },
      }}
    />
  );
}
