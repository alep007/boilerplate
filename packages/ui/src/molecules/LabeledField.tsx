"use client";

import React from "react";
import { useStyletron } from "baseui";
import { LabelSmall } from "baseui/typography";

interface LabeledFieldProps {
  label?: string;
  error?: React.ReactNode;
  children: React.ReactNode;
}

export function LabeledField({ label, error, children }: LabeledFieldProps) {
  const [css, theme] = useStyletron();
  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "6px" })}>
      {label && (
        <LabelSmall color={theme.colors.contentSecondary}>{label}</LabelSmall>
      )}
      {children}
      {error && (
        <LabelSmall color={theme.colors.contentNegative}>{error as string}</LabelSmall>
      )}
    </div>
  );
}
