"use client";

import React from "react";
import useFormApi from "@data-driven-forms/react-form-renderer/use-form-api";
import { FormSection, Col } from "@repo/ui";

interface Props {
  fields: Array<{ name: string; span?: number; [key: string]: unknown }>;
  number?: number;
  title?: string;
  icon?: React.ElementType;
}

const NoopIcon = () => null;

export function FormSectionAdapter({ fields, number = 0, title = "", icon }: Props) {
  const { renderForm } = useFormApi();
  return (
    <FormSection number={number} title={title} icon={icon ?? NoopIcon}>
      {fields.map((field) => (
        <Col key={field.name as string} span={(field.span as number) ?? 12}>
          {renderForm([field as never])}
        </Col>
      ))}
    </FormSection>
  );
}
