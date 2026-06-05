"use client";

import React from "react";
import {
  componentTypes,
  useFieldApi,
} from "@data-driven-forms/react-form-renderer";
import { FormField, Checkbox, Select, DatePicker, Textarea } from "@repo/ui";
import { FormControl } from "baseui/form-control";

// Adaptador para Inputs de texto, email, password, etc.
const TextFieldAdapter = (props: any) => {
  const { input, meta, ...rest } = useFieldApi(props);
  return (
    <FormField
      {...input}
      {...rest}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};

const TextareaAdapter = (props: any) => {
  const { input, meta, label, ...rest } = useFieldApi(props);
  return (
    <FormControl
      label={label}
      error={meta.touched && meta.error ? meta.error : undefined}
    >
      <Textarea
        {...input}
        {...rest}
        error={!!(meta.touched && meta.error)}
      />
    </FormControl>
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
      onBlur={input.onBlur as any}
      onFocus={input.onFocus as any}
      {...rest}
    >
      {label}
    </Checkbox>
  );
};

const SelectAdapter = (props: any) => {
  const { input, meta, label, options, ...rest } = useFieldApi(props);
  const value = input.value
    ? [{ id: input.value, label: options?.find((o: any) => o.id === input.value)?.label ?? input.value }]
    : [];
  return (
    <FormControl
      label={label}
      error={meta.touched && meta.error ? meta.error : undefined}
    >
      <Select
        options={options ?? []}
        value={value}
        onChange={({ value: v }) => input.onChange(v[0]?.id ?? "")}
        error={!!(meta.touched && meta.error)}
        {...rest}
      />
    </FormControl>
  );
};

const DatePickerAdapter = (props: any) => {
  const { input, meta, label, minDate, ...rest } = useFieldApi(props);
  const dateValue = input.value ? new Date(input.value) : null;
  return (
    <FormControl
      label={label}
      error={meta.touched && meta.error ? meta.error : undefined}
    >
      <DatePicker
        value={dateValue}
        onChange={({ date }) => {
          if (date && !Array.isArray(date)) {
            input.onChange((date as Date).toISOString().split("T")[0]);
          } else {
            input.onChange(null);
          }
        }}
        minDate={minDate}
        error={!!(meta.touched && meta.error)}
        {...rest}
      />
    </FormControl>
  );
};

// El diccionario central que DDF utilizará
export const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextFieldAdapter,
  [componentTypes.TEXTAREA]: TextareaAdapter,
  [componentTypes.CHECKBOX]: CheckboxAdapter,
  [componentTypes.SELECT]: SelectAdapter,
  [componentTypes.DATE_PICKER]: DatePickerAdapter,
};
