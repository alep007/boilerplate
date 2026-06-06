"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  MutableRefObject,
} from "react";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import { useFormApi } from "@data-driven-forms/react-form-renderer";
import type { Schema } from "@data-driven-forms/react-form-renderer";
import { componentMapper } from "./mapper";
import { FormApiCapture } from "./FormApiCapture";
import { COMPONENT_TYPES } from "./componentTypes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormApi = ReturnType<typeof useFormApi>;

export interface ManagedFormHandle {
  getValues: () => Record<string, unknown>;
  validate: () => Promise<boolean>;
}

export interface ManagedFormProps {
  schema: Schema;
  initialValues?: Record<string, unknown>;
  onDirtyChange?: (isDirty: boolean) => void;
  componentMapper?: Record<string, React.ComponentType<never>>;
}

const FormTemplate = ({ formFields }: { formFields: React.ReactNode }) => (
  <>{formFields}</>
);

export const ManagedForm = forwardRef<ManagedFormHandle, ManagedFormProps>(
  function ManagedForm(
    { schema, initialValues, onDirtyChange, componentMapper: customMapper },
    ref
  ) {
    const formApiRef = useRef<FormApi | null>(
      null
    ) as MutableRefObject<FormApi | null>;

    const mergedMapper = useMemo(
      () => ({ ...componentMapper, ...(customMapper ?? {}) }),
      // customMapper identity assumed stable (defined outside component or useMemo'd by caller)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customMapper]
    );

    const augmentedSchema = useMemo<Schema>(
      () => ({
        ...schema,
        fields: [
          ...schema.fields,
          {
            component: COMPONENT_TYPES.FORM_API_CAPTURE,
            name: "__form_api_capture",
            apiRef: formApiRef,
            onDirtyChange,
          },
        ],
      }),
      // Schema identity is stable when built via useMemo in the caller.
      // onDirtyChange is forwarded via ref inside FormApiCapture so it's safe.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [schema]
    );

    useImperativeHandle(ref, () => ({
      getValues: () => (formApiRef.current?.getState().values ?? {}) as Record<string, unknown>,
      validate: async () => {
        if (!formApiRef.current) return false;
        // submit() triggers all validators and marks fields touched.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (formApiRef.current as any).submit();
        const state = formApiRef.current.getState();
        return !state.hasValidationErrors && !state.validating;
      },
    }));

    return (
      <FormRenderer
        schema={augmentedSchema}
        initialValues={initialValues}
        onSubmit={() => {}}
        componentMapper={
          {
            ...mergedMapper,
            [COMPONENT_TYPES.FORM_API_CAPTURE]: FormApiCapture,
          } as never
        }
        FormTemplate={FormTemplate as never}
      />
    );
  }
);
