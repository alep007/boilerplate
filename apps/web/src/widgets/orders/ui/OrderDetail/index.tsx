"use client";

import { useState, useCallback, useRef } from "react";
import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { LabelMedium } from "baseui/typography";
import { Order, MOCK_ACCOUNT_ID } from "@/entities/order/model/types";
import { useOrder } from "@/entities/order/lib/useOrder";
import { useNextOrderNumber } from "@/entities/order/lib/useNextOrderNumber";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { ProductionProgressCard } from "./ProductionProgressCard";
import { OrderInfoView } from "./OrderInfoView";
import { OrderForm, OrderFormHandle } from "../OrderForm";
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
  const [showPrice, setShowPrice] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [pendingSaveAndPrint, setPendingSaveAndPrint] = useState(false);

  const formRef = useRef<OrderFormHandle>(null);

  const handleSave = useCallback(async (): Promise<string | null> => {
    if (!await formRef.current?.validate()) return null;
    if (!formRef.current) return null;
    setIsSaving(true);
    const v = formRef.current.getValues();
    const data: Partial<Order> = {
      customer_name: v.customer_name,
      customer_phone: v.customer_phone || undefined,
      delivery_date: v.delivery_date,
      description: v.description,
      product_type: v.product_type || undefined,
      quantity: v.quantity ? parseInt(v.quantity, 10) : undefined,
      size: v.size || undefined,
      material: v.material || undefined,
      colors: v.colors || undefined,
      operator_notes: v.operator_notes || undefined,
      internal_notes: v.internal_notes || undefined,
      finishing: v.finishing,
      price_total: parseFloat(v.price_total) || 0,
      payment_status: v.payment_status,
      payment_advance:
        v.payment_status === "partial" && v.payment_advance
          ? parseFloat(v.payment_advance)
          : undefined,
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
  }, [isNew, nextNumber, order, save, router, locale]);

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
        gap: "24px",
        maxWidth: "1080px",
      })}
    >
      {/* ── Page header ── */}
      <OrderDetailHeader
        order={isNew ? null : order}
        isNew={isNew}
        isEditing={isEditing}
        isDirty={isDirty}
        isSaving={isSaving || pendingSaveAndPrint}
        showPrice={showPrice}
        onTogglePrice={setShowPrice}
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

      {/* ── Production progress (view mode only, existing orders) ── */}
      {!isNew && order && !isEditing && (
        <ProductionProgressCard
          orderId={order.id}
          currentStatus={order.production_status}
          paymentStatus={order.payment_status}
        />
      )}

      {/* ── Form (edit mode) or info view (view mode) ── */}
      {isEditing ? (
        <OrderForm
          ref={formRef}
          initialValues={isNew ? { delivery_date: "", customer_name: "" } : (order ?? {})}
          isNew={isNew}
          onDirtyChange={setIsDirty}
        />
      ) : (
        order && <OrderInfoView order={order} onEdit={() => setIsEditing(true)} />
      )}

      <PrintConfirmModal
        isOpen={showPrintModal}
        orderId={order?.id ?? ""}
        onClose={() => setShowPrintModal(false)}
        initialPriceMode={showPrice ? "with" : "without"}
      />
    </div>
  );
}
