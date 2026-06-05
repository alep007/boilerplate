import { BadgeVariant } from "@repo/ui";
import { ProductionStatus, PaymentStatus } from "@/entities/order/model/types";

export const PRODUCTION_STATUS_CONFIG: Record<
  ProductionStatus,
  { labelKey: string; variant: BadgeVariant }
> = {
  received:  { labelKey: "statusReceived",  variant: "neutral" },
  design:    { labelKey: "statusDesign",    variant: "blue"    },
  plate:     { labelKey: "statusPlate",     variant: "amber"   },
  printing:  { labelKey: "statusPrinting",  variant: "purple"  },
  finishing: { labelKey: "statusFinishing", variant: "amber"   },
  ready:     { labelKey: "statusReady",     variant: "green"   },
  delivered: { labelKey: "statusDelivered", variant: "teal"    },
};

export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  { labelKey: string; variant: BadgeVariant }
> = {
  paid:    { labelKey: "paymentPaid",    variant: "green" },
  partial: { labelKey: "paymentPartial", variant: "amber" },
  pending: { labelKey: "paymentPending", variant: "red"   },
};
