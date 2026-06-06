"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useStyletron } from "baseui";
import { Badge } from "@repo/ui";
import { Order } from "@/entities/order/model/types";
import {
  PRODUCTION_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from "../shared/statusConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// ── Cell components ───────────────────────────────────────────────────────────
// Each needs useStyletron so they must be named components, not inline lambdas.

function OrderNumberCell({ value }: { value: number }) {
  const [css, theme] = useStyletron();
  return (
    <span
      className={css({
        fontFamily: "var(--font-mono), monospace",
        fontWeight: 600,
        fontSize: "14px",
        color: theme.colors.contentPrimary,
      })}
    >
      #{String(value).padStart(3, "0")}
    </span>
  );
}

function ClientCell({ name }: { name: string }) {
  const [css, theme] = useStyletron();
  return (
    <span className={css({ color: theme.colors.contentPrimary, fontWeight: 500 })}>
      {name}
    </span>
  );
}

function TruncatedCell({ value }: { value: string }) {
  const [css, theme] = useStyletron();
  return (
    <span
      className={css({
        display: "block",
        maxWidth: "280px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: theme.colors.contentSecondary,
        fontSize: "14px",
      })}
    >
      {value}
    </span>
  );
}

function DateCell({ isoDate }: { isoDate: string }) {
  const [css, theme] = useStyletron();
  const formatted = format(new Date(isoDate + "T00:00:00"), "dd/MM/yyyy", {
    locale: es,
  });
  return (
    <span className={css({ color: theme.colors.contentSecondary, fontSize: "14px" })}>
      {formatted}
    </span>
  );
}

// ── Column factory ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOrderColumns(t: (key: any) => string): ColumnDef<Order, unknown>[] {
  return [
    {
      id: "order_number",
      accessorKey: "order_number",
      header: t("colNumber"),
      enableSorting: true,
      size: 80,
      cell: ({ row }) => (
        <OrderNumberCell value={row.original.order_number} />
      ),
    },
    {
      id: "customer_name",
      accessorKey: "customer_name",
      header: t("colClient"),
      enableSorting: true,
      cell: ({ row }) => <ClientCell name={row.original.customer_name} />,
    },
    {
      id: "description",
      accessorKey: "description",
      header: t("colWork"),
      enableSorting: false,
      cell: ({ getValue }) => (
        <TruncatedCell value={getValue() as string} />
      ),
    },
    {
      id: "delivery_date",
      accessorKey: "delivery_date",
      header: t("colDelivery"),
      enableSorting: true,
      sortingFn: "alphanumeric", // ISO strings sort correctly as strings
      cell: ({ row }) => <DateCell isoDate={row.original.delivery_date} />,
    },
    {
      id: "production_status",
      accessorKey: "production_status",
      header: t("colStatus"),
      enableSorting: false,
      cell: ({ row }) => {
        const cfg = PRODUCTION_STATUS_CONFIG[row.original.production_status];
        return <Badge label={t(cfg.labelKey)} variant={cfg.variant} />;
      },
    },
    {
      id: "payment_status",
      accessorKey: "payment_status",
      header: t("colPayment"),
      enableSorting: false,
      cell: ({ row }) => {
        const cfg = PAYMENT_STATUS_CONFIG[row.original.payment_status];
        return <Badge label={t(cfg.labelKey)} variant={cfg.variant} />;
      },
    },
  ];
}
