// packages/ui/src/atoms/Input.tsx
"use client";

import { Input as BaseInput, InputProps } from "baseui/input";

// Exportamos nuestra propia interfaz por si en el futuro queremos
// añadir props personalizadas (ej. un prop "variant" propio)
export interface CustomInputProps extends InputProps {}

export function Input(props: CustomInputProps) {
  return (
    <BaseInput
      {...props}
      // Aquí podrías inyectar overrides globales por defecto si quisieras
      // overrides={{ Root: { style: { borderRadius: '8px' } } }}
    />
  );
}
