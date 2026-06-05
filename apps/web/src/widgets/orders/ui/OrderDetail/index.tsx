"use client";

import { useState, useCallback, useRef } from "react";
import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { LabelMedium } from "baseui/typography";
import { Order, PaymentStatus, OrderFinishing, MOCK_ACCOUNT_ID } from "@/entities/order/model/types";
import { useOrder } from "@/entities/order/lib/useOrder";
import { useNextOrderNumber } from "@/entities/order/lib/useNextOrderNumber";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { ProductionStepper } from "./ProductionStepper";
import { StageAdvanceButton } from "./StageAdvanceButton";
import { OrderInfoView } from "./OrderInfoView";
import { PaymentSummary } from "./PaymentSummary";
import { OrderForm } from "../OrderForm";
import { PrintConfirmModal } from "../PrintConfirmModal";

interface Props {
  mode: "new" | "edit";
  id?: string;
}

export function OrderDetail({ mode, id }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const orderId = mode === "new" ? "new" : (id ?? "new");
  const { order, save } = useOrder(orderId);
  const { nextNumber, error: orderNumberError } = useNextOrderNumber();

  const isNew = mode === "new";
  const [isEditing, setIsEditing] = useState(isNew);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [pendingSaveAndPrint, setPendingSaveAndPrint] = useState(false);

  // Form state (controlled outside DDF for payment + finishing)
  const [finishing, setFinishing] = useState<OrderFinishing>(order?.finishing ?? {});
  const [priceTotal, setPriceTotal] = useState(order?.price_total ?? 0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order?.payment_status ?? "paid"
  );
  const [paymentAdvance, setPaymentAdvance] = useState<number | undefined>(
    order?.payment_advance
  );
  const [ddfValues, setDdfValues] = useState<Partial<Order>>(order ?? {});
  const [paymentErrors, setPaymentErrors] = useState<{
    price_total?: string;
    payment_advance?: string;
  }>({});

  // Use refs for values used in callbacks to avoid stale closure issues
  const finishingRef = useRef(finishing);
  finishingRef.current = finishing;
  const priceTotalRef = useRef(priceTotal);
  priceTotalRef.current = priceTotal;
  const paymentStatusRef = useRef(paymentStatus);
  paymentStatusRef.current = paymentStatus;
  const paymentAdvanceRef = useRef(paymentAdvance);
  paymentAdvanceRef.current = paymentAdvance;
  const ddfValuesRef = useRef(ddfValues);
  ddfValuesRef.current = ddfValues;

  const validate = useCallback((): boolean => {
    const errors: { price_total?: string; payment_advance?: string } = {};
    if (priceTotalRef.current <= 0) errors.price_total = t("validationPriceTotal");
    if (
      paymentStatusRef.current === "partial" &&
      (paymentAdvanceRef.current == null || paymentAdvanceRef.current >= priceTotalRef.current)
    ) {
      errors.payment_advance = t("validationPaymentAdvance");
    }
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }, [t]);

  const handleSave = useCallback(
    async (values?: Partial<Order>): Promise<string | null> => {
      if (!validate()) return null;
      setIsSaving(true);
      const data: Partial<Order> = {
        ...(values ?? ddfValuesRef.current),
        finishing: finishingRef.current,
        price_total: priceTotalRef.current,
        payment_status: paymentStatusRef.current,
        payment_advance:
          paymentStatusRef.current === "partial" ? paymentAdvanceRef.current : undefined,
        production_status: isNew ? "received" : order?.production_status,
        order_number: isNew ? nextNumber : order?.order_number,
        account_id: MOCK_ACCOUNT_ID,
      };
      const result = await save(data);
      setIsSaving(false);
      if (result.success) {
        setIsDirty(false);
        setIsEditing(false);
        if (isNew) router.push(`/${locale}/orders/${result.id}`);
        return result.id;
      }
      return null;
    },
    [validate, isNew, nextNumber, order, save, router, locale]
  );

  const handleSaveAndPrint = useCallback(async () => {
    setPendingSaveAndPrint(true);
    const savedId = await handleSave();
    setPendingSaveAndPrint(false);
    if (savedId) setShowPrintModal(true);
  }, [handleSave]);

  if (isNew && orderNumberError) {
    return (
      <div className={css({ padding: "40px", textAlign: "center" })}>
        <LabelMedium color={theme.colors.contentNegative}>
          {t("orderNumberError")}
        </LabelMedium>
      </div>
    );
  }

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        maxWidth: "900px",
      })}
    >
      <OrderDetailHeader
        order={isNew ? null : order}
        isNew={isNew}
        isEditing={isEditing}
        isDirty={isDirty}
        isSaving={isSaving || pendingSaveAndPrint}
        onEdit={() => setIsEditing(true)}
        onCancel={() => {
          setIsEditing(false);
          setIsDirty(false);
        }}
        onSave={() => handleSave()}
        onPrint={() => {
          if (isNew) {
            handleSaveAndPrint();
          } else {
            setShowPrintModal(true);
          }
        }}
      />

      {!isNew && order && (
        <div className={css({ display: "flex", flexDirection: "column", gap: "16px" })}>
          <ProductionStepper currentStatus={order.production_status} />
          <StageAdvanceButton
            orderId={order.id}
            currentStatus={order.production_status}
            paymentStatus={order.payment_status}
          />
        </div>
      )}

      {isEditing ? (
        <OrderForm
          initialValues={isNew ? { delivery_date: "", customer_name: "" } : (order ?? {})}
          isNew={isNew}
          finishing={finishing}
          onFinishingChange={(v) => {
            setFinishing(v);
            setIsDirty(true);
          }}
          priceTotal={priceTotal}
          paymentStatus={paymentStatus}
          paymentAdvance={paymentAdvance}
          onPriceTotalChange={(v) => {
            setPriceTotal(v);
            setIsDirty(true);
          }}
          onPaymentStatusChange={(v) => {
            setPaymentStatus(v);
            setIsDirty(true);
          }}
          onPaymentAdvanceChange={(v) => {
            setPaymentAdvance(v);
            setIsDirty(true);
          }}
          onSubmit={(values) => {
            setDdfValues(values);
            setIsDirty(true);
          }}
          paymentErrors={paymentErrors}
        />
      ) : (
        order && (
          <>
            <OrderInfoView order={order} />
            <PaymentSummary order={order} />
          </>
        )
      )}

      <PrintConfirmModal
        isOpen={showPrintModal}
        orderId={order?.id ?? ""}
        onClose={() => setShowPrintModal(false)}
      />
    </div>
  );
}
