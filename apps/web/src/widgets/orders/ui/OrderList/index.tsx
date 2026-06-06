"use client";

import { useState, useTransition, useMemo } from "react";
import { useStyletron } from "baseui";
import { HeadingLarge, LabelMedium } from "baseui/typography";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@repo/ui";
import { useOrderList, OrderFilter } from "@/entities/order/lib/useOrderList";
import { useTableControls } from "@/shared/lib/useTableControls";
import { OrderSearchInput } from "./OrderSearchInput";
import { OrderFilters } from "./OrderFilters";
import { OrderTable } from "./OrderTable";
import { getOrderColumns } from "./columns";

export function OrderList() {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [, startTransition] = useTransition();

  // Domain filter (Todas / Entrega hoy / Cobro pendiente / En producción)
  const [filter, setFilter] = useState<OrderFilter>("all");
  const { orders } = useOrderList(filter);

  // TanStack Table controls search, sorting, and pagination over the domain-filtered rows
  const columns = useMemo(() => getOrderColumns(t), [t]);
  const { table, globalFilter, setGlobalFilter } = useTableControls({
    data: orders,
    columns,
    initialPageSize: 10,
  });

  const isFiltered = filter !== "all" || globalFilter !== "";
  const totalVisible = table.getFilteredRowModel().rows.length;

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "24px" })}>
      {/* ── Header ── */}
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
            {totalVisible}
          </LabelMedium>
        </div>
        <Button onClick={() => router.push(`/${locale}/orders/new`)}>
          {t("newOrder")}
        </Button>
      </div>

      {/* ── Search + Filters ── */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        })}
      >
        <OrderSearchInput
          value={globalFilter}
          onChange={(val) => startTransition(() => setGlobalFilter(val))}
        />
        <OrderFilters active={filter} onChange={setFilter} />
      </div>

      {/* ── Table ── */}
      <OrderTable table={table} isFiltered={isFiltered} />
    </div>
  );
}
