// packages/forms/src/DeclarativeForm.tsx
"use client";

import React from "react";
import FormRenderer, {
  FormRendererProps,
} from "@data-driven-forms/react-form-renderer/form-renderer";
import { componentMapper } from "./mapper";
import { Button } from "@repo/ui";

// Interfaz para extender las propiedades base
export interface DeclarativeFormProps extends Omit<
  FormRendererProps,
  "componentMapper" | "FormTemplate"
> {
  submitLabel?: string;
  isLoading?: boolean;
}

// Un FormTemplate básico para envolver los campos y colocar el botón de envío
const FormTemplate = ({ formFields, schema }: any) => {
  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {formFields}
      <Button type="submit">
        {/* Aquí podríamos pasar la prop submitLabel mediante un contexto,
            pero por ahora lo dejamos por defecto */}
        Enviar
      </Button>
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
