"use client";

import React from "react";
import {
  componentTypes,
  useFieldApi,
} from "@data-driven-forms/react-form-renderer";
import { FormField, Checkbox, Select, DatePicker, Textarea } from "@repo/ui";
import { LabeledField } from "@repo/ui";
import { COMPONENT_TYPES } from "./componentTypes";
import { FormSectionAdapter } from "./adapters/FormSectionAdapter";
import { SideBySideAdapter } from "./adapters/SideBySideAdapter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextFieldAdapter = (props: any) => {
  const { input, meta, span: _span, ...rest } = useFieldApi(props);
  return (
    <FormField
      {...input}
      {...rest}
      error={meta.touched && meta.error ? meta.error : undefined}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextareaAdapter = (props: any) => {
  const { input, meta, label, span: _span, rows, ...rest } = useFieldApi(props);
  return (
    <LabeledField label={label} error={meta.touched && meta.error ? meta.error : undefined}>
      <Textarea
        {...input}
        {...rest}
        rows={rows}
        error={!!(meta.touched && meta.error)}
      />
    </LabeledField>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CheckboxAdapter = (props: any) => {
  const { input, meta: _meta, label, span: _span, ...rest } = useFieldApi({
    ...props,
    type: "checkbox",
  });

  return (
    <Checkbox
      checked={!!input.checked}
      onChange={input.onChange}
      onBlur={input.onBlur as never}
      onFocus={input.onFocus as never}
      {...rest}
    >
      {label}
    </Checkbox>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectAdapter = (props: any) => {
  const { input, meta, label, options, span: _span, ...rest } = useFieldApi(props);
  const value = input.value
    ? [{ id: input.value, label: options?.find((o: { id: unknown }) => o.id === input.value)?.label ?? input.value }]
    : [];
  return (
    <LabeledField label={label} error={meta.touched && meta.error ? meta.error : undefined}>
      <Select
        options={options ?? []}
        value={value}
        onChange={({ value: v }) => input.onChange(v[0]?.id ?? "")}
        error={!!(meta.touched && meta.error)}
        {...rest}
      />
    </LabeledField>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DatePickerAdapter = (props: any) => {
  const { input, meta, label, minDate, span: _span, ...rest } = useFieldApi(props);
  const dateValue = input.value ? new Date(input.value) : null;
  return (
    <LabeledField label={label} error={meta.touched && meta.error ? meta.error : undefined}>
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
    </LabeledField>
  );
};

export const componentMapper = {
  [componentTypes.TEXT_FIELD]: TextFieldAdapter,
  [componentTypes.TEXTAREA]: TextareaAdapter,
  [componentTypes.CHECKBOX]: CheckboxAdapter,
  [componentTypes.SELECT]: SelectAdapter,
  [componentTypes.DATE_PICKER]: DatePickerAdapter,
  [COMPONENT_TYPES.FORM_SECTION]: FormSectionAdapter,
  [COMPONENT_TYPES.SIDE_BY_SIDE]: SideBySideAdapter,
};
