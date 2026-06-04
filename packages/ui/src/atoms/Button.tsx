// packages/ui/src/atoms/Button.tsx
"use client";

import { Button as BaseButton, ButtonProps } from "baseui/button";

export interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function Button({ children, ...props }: CustomButtonProps) {
  return <BaseButton {...props}>{children}</BaseButton>;
}
