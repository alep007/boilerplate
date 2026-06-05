export type PaymentStatus = "paid" | "partial" | "pending";

export type ProductionStatus =
  | "received"
  | "design"
  | "plate"
  | "printing"
  | "finishing"
  | "ready"
  | "delivered";

export const PRODUCTION_STAGES: ProductionStatus[] = [
  "received",
  "design",
  "plate",
  "printing",
  "finishing",
  "ready",
  "delivered",
];

export interface OrderFinishing {
  numbered?: { from: number; to: number };
  copies?: number;
  glued?: boolean;
  perforated?: boolean;
}

export interface Order {
  id: string;
  order_number: number;
  account_id: string;
  created_at: string;
  delivery_date: string;
  production_status: ProductionStatus;
  customer_name: string;
  customer_phone?: string;
  product_type?: string;
  description: string;
  quantity?: number;
  size?: string;
  material?: string;
  colors?: string;
  finishing: OrderFinishing;
  operator_notes?: string;
  internal_notes?: string;
  price_total: number;
  payment_status: PaymentStatus;
  payment_advance?: number;
}

export const MOCK_ACCOUNT_ID = "mock-account-001";
