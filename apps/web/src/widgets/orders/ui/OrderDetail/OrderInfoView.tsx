"use client";

import React from "react";
import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { LabelSmall, ParagraphMedium } from "baseui/typography";
import { Order } from "@/entities/order/model/types";
import { Badge } from "@repo/ui";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  order: Order;
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  const [css, theme] = useStyletron();
  if (!value) return null;
  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "2px" })}>
      <LabelSmall color={theme.colors.contentSecondary}>{label}</LabelSmall>
      <ParagraphMedium color={theme.colors.contentPrimary}>{value}</ParagraphMedium>
    </div>
  );
}

export function OrderInfoView({ order }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");

  const createdDate = format(new Date(order.created_at), "dd/MM/yyyy", { locale: es });
  const deliveryDate = format(new Date(order.delivery_date + "T00:00:00"), "dd/MM/yyyy", { locale: es });

  const finishingBadges: string[] = [];
  if (order.finishing.numbered) {
    finishingBadges.push(`Numerado ${order.finishing.numbered.from}–${order.finishing.numbered.to}`);
  }
  if (order.finishing.copies) finishingBadges.push(`${order.finishing.copies} copias`);
  if (order.finishing.glued) finishingBadges.push("Engomado");
  if (order.finishing.perforated) finishingBadges.push("Perforado");

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "24px" })}>
      {/* Two-column grid */}
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        })}
      >
        <InfoRow label={t("fieldCustomerName")} value={order.customer_name} />
        <InfoRow label={t("fieldDescription")} value={order.description} />
        <InfoRow label={t("fieldCustomerPhone")} value={order.customer_phone} />
        <InfoRow
          label={t("fieldProductType")}
          value={
            order.product_type && order.quantity
              ? `${order.product_type} — ${order.quantity} u.`
              : order.product_type ?? (order.quantity ? `${order.quantity} u.` : undefined)
          }
        />
        <InfoRow label="Fecha de ingreso" value={createdDate} />
        <InfoRow
          label={t("fieldSize")}
          value={
            [order.size, order.material].filter(Boolean).join(" / ") || undefined
          }
        />
        <InfoRow label={t("fieldDeliveryDate")} value={deliveryDate} />
        <InfoRow label={t("fieldColors")} value={order.colors} />
      </div>

      {/* Finishing badges */}
      {finishingBadges.length > 0 && (
        <div className={css({ display: "flex", flexDirection: "column", gap: "6px" })}>
          <LabelSmall color={theme.colors.contentSecondary}>{t("finishing")}</LabelSmall>
          <div className={css({ display: "flex", gap: "6px", flexWrap: "wrap" })}>
            {finishingBadges.map((b) => (
              <Badge key={b} label={b} variant="neutral" />
            ))}
          </div>
        </div>
      )}

      {/* Operator notes */}
      {order.operator_notes && (
        <div
          className={css({
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: "8px",
            padding: "16px",
            borderLeft: `4px solid ${theme.colors.buttonPrimaryFill}`,
          })}
        >
          <LabelSmall color={theme.colors.contentSecondary} $style={{ marginBottom: "6px" }}>
            {t("sectionOperator")}
          </LabelSmall>
          <ParagraphMedium color={theme.colors.contentPrimary}>
            {order.operator_notes}
          </ParagraphMedium>
        </div>
      )}
    </div>
  );
}
