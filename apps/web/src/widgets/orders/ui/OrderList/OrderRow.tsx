"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { Badge } from "@repo/ui";
import { Order } from "@/entities/order/model/types";
import {
  PRODUCTION_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from "../shared/statusConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  order: Order;
  onClick: () => void;
}

export function OrderRow({ order, onClick }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");

  const prodConfig = PRODUCTION_STATUS_CONFIG[order.production_status];
  const payConfig = PAYMENT_STATUS_CONFIG[order.payment_status];

  const deliveryDate = format(
    new Date(order.delivery_date + "T00:00:00"),
    "dd/MM/yyyy",
    { locale: es }
  );

  return (
    <tr
      onClick={onClick}
      className={css({
        cursor: "pointer",
        ":hover": { backgroundColor: theme.colors.backgroundSecondary },
        transition: "background-color 0.1s",
      })}
    >
      <td className={css({ padding: "12px 16px", fontWeight: "600", color: theme.colors.contentPrimary })}>
        #{String(order.order_number).padStart(3, "0")}
      </td>
      <td className={css({ padding: "12px 16px", color: theme.colors.contentPrimary })}>
        {order.customer_name}
      </td>
      <td
        className={css({
          padding: "12px 16px",
          color: theme.colors.contentSecondary,
          maxWidth: "240px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        })}
      >
        {order.description}
      </td>
      <td className={css({ padding: "12px 16px", color: theme.colors.contentSecondary })}>
        {deliveryDate}
      </td>
      <td className={css({ padding: "12px 16px" })}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Badge label={t(prodConfig.labelKey as any)} variant={prodConfig.variant} />
      </td>
      <td className={css({ padding: "12px 16px" })}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Badge label={t(payConfig.labelKey as any)} variant={payConfig.variant} />
      </td>
    </tr>
  );
}
