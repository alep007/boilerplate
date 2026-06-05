import { useMemo } from "react";
import { useOrderStore } from "../model/store";
import { Order } from "../model/types";

export type OrderFilter = "all" | "today" | "pending_payment" | "in_production";

function applyFilter(orders: Order[], filter: OrderFilter): Order[] {
  const today = new Date().toISOString().split("T")[0];
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

function applySearch(orders: Order[], search: string): Order[] {
  if (!search.trim()) return orders;
  const q = search.toLowerCase();
  return orders.filter(
    (o) =>
      o.customer_name.toLowerCase().includes(q) ||
      String(o.order_number).includes(q)
  );
}

export function useOrderList(filter: OrderFilter, search: string) {
  const orders = useOrderStore((state) => state.orders);

  const filtered = useMemo(() => {
    const byFilter = applyFilter(orders, filter);
    return applySearch(byFilter, search);
  }, [orders, filter, search]);

  return { orders: filtered, isLoading: false };
}
