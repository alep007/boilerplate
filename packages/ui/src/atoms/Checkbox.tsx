// packages/ui/src/atoms/Checkbox.tsx
"use client";

import { Checkbox as BaseCheckbox, CheckboxProps } from "baseui/checkbox";

export interface CustomCheckboxProps extends CheckboxProps {
  children?: React.ReactNode;
}

export function Checkbox({ children, ...props }: CustomCheckboxProps) {
  return <BaseCheckbox {...props}>{children}</BaseCheckbox>;
}
