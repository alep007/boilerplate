"use client";

import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { FinishingFields } from "../FinishingFields";
import { OrderFinishing } from "@/entities/order/model/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FinishingFieldsAdapter(props: any) {
  const { input } = useFieldApi(props);
  return (
    <FinishingFields
      value={(input.value as OrderFinishing) || {}}
      onChange={input.onChange}
    />
  );
}
