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
    const totalFromItems = v.items.reduce(
      (sum, item) => sum + item.quantity * item.price_unit,
      0
    );
    const data: Partial<Order> = {
      order_type: v.order_type,
      order_date: v.order_date,
      customer_name: v.customer_name,
      customer_phone: v.customer_phone || undefined,
      items: v.items,
      price_total: totalFromItems,
      payment_status: v.payment_status,
      payment_advance: v.payment_advance > 0 ? v.payment_advance : undefined,
      production_status: isNew ? "received" : order?.production_status,
      order_number: isNew ? nextNumber : order?.order_number,
      account_id: MOCK_ACCOUNT_ID,
      // backward compat: derive these from items
      delivery_date: v.items[0]?.delivery_date ?? v.order_date,
      description: v.items.map((i) => i.detail).join(", "),
      finishing: order?.finishing ?? {},
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
        maxWidth: "1400px",
        width: "100%",
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
        sticky
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
          initialValues={
            isNew
              ? { order_date: new Date().toISOString().split("T")[0], customer_name: "", finishing: {} }
              : (order ?? {})
          }
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
