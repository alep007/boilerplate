// packages/forms/src/DeclarativeForm.tsx
"use client";

import React from "react";
import FormRenderer, {
  FormRendererProps,
} from "@data-driven-forms/react-form-renderer/form-renderer";
// 1. Importamos useFormApi
import { useFormApi } from "@data-driven-forms/react-form-renderer";
import { componentMapper } from "./mapper";
import { Button } from "@repo/ui";

export interface DeclarativeFormProps extends Omit<
  FormRendererProps,
  "componentMapper" | "FormTemplate"
> {
  submitLabel?: string;
  isLoading?: boolean;
}

const FormTemplate = ({ formFields }: any) => {
  // 2. Extraemos el handleSubmit de la API interna del formulario
  const { handleSubmit } = useFormApi();

  return (
    // 3. Conectamos el evento al formulario HTML
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {formFields}
      <Button type="submit">Enviar</Button>
    </form>
  );
};

export const DeclarativeForm = ({
  schema,
  onSubmit,
  ...rest
}: DeclarativeFormProps) => {
  return (
    <FormRenderer
      schema={schema}
      componentMapper={componentMapper}
      FormTemplate={FormTemplate}
      onSubmit={onSubmit}
      {...rest}
    />
  );
};
