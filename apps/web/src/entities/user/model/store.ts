// apps/web/src/entities/user/model/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Definimos la estructura del usuario
export interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  profilePicture: string;
  mainColor: string;
  permissions: string[];
}

// 2. Definimos el estado global de la sesión
interface UserSessionState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  clearSession: () => void;
}

// 3. Creamos el Hook global de Zustand
export const useUserStore = create<UserSessionState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearSession: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "cl-session",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
