import { User, FileText, Scissors, Wrench, CreditCard } from "lucide-react";
import type { ResolveSchemaOptions } from "@repo/forms";

export const ORDER_SCHEMA_OPTIONS: ResolveSchemaOptions = {
  iconMap: {
    User,
    FileText,
    Scissors,
    Wrench,
    CreditCard,
  },

  dateRefs: {
    $today: () => new Date(),
  },

  customValidators: {
    "delivery-date": (message) => (value) => {
      if (!value) return undefined;
      const today = new Date().toISOString().split("T")[0] as string;
      return (value as string) < today ? message : undefined;
    },

    "price-positive": (message) => (value) => {
      const n = parseFloat(value as string);
      return !value || isNaN(n) || n <= 0 ? message : undefined;
    },

    "payment-advance": (message) => (value, allValues) => {
      const vals = allValues as Record<string, unknown>;
      if (vals.payment_status !== "partial") return undefined;
      const advance = parseFloat(value as string);
      const total = parseFloat(vals.price_total as string);
      if (!value || isNaN(advance) || advance <= 0 || advance >= total) return message;
      return undefined;
    },
  },
};
