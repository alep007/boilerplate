"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ManagedForm, ManagedFormHandle } from "@repo/forms";
import { Order } from "@/entities/order/model/types";
import { buildOrderSchema } from "./orderSchema";
import { FinishingFieldsAdapter } from "./adapters/FinishingFieldsAdapter";
import { PaymentStatusAdapter } from "./adapters/PaymentStatusAdapter";

// ── Public types ──────────────────────────────────────────────────────────────

export interface OrderFormValues extends Record<string, unknown> {
  customer_name: string;
  customer_phone: string;
  delivery_date: string;
  description: string;
  product_type: string;
  quantity: string;
  size: string;
  material: string;
  colors: string;
  operator_notes: string;
  internal_notes: string;
  finishing: Order["finishing"];
  price_total: string;
  payment_status: Order["payment_status"];
  payment_advance: string | undefined;
}

export interface OrderFormHandle {
  getValues: () => OrderFormValues;
  validate: () => Promise<boolean>;
}

interface OrderFormProps {
  initialValues?: Partial<Order>;
  isNew: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

const ORDER_COMPONENT_MAPPER = {
  "finishing-fields": FinishingFieldsAdapter,
  "payment-status": PaymentStatusAdapter,
} as const;

// ── OrderForm ─────────────────────────────────────────────────────────────────

export const OrderForm = forwardRef<OrderFormHandle, OrderFormProps>(
  function OrderForm({ initialValues, isNew: _isNew, onDirtyChange }, ref) {
    const t = useTranslations("Orders");
    const managedRef = useRef<ManagedFormHandle>(null);

    const schema = useMemo(() => buildOrderSchema((key) => t(key as never)), [t]);

    const dfInitialValues = useMemo<Record<string, unknown>>(
      () => ({
        customer_name: initialValues?.customer_name ?? "",
        customer_phone: initialValues?.customer_phone ?? "",
        delivery_date: initialValues?.delivery_date ?? "",
        description: initialValues?.description ?? "",
        product_type: initialValues?.product_type ?? "",
        quantity: initialValues?.quantity != null ? String(initialValues.quantity) : "",
        size: initialValues?.size ?? "",
        material: initialValues?.material ?? "",
        colors: initialValues?.colors ?? "",
        operator_notes: initialValues?.operator_notes ?? "",
        internal_notes: initialValues?.internal_notes ?? "",
        finishing: initialValues?.finishing ?? {},
        price_total: initialValues?.price_total != null ? String(initialValues.price_total) : "",
        payment_status: initialValues?.payment_status ?? "paid",
        payment_advance:
          initialValues?.payment_advance != null
            ? String(initialValues.payment_advance)
            : undefined,
      }),
      // initialValues identity is stable per render cycle
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    useImperativeHandle(ref, () => ({
      getValues: () => (managedRef.current?.getValues() ?? {}) as OrderFormValues,
      validate: () => managedRef.current?.validate() ?? Promise.resolve(false),
    }));

    return (
      <ManagedForm
        ref={managedRef}
        schema={schema}
        initialValues={dfInitialValues}
        onDirtyChange={onDirtyChange}
        componentMapper={ORDER_COMPONENT_MAPPER as never}
      />
    );
  }
);
