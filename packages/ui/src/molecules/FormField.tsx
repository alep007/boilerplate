// packages/ui/src/molecules/FormField.tsx
"use client";

import { FormControl } from "baseui/form-control";
import { Input, CustomInputProps } from "../atoms/Input";

// 1. Usamos Omit<'error'> para quitar el booleano y poner nuestro texto
export interface FormFieldProps extends Omit<CustomInputProps, "error"> {
  label?: React.ReactNode;
  caption?: React.ReactNode;
  error?: React.ReactNode;
}

export function FormField({
  label,
  caption,
  error,
  ...inputProps
}: FormFieldProps) {
  return (
    <FormControl label={label} caption={caption} error={error}>
      {/* 2. Convertimos el texto de error en un booleano (!!error) para el Input */}
      <Input {...inputProps} error={!!error} />
    </FormControl>
  );
}
