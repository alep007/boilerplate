"use client";

import { useState, useTransition, useDeferredValue } from "react";
import { useStyletron } from "baseui";
import { HeadingLarge, LabelMedium } from "baseui/typography";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@repo/ui";
import { useOrderList, OrderFilter } from "@/entities/order/lib/useOrderList";
import { OrderSearchInput } from "./OrderSearchInput";
import { OrderFilters } from "./OrderFilters";
import { OrderTable } from "./OrderTable";

export function OrderList() {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const [filter, setFilter] = useState<OrderFilter>("all");
  const [search, setSearch] = useState("");
  const [, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const { orders } = useOrderList(filter, deferredSearch);

  const handleNewOrder = () => router.push(`/${locale}/orders/new`);

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "24px" })}>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        })}
      >
        <div className={css({ display: "flex", alignItems: "center", gap: "12px" })}>
          <HeadingLarge color={theme.colors.contentPrimary}>{t("title")}</HeadingLarge>
          <LabelMedium
            color={theme.colors.contentSecondary}
            $style={{
              backgroundColor: theme.colors.backgroundSecondary,
              padding: "2px 8px",
              borderRadius: "12px",
            }}
          >
            {orders.length}
          </LabelMedium>
        </div>
        <Button onClick={handleNewOrder}>{t("newOrder")}</Button>
      </div>

      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        })}
      >
        <OrderSearchInput
          value={search}
          onChange={(val) => startTransition(() => setSearch(val))}
        />
        <OrderFilters active={filter} onChange={setFilter} />
      </div>

      <OrderTable orders={orders} isFiltered={filter !== "all" || search !== ""} />
    </div>
  );
}
