import { useOrderStore } from "../model/store";
import { Order, PRODUCTION_STAGES, ProductionStatus } from "../model/types";

export function useOrder(id: string | "new") {
  const orders = useOrderStore((state) => state.orders);
  const addOrder = useOrderStore((state) => state.addOrder);
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const order = id === "new" ? null : (orders.find((o) => o.id === id) ?? null);

  const save = async (
    data: Partial<Order>
  ): Promise<{ success: boolean; id: string }> => {
    try {
      if (id === "new") {
        const created = addOrder(data as Omit<Order, "id" | "created_at">);
        return { success: true, id: created.id };
      } else {
        updateOrder(id, data);
        return { success: true, id };
      }
    } catch {
      return { success: false, id: id === "new" ? "" : id };
    }
  };

  const advanceStatus = async (): Promise<void> => {
    if (!order) return;
    const currentIndex = PRODUCTION_STAGES.indexOf(order.production_status);
    if (currentIndex === PRODUCTION_STAGES.length - 1) return;
    const next = PRODUCTION_STAGES[currentIndex + 1] as ProductionStatus;
    // Optimistic update
    updateOrder(order.id, { production_status: next });
  };

  return { order, isLoading: false, save, advanceStatus };
}
