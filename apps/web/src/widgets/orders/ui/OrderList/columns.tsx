"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useStyletron } from "baseui";
import { Badge } from "@repo/ui";
import { Order } from "@/entities/order/model/types";
import { useOrderStore } from "@/entities/order/model/store";
import { useRouter, usePathname } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return (
    "Bs " +
    new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2 }).format(amount)
  );
}

// ── Cell components ───────────────────────────────────────────────────────────
// Must be named components (not inline lambdas) because they use hooks.

function OrderNumberCell({ value }: { value: number }) {
  const [css, theme] = useStyletron();
  return (
    <span
      className={css({
        fontWeight: 700,
        fontSize: "14px",
        color: theme.colors.accent,
      })}
    >
      ORD-{String(value).padStart(4, "0")}
    </span>
  );
}

function TypeCell({ orderType }: { orderType?: "trabajo" | "entrega" | "cotizacion" }) {
  const type = orderType ?? "trabajo";
  const variant = type === "trabajo" ? "neutral" : "amber";
  const label = type === "trabajo" ? "Trabajo" : "Cotización";
  return <Badge label={label} variant={variant} />;
}

function ClientCell({
  name,
  phone,
  email,
}: {
  name: string;
  phone?: string;
  email?: string;
}) {
  const [css, theme] = useStyletron();
  const secondary = phone ?? email;
  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "2px" })}>
      <span
        className={css({
          fontWeight: 700,
          fontSize: "14px",
          color: theme.colors.contentPrimary,
        })}
      >
        {name}
      </span>
      {secondary && (
        <span
          className={css({
            fontSize: "12px",
            color: theme.colors.contentSecondary,
          })}
        >
          {secondary}
        </span>
      )}
    </div>
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

function DeliveriesCell({
  delivered,
  quantity,
}: {
  delivered?: number;
  quantity?: number;
}) {
  const [css, theme] = useStyletron();
  const d = delivered ?? 0;
  const q = quantity ?? 0;
  return (
    <span className={css({ color: theme.colors.contentSecondary, fontSize: "14px" })}>
      {d}/{q} entregados
    </span>
  );
}

function TotalCell({ amount }: { amount: number }) {
  const [css, theme] = useStyletron();
  return (
    <span
      className={css({
        color: theme.colors.contentPrimary,
        fontSize: "14px",
        fontWeight: 500,
      })}
    >
      {formatCurrency(amount)}
    </span>
  );
}

function BalanceCell({
  priceTotal,
  paymentAdvance,
}: {
  priceTotal: number;
  paymentAdvance?: number;
}) {
  const [css] = useStyletron();
  const balance = priceTotal - (paymentAdvance ?? 0);
  if (balance <= 0) {
    return (
      <span
        className={css({
          color: "#065F46",
          fontWeight: 600,
          fontSize: "14px",
        })}
      >
        Saldado
      </span>
    );
  }
  return (
    <span
      className={css({
        color: "#B45309",
        fontWeight: 600,
        fontSize: "14px",
      })}
    >
      {formatCurrency(balance)}
    </span>
  );
}

function StatusCell({
  deliveryDate,
  productionStatus,
  t,
}: {
  deliveryDate: string;
  productionStatus: string;
  t: (key: string) => string;
}) {
  const isDelivered = productionStatus === "delivered";
  const today = new Date().toISOString().slice(0, 10);
  const isPastDeadline = deliveryDate < today;

  if (isDelivered) {
    return <Badge label={t("statusFinished")} variant="green" />;
  }
  if (isPastDeadline) {
    return <Badge label={t("statusLate")} variant="red" />;
  }
  return <Badge label={t("statusActive")} variant="blue" />;
}

function ActionsCell({ orderId }: { orderId: string }) {
  const [css, theme] = useStyletron();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const deleteOrder = useOrderStore((s) => s.deleteOrder);

  const btnStyle = css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: theme.colors.contentSecondary,
    transition: "background 0.15s, color 0.15s",
    ":hover": {
      background: theme.colors.backgroundSecondary,
      color: theme.colors.contentPrimary,
    },
  });

  function handleEdit() {
    router.push(`/${locale}/orders/${orderId}`);
  }

  function handleDelete() {
    if (window.confirm("¿Eliminar esta orden?")) {
      deleteOrder(orderId);
    }
  }

  return (
    <div className={css({ display: "flex", alignItems: "center", gap: "4px" })}>
      <button className={btnStyle} onClick={handleEdit} title="Editar">
        <Pencil size={15} />
      </button>
      <button className={btnStyle} onClick={handleDelete} title="Eliminar">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// ── Column factory ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOrderColumns(t: (key: any) => string): ColumnDef<Order, unknown>[] {
  return [
    {
      id: "order_number",
      accessorKey: "order_number",
      header: "N° ORDEN",
      enableSorting: true,
      size: 110,
      cell: ({ row }) => <OrderNumberCell value={row.original.order_number} />,
    },
    {
      id: "order_type",
      accessorKey: "order_type",
      header: t("colType"),
      enableSorting: false,
      size: 110,
      cell: ({ row }) => <TypeCell orderType={row.original.order_type} />,
    },
    {
      id: "customer_name",
      accessorKey: "customer_name",
      header: t("colClient"),
      enableSorting: true,
      cell: ({ row }) => (
        <ClientCell
          name={row.original.customer_name}
          phone={row.original.customer_phone}
          email={row.original.customer_email}
        />
      ),
    },
    {
      id: "delivery_date",
      accessorKey: "delivery_date",
      header: t("colDate"),
      enableSorting: true,
      sortingFn: "alphanumeric",
      size: 110,
      cell: ({ row }) => <DateCell isoDate={row.original.delivery_date} />,
    },
    {
      id: "deliveries",
      accessorKey: "delivered_quantity",
      header: t("colDeliveries"),
      enableSorting: false,
      size: 130,
      cell: ({ row }) => (
        <DeliveriesCell
          delivered={row.original.delivered_quantity}
          quantity={row.original.quantity}
        />
      ),
    },
    {
      id: "price_total",
      accessorKey: "price_total",
      header: t("colTotal"),
      enableSorting: true,
      size: 120,
      cell: ({ row }) => <TotalCell amount={row.original.price_total} />,
    },
    {
      id: "balance",
      accessorKey: "payment_advance",
      header: t("colBalance"),
      enableSorting: false,
      size: 120,
      cell: ({ row }) => (
        <BalanceCell
          priceTotal={row.original.price_total}
          paymentAdvance={row.original.payment_advance}
        />
      ),
    },
    {
      id: "status",
      accessorKey: "production_status",
      header: t("colStatus"),
      enableSorting: false,
      size: 110,
      cell: ({ row }) => (
        <StatusCell
          deliveryDate={row.original.delivery_date}
          productionStatus={row.original.production_status}
          t={t}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      size: 80,
      cell: ({ row }) => <ActionsCell orderId={row.original.id} />,
    },
  ];
}
