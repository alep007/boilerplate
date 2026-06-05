"use client";

import { useTranslations } from "next-intl";
import { DeclarativeForm } from "@repo/forms";
import { getOrderSchema } from "./orderSchema";
import { FinishingFields } from "./FinishingFields";
import { PaymentEditForm } from "../OrderDetail/PaymentEditForm";
import { Order, OrderFinishing, PaymentStatus } from "@/entities/order/model/types";
import { useStyletron } from "baseui";
import { LabelMedium } from "baseui/typography";

interface Props {
  initialValues?: Partial<Order>;
  isNew: boolean;
  finishing: OrderFinishing;
  onFinishingChange: (v: OrderFinishing) => void;
  priceTotal: number;
  paymentStatus: PaymentStatus;
  paymentAdvance?: number;
  onPriceTotalChange: (v: number) => void;
  onPaymentStatusChange: (v: PaymentStatus) => void;
  onPaymentAdvanceChange: (v: number | undefined) => void;
  onSubmit: (values: Partial<Order>) => void;
  paymentErrors?: { price_total?: string; payment_advance?: string };
}

export function OrderForm({
  initialValues,
  isNew,
  finishing,
  onFinishingChange,
  priceTotal,
  paymentStatus,
  paymentAdvance,
  onPriceTotalChange,
  onPaymentStatusChange,
  onPaymentAdvanceChange,
  onSubmit,
  paymentErrors,
}: Props) {
  const t = useTranslations("Orders");
  const [css, theme] = useStyletron();
  const schema = getOrderSchema(t as (key: string) => string, isNew);

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "24px" })}>
      <DeclarativeForm
        schema={schema}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSubmit={onSubmit as any}
        initialValues={initialValues}
      />

      <FinishingFields value={finishing} onChange={onFinishingChange} />

      <div className={css({ borderTop: `1px solid ${theme.colors.borderOpaque}`, paddingTop: "24px" })}>
        <LabelMedium color={theme.colors.contentPrimary} $style={{ marginBottom: "16px" }}>
          {t("sectionPayment")}
        </LabelMedium>
        <PaymentEditForm
          priceTotal={priceTotal}
          paymentStatus={paymentStatus}
          paymentAdvance={paymentAdvance}
          onPriceTotalChange={onPriceTotalChange}
          onPaymentStatusChange={onPaymentStatusChange}
          onPaymentAdvanceChange={onPaymentAdvanceChange}
          errors={paymentErrors}
        />
      </div>
    </div>
  );
}
