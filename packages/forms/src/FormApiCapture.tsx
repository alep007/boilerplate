"use client";

import { useEffect, useRef, MutableRefObject } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useFormApi } from "@data-driven-forms/react-form-renderer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormApi = ReturnType<typeof useFormApi<any, any>>;

interface FormApiCaptureProps {
  apiRef: MutableRefObject<FormApi | null>;
  onDirtyChange?: (dirty: boolean) => void;
}

export function FormApiCapture({ apiRef, onDirtyChange }: FormApiCaptureProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formApi = useFormApi() as FormApi;
  apiRef.current = formApi;

  const onDirtyChangeRef = useRef(onDirtyChange);
  onDirtyChangeRef.current = onDirtyChange;

  useEffect(() => {
    if (!onDirtyChangeRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = (formApi as any).subscribe(
      ({ dirty }: { dirty: boolean }) => {
        onDirtyChangeRef.current?.(dirty);
      },
      { dirty: true }
    );
    return unsubscribe;
  // formApi reference is stable within one FormRenderer mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
