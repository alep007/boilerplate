// apps/web/src/shared/config/navigation.ts
import { LayoutDashboard, Users, ShieldAlert } from "lucide-react"; // O los iconos de tu preferencia

export type NavItem = {
  id: string;
  path: string;
  labelKey: string; // La llave de next-intl (ej. 'Navigation.dashboard')
  icon: React.ElementType;
  requiredPermission: string; // El permiso RBAC necesario para verlo
};

export const NAVIGATION_CONFIG: NavItem[] = [
  {
    id: "dashboard",
    path: "/dashboard",
    labelKey: "dashboard",
    icon: LayoutDashboard,
    requiredPermission: "viewDashboardModule",
  },
  {
    id: "users",
    path: "/users",
    labelKey: "users",
    icon: Users,
    requiredPermission: "viewUsersModule",
  },
  {
    id: "permissions",
    path: "/permissions",
    labelKey: "permissions",
    icon: ShieldAlert,
    requiredPermission: "viewPermissionsModule",
  },
];
