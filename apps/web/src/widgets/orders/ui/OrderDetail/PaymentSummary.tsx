"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { HeadingMedium, LabelMedium } from "baseui/typography";
import { Badge } from "@repo/ui";
import { Order } from "@/entities/order/model/types";
import { PAYMENT_STATUS_CONFIG } from "../shared/statusConfig";

interface Props {
  order: Order;
}

export function PaymentSummary({ order }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");

  const payConfig = PAYMENT_STATUS_CONFIG[order.payment_status];
  const balance =
    order.payment_status === "partial" && order.payment_advance != null
      ? order.price_total - order.payment_advance
      : null;

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "16px 20px",
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: "8px",
        flexWrap: "wrap",
      })}
    >
      <HeadingMedium color={theme.colors.contentPrimary} $style={{ margin: 0 }}>
        ${order.price_total.toFixed(2)}
      </HeadingMedium>

      <Badge label={t(payConfig.labelKey as any)} variant={payConfig.variant} />

      {order.payment_status === "partial" && order.payment_advance != null && (
        <>
          <LabelMedium color={theme.colors.contentSecondary}>
            {t("advance")}: ${order.payment_advance.toFixed(2)}
          </LabelMedium>
          {balance !== null && (
            <LabelMedium color={theme.colors.contentPrimary}>
              {t("balance")}: ${balance.toFixed(2)}
            </LabelMedium>
          )}
        </>
      )}
    </div>
  );
}
