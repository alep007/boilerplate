"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { FieldEntry } from "@repo/ui";
import { Order } from "@/entities/order/model/types";

interface Props {
  order: Order;
}

function buildFinishingText(order: Order): string | undefined {
  const parts: string[] = [];
  if (order.finishing.numbered) {
    parts.push(`Numerado ${order.finishing.numbered.from}–${order.finishing.numbered.to}`);
  }
  if (order.finishing.copies) parts.push(`${order.finishing.copies} copias`);
  if (order.finishing.glued) parts.push("Engomado");
  if (order.finishing.perforated) parts.push("Perforado");
  return parts.length > 0 ? parts.join(" + ") : undefined;
}

export function SpecificationsCard({ order }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const white = (theme.colors as Record<string, string>).mono100 ?? "#ffffff";
  const orderCode = `#${String(order.order_number).padStart(5, "0")}`;

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
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.colors.borderOpaque}`,
        })}
      >
        <div className={css({ display: "flex", alignItems: "center", gap: "10px" })}>
          <FileText size={18} color={theme.colors.buttonPrimaryFill} strokeWidth={1.8} />
          <span
            className={css({
              fontSize: "16px",
              fontWeight: "700",
              color: theme.colors.contentPrimary,
              fontFamily: "var(--font-inter), sans-serif",
            })}
          >
            {t("sectionSpecs")}
          </span>
        </div>
        <span
          className={css({
            fontSize: "13px",
            fontWeight: "500",
            color: theme.colors.contentSecondary,
            fontFamily: "var(--font-mono), monospace",
            backgroundColor: theme.colors.backgroundSecondary,
            padding: "3px 10px",
            borderRadius: "6px",
            letterSpacing: "0.04em",
          })}
        >
          {orderCode}
        </span>
      </div>

      {/* ── Fields grid ── */}
      <div
        className={css({
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px 20px",
        })}
      >
        <FieldEntry label={t("fieldDescription")} value={order.description} />
        <FieldEntry
          label={t("fieldQuantity")}
          value={order.quantity ? `${order.quantity.toLocaleString()} u.` : undefined}
        />
        <FieldEntry label={t("fieldSize")} value={order.size} />
        <FieldEntry label={t("fieldMaterial")} value={order.material} />
        <FieldEntry label={t("fieldColors")} value={order.colors} />
        <FieldEntry label={t("finishing")} value={buildFinishingText(order)} />
      </div>
    </div>
  );
}
