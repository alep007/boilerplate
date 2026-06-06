"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import { Badge, Button } from "@repo/ui";
import { Order } from "@/entities/order/model/types";
import { PAYMENT_STATUS_CONFIG } from "../shared/statusConfig";

interface Props {
  order: Order;
  /** Opens edit mode — wired up to the parent's setIsEditing */
  onEdit: () => void;
}

export function PaymentCard({ order, onEdit }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const white = (theme.colors as Record<string, string>).mono100 ?? "#ffffff";
  const payConfig = PAYMENT_STATUS_CONFIG[order.payment_status];

  const advance = order.payment_advance ?? 0;
  const balance = order.price_total - advance;
  const paidPercent =
    order.payment_status === "paid"
      ? 100
      : order.payment_status === "partial" && order.price_total > 0
      ? Math.min(100, (advance / order.price_total) * 100)
      : 0;

  return (
    <div
      className={css({
        border: `1px solid ${theme.colors.borderOpaque}`,
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: white,
      })}
    >
      {/* ── Header ── */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: `1px solid ${theme.colors.borderOpaque}`,
          backgroundColor: theme.colors.backgroundSecondary,
        })}
      >
        <div className={css({ display: "flex", alignItems: "center", gap: "8px" })}>
          <Wallet size={16} color={theme.colors.buttonPrimaryFill} strokeWidth={1.8} />
          <span
            className={css({
              fontSize: "15px",
              fontWeight: "600",
              color: theme.colors.contentPrimary,
              fontFamily: "var(--font-inter), sans-serif",
            })}
          >
            {t("sectionPayment")}
          </span>
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Badge label={t(payConfig.labelKey as any)} variant={payConfig.variant} />
      </div>

      {/* ── Body ── */}
      <div className={css({ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" })}>
        {/* Total row */}
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "12px",
            borderBottom: `1px solid ${theme.colors.borderOpaque}`,
          })}
        >
          <span
            className={css({
              fontSize: "14px",
              fontWeight: "700",
              color: theme.colors.contentPrimary,
              fontFamily: "var(--font-inter), sans-serif",
            })}
          >
            {t("total")}
          </span>
          <span
            className={css({
              fontSize: "20px",
              fontWeight: "700",
              color: theme.colors.buttonPrimaryFill,
              fontFamily: "var(--font-inter), sans-serif",
            })}
          >
            ${order.price_total.toFixed(2)}
          </span>
        </div>

        {/* Partial payment breakdown */}
        {order.payment_status === "partial" && (
          <>
            <div className={css({ display: "flex", flexDirection: "column", gap: "8px" })}>
              {/* Paid amount */}
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <div className={css({ display: "flex", alignItems: "center", gap: "6px" })}>
                  <div
                    className={css({
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: theme.colors.backgroundPositive,
                      flexShrink: 0,
                    })}
                  />
                  <span className={css({ fontSize: "14px", color: theme.colors.contentPrimary, fontFamily: "var(--font-inter), sans-serif" })}>
                    {t("paidAmount")}
                  </span>
                </div>
                <span
                  className={css({
                    fontSize: "15px",
                    fontWeight: "700",
                    color: theme.colors.backgroundPositive,
                    fontFamily: "var(--font-mono), monospace",
                  })}
                >
                  ${advance.toFixed(2)}
                </span>
              </div>

              {/* Balance */}
              <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "center" })}>
                <div className={css({ display: "flex", alignItems: "center", gap: "6px" })}>
                  <div
                    className={css({
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: theme.colors.contentNegative,
                      flexShrink: 0,
                    })}
                  />
                  <span className={css({ fontSize: "14px", color: theme.colors.contentPrimary, fontFamily: "var(--font-inter), sans-serif" })}>
                    {t("pendingBalance")}
                  </span>
                </div>
                <span
                  className={css({
                    fontSize: "15px",
                    fontWeight: "700",
                    color: theme.colors.contentNegative,
                    fontFamily: "var(--font-mono), monospace",
                  })}
                >
                  ${balance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className={css({
                height: "8px",
                borderRadius: "4px",
                backgroundColor: theme.colors.backgroundSecondary,
                overflow: "hidden",
              })}
            >
              <div
                className={css({
                  height: "100%",
                  width: `${paidPercent}%`,
                  borderRadius: "4px",
                  backgroundColor: theme.colors.backgroundPositive,
                  transition: "width 400ms ease",
                })}
              />
            </div>
          </>
        )}

        {/* Add payment button */}
        <div className={css({ marginTop: "4px" })}>
          <Button kind="secondary" onClick={onEdit} overrides={{ BaseButton: { style: { width: "100%" } } }}>
            {t("addPayment")}
          </Button>
        </div>
      </div>
    </div>
  );
}
