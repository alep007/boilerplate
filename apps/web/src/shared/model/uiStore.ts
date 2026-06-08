// apps/web/src/shared/model/uiStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarExpanded: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
      isMobileMenuOpen: false,
      openMobileMenu: () => set({ isMobileMenuOpen: true }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    }),
    {
      name: "cl-ui",
      partialize: (state) => ({ isSidebarExpanded: state.isSidebarExpanded }),
    }
  )
);
