"use client";

import { type Table, type Row } from "@tanstack/react-table";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ParagraphSmall } from "baseui/typography";
import { useStyletron } from "baseui";
import { BaseTable } from "@repo/ui";
import { Order } from "@/entities/order/model/types";

interface Props {
  table: Table<Order>;
  isFiltered: boolean;
}

export function OrderTable({ table, isFiltered }: Props) {
  const [, theme] = useStyletron();
  const t = useTranslations("Orders");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const handleRowClick = (row: Row<Order>) => {
    router.push(`/${locale}/orders/${row.original.id}`);
  };

  return (
    <BaseTable
      table={table}
      onRowClick={handleRowClick}
      rowsLabel="órdenes"
      emptyState={
        <ParagraphSmall $style={{ color: theme.colors.contentSecondary }}>
          {isFiltered ? t("emptyStateFiltered") : t("emptyState")}
        </ParagraphSmall>
      }
    />
  );
}
