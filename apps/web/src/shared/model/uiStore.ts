// apps/web/src/shared/model/uiStore.ts
import { create } from "zustand";

interface UIState {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarExpanded: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));
