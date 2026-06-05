"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { LabelSmall } from "baseui/typography";
import { Input } from "@repo/ui";
import { PaymentStatus } from "@/entities/order/model/types";
import { PAYMENT_STATUS_CONFIG } from "../shared/statusConfig";

interface Props {
  priceTotal: number;
  paymentStatus: PaymentStatus;
  paymentAdvance?: number;
  onPriceTotalChange: (v: number) => void;
  onPaymentStatusChange: (v: PaymentStatus) => void;
  onPaymentAdvanceChange: (v: number | undefined) => void;
  errors?: {
    price_total?: string;
    payment_advance?: string;
  };
}

const PAYMENT_OPTIONS: PaymentStatus[] = ["paid", "partial", "pending"];

export function PaymentEditForm({
  priceTotal,
  paymentStatus,
  paymentAdvance,
  onPriceTotalChange,
  onPaymentStatusChange,
  onPaymentAdvanceChange,
  errors,
}: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "16px" })}>
      {/* Price total */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "6px" })}>
        <LabelSmall color={theme.colors.contentSecondary}>{t("fieldPriceTotal")}</LabelSmall>
        <Input
          type="number"
          value={String(priceTotal || "")}
          onChange={(e) => onPriceTotalChange(parseFloat((e.target as HTMLInputElement).value) || 0)}
          startEnhancer="$"
          error={!!errors?.price_total}
        />
        {errors?.price_total && (
          <LabelSmall color={theme.colors.contentNegative}>{errors.price_total}</LabelSmall>
        )}
      </div>

      {/* Payment status pills */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "6px" })}>
        <LabelSmall color={theme.colors.contentSecondary}>{t("sectionPayment")}</LabelSmall>
        <div className={css({ display: "flex", gap: "8px" })}>
          {PAYMENT_OPTIONS.map((status) => {
            const config = PAYMENT_STATUS_CONFIG[status];
            const isActive = paymentStatus === status;
            return (
              <button
                key={status}
                onClick={() => {
                  onPaymentStatusChange(status);
                  if (status !== "partial") onPaymentAdvanceChange(undefined);
                }}
                className={css({
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: `1px solid ${isActive ? theme.colors.buttonPrimaryFill : theme.colors.borderOpaque}`,
                  backgroundColor: isActive ? theme.colors.buttonPrimaryFill : "transparent",
                  color: isActive ? "#ffffff" : theme.colors.contentSecondary,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? "600" : "400",
                })}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {t(config.labelKey as any)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advance input — visible only when partial */}
      {paymentStatus === "partial" && (
        <div className={css({ display: "flex", flexDirection: "column", gap: "6px" })}>
          <LabelSmall color={theme.colors.contentSecondary}>{t("fieldPaymentAdvance")}</LabelSmall>
          <Input
            type="number"
            value={String(paymentAdvance || "")}
            onChange={(e) =>
              onPaymentAdvanceChange(parseFloat((e.target as HTMLInputElement).value) || undefined)
            }
            startEnhancer="$"
            error={!!errors?.payment_advance}
          />
          {errors?.payment_advance && (
            <LabelSmall color={theme.colors.contentNegative}>{errors.payment_advance}</LabelSmall>
          )}
        </div>
      )}
    </div>
  );
}
