"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { User, Phone } from "lucide-react";
import { Avatar } from "@repo/ui";
import { Order } from "@/entities/order/model/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  order: Order;
}

export function ClientCard({ order }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const white = (theme.colors as Record<string, string>).mono100 ?? "#ffffff";

  const deliveryDate = format(
    new Date(order.delivery_date + "T00:00:00"),
    "dd/MM/yyyy",
    { locale: es }
  );

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
          gap: "8px",
          padding: "14px 20px",
          borderBottom: `1px solid ${theme.colors.borderOpaque}`,
          backgroundColor: theme.colors.backgroundSecondary,
        })}
      >
        <User size={16} color={theme.colors.buttonPrimaryFill} strokeWidth={2} />
        <span
          className={css({
            fontSize: "15px",
            fontWeight: "600",
            color: theme.colors.contentPrimary,
            fontFamily: "var(--font-inter), sans-serif",
          })}
        >
          {t("sectionClient")}
        </span>
      </div>

      {/* ── Body ── */}
      <div className={css({ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "14px" })}>
        {/* Identity row */}
        <div className={css({ display: "flex", alignItems: "center", gap: "12px" })}>
          <Avatar name={order.customer_name} size={44} />
          <div className={css({ display: "flex", flexDirection: "column", gap: "2px" })}>
            <span
              className={css({
                fontSize: "15px",
                fontWeight: "700",
                color: theme.colors.contentPrimary,
                fontFamily: "var(--font-inter), sans-serif",
              })}
            >
              {order.customer_name}
            </span>
            <span
              className={css({
                fontSize: "12px",
                color: theme.colors.contentSecondary,
                fontFamily: "var(--font-mono), monospace",
              })}
            >
              #{String(order.order_number).padStart(5, "0")}
            </span>
          </div>
        </div>

        {/* Contact details */}
        <div className={css({ display: "flex", flexDirection: "column", gap: "8px" })}>
          {order.customer_phone && (
            <div className={css({ display: "flex", alignItems: "center", gap: "10px" })}>
              <Phone size={14} color={theme.colors.contentSecondary} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <span
                className={css({
                  fontSize: "14px",
                  color: theme.colors.contentSecondary,
                  fontFamily: "var(--font-inter), sans-serif",
                })}
              >
                {order.customer_phone}
              </span>
            </div>
          )}

          {/* Delivery date */}
          <div className={css({ display: "flex", alignItems: "center", gap: "10px" })}>
            <span
              className={css({
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: theme.colors.contentSecondary,
                fontFamily: "var(--font-inter), sans-serif",
                minWidth: "100px",
              })}
            >
              {t("fieldDeliveryDate")}
            </span>
            <span
              className={css({
                fontSize: "14px",
                fontWeight: "600",
                color: theme.colors.contentPrimary,
                fontFamily: "var(--font-inter), sans-serif",
              })}
            >
              {deliveryDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
