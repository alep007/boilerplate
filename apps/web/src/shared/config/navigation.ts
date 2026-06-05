import { LayoutDashboard, Users, ShieldAlert, ClipboardList } from "lucide-react";
import React from "react";

export type NavItem = {
  id: string;
  path: string;
  labelKey: string;
  icon: React.ElementType;
  requiredPermission: string;
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
    id: "orders",
    path: "/orders",
    labelKey: "orders",
    icon: ClipboardList,
    requiredPermission: "viewOrdersModule",
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
