"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Order } from "@/entities/order/model/types";
import { OrderRow } from "./OrderRow";
import { LabelSmall, ParagraphMedium } from "baseui/typography";
import { Button } from "@repo/ui";

interface Props {
  orders: Order[];
  isFiltered: boolean;
}

export function OrderTable({ orders, isFiltered }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const handleRowClick = (id: string) => {
    router.push(`/${locale}/orders/${id}`);
  };

  const handleNewOrder = () => {
    router.push(`/${locale}/orders/new`);
  };

  if (orders.length === 0) {
    return (
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 24px",
          gap: "16px",
        })}
      >
        <ParagraphMedium color={theme.colors.contentSecondary}>
          {isFiltered ? t("emptyStateFiltered") : t("emptyState")}
        </ParagraphMedium>
        {!isFiltered && (
          <Button onClick={handleNewOrder}>{t("newOrder")}</Button>
        )}
      </div>
    );
  }

  const HEADERS = [
    t("colNumber"),
    t("colClient"),
    t("colWork"),
    t("colDelivery"),
    t("colStatus"),
    t("colPayment"),
  ];

  return (
    <div
      className={css({
        overflowX: "auto",
        border: `1px solid ${theme.colors.borderOpaque}`,
        borderRadius: "8px",
      })}
    >
      <table className={css({ width: "100%", borderCollapse: "collapse" })}>
        <thead>
          <tr className={css({ borderBottom: `1px solid ${theme.colors.borderOpaque}` })}>
            {HEADERS.map((h) => (
              <th
                key={h}
                className={css({
                  padding: "10px 16px",
                  textAlign: "left",
                  backgroundColor: theme.colors.backgroundSecondary,
                })}
              >
                <LabelSmall color={theme.colors.contentSecondary}>{h}</LabelSmall>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onClick={() => handleRowClick(order.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
