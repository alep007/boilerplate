"use client";

import { Textarea as BaseTextarea, TextareaProps as BaseProps } from "baseui/textarea";

export interface TextareaProps extends BaseProps {
  error?: boolean;
}

export function Textarea({ error, ...props }: TextareaProps) {
  return (
    <BaseTextarea
      {...props}
      error={error}
      overrides={{
        Input: {
          style: () => ({
            borderRadius: "8px",
            resize: "vertical",
            minHeight: "80px",
          }),
        },
      }}
    />
  );
}
