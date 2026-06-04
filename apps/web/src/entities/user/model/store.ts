// apps/web/src/entities/user/model/store.ts
import { create } from "zustand";

// 1. Definimos la estructura del usuario
export interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  profilePicture: string;
  mainColor: string; // Tu color personalizado devuelto por el backend
}

// 2. Definimos el estado global de la sesión
interface UserSessionState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  clearSession: () => void;
}

// 3. Creamos el Hook global de Zustand
export const useUserStore = create<UserSessionState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Acción para establecer el usuario tras el login
  setUser: (user) => set({ user, isAuthenticated: true }),

  // Acción para limpiar el estado al cerrar sesión
  clearSession: () => set({ user: null, isAuthenticated: false }),
}));
