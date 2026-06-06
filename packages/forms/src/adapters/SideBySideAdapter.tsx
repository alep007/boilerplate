"use client";

import React from "react";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import { useStyletron } from "baseui";

interface Props {
  fields: unknown[];
}

export function SideBySideAdapter({ fields }: Props) {
  const [css] = useStyletron();
  const { renderForm } = useFormApi();
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        "@media (max-width: 768px)": { gridTemplateColumns: "1fr" },
      })}
    >
      {renderForm(fields as never[])}
    </div>
  );
}
