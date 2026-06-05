import { create } from "zustand";
import { Order, MOCK_ACCOUNT_ID } from "./types";
import { MOCK_ORDERS } from "./mockData";

interface OrderStore {
  orders: Order[];
  addOrder: (data: Omit<Order, "id" | "created_at">) => Order;
  updateOrder: (id: string, patch: Partial<Order>) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: MOCK_ORDERS,

  addOrder: (data) => {
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      created_at: new Date().toISOString(),
      account_id: MOCK_ACCOUNT_ID,
    };
    set((state) => ({ orders: [...state.orders, newOrder] }));
    return newOrder;
  },

  updateOrder: (id, patch) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  },
}));
