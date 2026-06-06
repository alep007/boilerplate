import { useMemo } from "react";
import { useOrderStore } from "../model/store";
import { Order } from "../model/types";

export type OrderFilter = "all" | "today" | "pending_payment" | "in_production";

// Domain/semantic filters — TanStack Table handles text search separately.
function applyFilter(orders: Order[], filter: OrderFilter): Order[] {
  const today = new Date().toISOString().split("T")[0] as string;
  switch (filter) {
    case "today":
      return orders.filter((o) => o.delivery_date === today);
    case "pending_payment":
      return orders.filter(
        (o) => o.payment_status === "partial" || o.payment_status === "pending"
      );
    case "in_production":
      return orders.filter((o) => o.production_status !== "delivered");
    default:
      return orders;
  }
}

export function useOrderList(filter: OrderFilter) {
  const orders = useOrderStore((state) => state.orders);
  const filtered = useMemo(() => applyFilter(orders, filter), [orders, filter]);
  return { orders: filtered, isLoading: false };
}
