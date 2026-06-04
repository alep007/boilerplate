// packages/forms/src/mapper.tsx
"use client";

import React from "react";
import {
  componentTypes,
  useFieldApi,
} from "@data-driven-forms/react-form-renderer";
import { FormField, Checkbox } from "@repo/ui";

// Adaptador para Inputs de texto, email, password, etc.
const TextFieldAdapter = (props: any) => {
  const { input, meta, ...rest } = useFieldApi(props);

  return (
    <FormField
      {...input} // Pasa name, value, onChange, onBlur, onFocus
      {...rest} // Pasa label, type, placeholder, etc.
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};

// Adaptador para el Checkbox
const CheckboxAdapter = (props: any) => {
  const { input, meta, label, ...rest } = useFieldApi({
    ...props,
    type: "checkbox",
  });

  return (
    <Checkbox
      checked={!!input.checked}
      onChange={input.onChange}
      onBlur={input.onBlur}
      onFocus={input.onFocus}
      {...rest}
    >
      {label}
    </Checkbox>
  );
};

// El diccionario central que DDF utilizará
export const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextFieldAdapter,
  [componentTypes.CHECKBOX]: CheckboxAdapter,
};
