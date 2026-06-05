import { useOrderStore } from "../model/store";

export function useNextOrderNumber() {
  const orders = useOrderStore((state) => state.orders);
  const nextNumber =
    orders.length === 0
      ? 1
      : Math.max(...orders.map((o) => o.order_number)) + 1;
  return { nextNumber, isLoading: false, error: false };
}
