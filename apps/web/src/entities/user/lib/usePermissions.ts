// apps/web/src/entities/user/lib/usePermissions.ts
import { useUserStore } from "../model/store";

export const usePermissions = () => {
  // Extraemos solo el array de permisos para evitar re-renderizados innecesarios

  const userPermissions =
    useUserStore((state) => state.user?.permissions) || [];

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  /**
   * Verifica si el usuario tiene AL MENOS UNO de los permisos requeridos
   */
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some((perm) => userPermissions.includes(perm));
  };

  /**
   * Verifica si el usuario tiene TODOS los permisos requeridos
   */
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every((perm) => userPermissions.includes(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
