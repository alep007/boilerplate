"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
} from "react";
import { useStyletron } from "baseui";
import { Order, OrderItem } from "@/entities/order/model/types";

// ── Public types ──────────────────────────────────────────────────────────────

export interface OrderFormValues {
  order_type: "trabajo" | "entrega" | "cotizacion";
  order_date: string;
  customer_name: string;
  customer_phone: string;
  payment_status: "paid" | "partial" | "pending";
  items: Array<{
    id: string;
    detail: string;
    description: string;
    quantity: number;
    price_unit: number;
    delivery_date: string;
  }>;
  payment_advance: number;
}

export interface OrderFormHandle {
  getValues: () => OrderFormValues;
  validate: () => Promise<boolean>;
}

interface OrderFormProps {
  initialValues?: Partial<Order>;
  isNew: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBs(amount: number): string {
  return (
    "Bs " +
    new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2 }).format(amount)
  );
}

function todayString(): string {
  return new Date().toISOString().split("T")[0] ?? "";
}

function mapInitialItems(
  order: Partial<Order>
): OrderFormValues["items"] {
  if (order.items && order.items.length > 0) {
    return order.items.map((item: OrderItem) => ({
      id: item.id,
      detail: item.detail,
      description: item.description ?? "",
      quantity: item.quantity,
      price_unit: item.price_unit,
      delivery_date: item.delivery_date ?? order.order_date ?? order.delivery_date ?? todayString(),
    }));
  }
  return [];
}

// ── OrderForm ─────────────────────────────────────────────────────────────────

export const OrderForm = forwardRef<OrderFormHandle, OrderFormProps>(
  function OrderForm({ initialValues, onDirtyChange }, ref) {
    const [css, theme] = useStyletron();

    const white = (theme.colors as Record<string, string>).mono100 ?? "#ffffff";
    const today = todayString();

    // ── Form state ──
    const [orderType, setOrderType] = useState<OrderFormValues["order_type"]>(
      (initialValues?.order_type as OrderFormValues["order_type"]) ?? "trabajo"
    );
    const [orderDate, setOrderDate] = useState(
      initialValues?.order_date ?? initialValues?.delivery_date ?? today
    );
    const [customerName, setCustomerName] = useState(
      initialValues?.customer_name ?? ""
    );
    const [customerPhone, setCustomerPhone] = useState(
      initialValues?.customer_phone ?? ""
    );
    const [paymentStatus, setPaymentStatus] = useState<
      OrderFormValues["payment_status"]
    >((initialValues?.payment_status as OrderFormValues["payment_status"]) ?? "pending");
    const [items, setItems] = useState<OrderFormValues["items"]>(
      initialValues ? mapInitialItems(initialValues) : []
    );
    const [paymentAdvance, setPaymentAdvance] = useState(
      initialValues?.payment_advance ?? 0
    );
    const [errors, setErrors] = useState<{ customer_name?: string }>({});

    // ── Dirty tracking ──
    const markDirty = useCallback(() => {
      onDirtyChange?.(true);
    }, [onDirtyChange]);

    // ── Computed totals ──
    const totalFromItems = items.reduce(
      (sum, item) => sum + item.quantity * item.price_unit,
      0
    );
    const balance = totalFromItems - paymentAdvance;

    // ── Imperative handle ──
    useImperativeHandle(ref, () => ({
      getValues: (): OrderFormValues => ({
        order_type: orderType,
        order_date: orderDate,
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_status: paymentStatus,
        items,
        payment_advance: paymentAdvance,
      }),
      validate: async (): Promise<boolean> => {
        const newErrors: { customer_name?: string } = {};
        if (!customerName.trim()) {
          newErrors.customer_name = "El nombre del cliente es requerido";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      },
    }));

    // ── Item helpers ──
    const addItem = () => {
      setItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          detail: "",
          description: "",
          quantity: 1,
          price_unit: 0,
          delivery_date: orderDate,
        },
      ]);
      markDirty();
    };

    const removeItem = (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      markDirty();
    };

    const updateItem = (
      id: string,
      field: keyof OrderFormValues["items"][number],
      value: string | number
    ) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );
      markDirty();
    };

    // ── Shared input style ──
    const inputStyle = css({
      width: "100%",
      padding: "9px 12px",
      fontSize: "14px",
      fontFamily: "var(--font-inter), sans-serif",
      color: theme.colors.contentPrimary,
      backgroundColor: theme.colors.backgroundSecondary,
      border: `1px solid ${theme.colors.borderOpaque}`,
      borderRadius: "8px",
      outline: "none",
      boxSizing: "border-box",
      ":focus": {
        borderColor: theme.colors.buttonPrimaryFill,
        backgroundColor: white,
      },
    });

    const labelStyle = css({
      fontSize: "12px",
      fontWeight: "600",
      color: theme.colors.contentSecondary,
      fontFamily: "var(--font-inter), sans-serif",
      marginBottom: "6px",
      display: "block",
      letterSpacing: "0.03em",
    });

    const cardStyle = css({
      backgroundColor: white,
      border: `1px solid ${theme.colors.borderOpaque}`,
      borderRadius: "12px",
      padding: "24px",
    });

    const ORDER_TYPES: Array<{
      value: OrderFormValues["order_type"];
      label: string;
    }> = [
      { value: "trabajo", label: "Orden de trabajo" },
      { value: "entrega", label: "Orden de entrega" },
      { value: "cotizacion", label: "Cotización" },
    ];

    const PAYMENT_STATUSES: Array<{
      value: OrderFormValues["payment_status"];
      label: string;
    }> = [
      { value: "pending", label: "Nuevo" },
      { value: "partial", label: "Parcial" },
      { value: "paid", label: "Pagado" },
    ];

    const TABLE_COLS = ["CANT.", "DETALLE / DESCRIPCIÓN", "P/U (BS)", "TOTAL", "F. ENTREGA", ""];
    const COL_WIDTHS = ["72px", "1fr", "110px", "110px", "140px", "40px"];

    return (
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        })}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            Card 1 — Información general
        ════════════════════════════════════════════════════════════════════ */}
        <div className={cardStyle}>
          <h3
            className={css({
              fontSize: "16px",
              fontWeight: "700",
              color: theme.colors.contentPrimary,
              fontFamily: "var(--font-inter), sans-serif",
              margin: "0 0 20px 0",
            })}
          >
            Información general
          </h3>

          {/* Row 1: Order type toggle + Order date */}
          <div
            className={css({
              display: "flex",
              alignItems: "flex-start",
              gap: "24px",
              marginBottom: "20px",
              flexWrap: "wrap",
            })}
          >
            {/* Order type toggle */}
            <div className={css({ flex: "1 1 300px" })}>
              <label className={labelStyle}>Tipo de orden</label>
              <div
                className={css({
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                })}
              >
                {ORDER_TYPES.map(({ value, label }) => {
                  const isSelected = orderType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setOrderType(value);
                        markDirty();
                      }}
                      className={css({
                        padding: "8px 16px",
                        fontSize: "13px",
                        fontWeight: isSelected ? "600" : "500",
                        fontFamily: "var(--font-inter), sans-serif",
                        borderRadius: "20px",
                        border: isSelected
                          ? `2px solid ${theme.colors.buttonPrimaryFill}`
                          : `2px solid ${theme.colors.borderOpaque}`,
                        backgroundColor: isSelected
                          ? theme.colors.buttonPrimaryFill
                          : "transparent",
                        color: isSelected ? "#ffffff" : theme.colors.contentSecondary,
                        cursor: "pointer",
                        transition: "all 150ms",
                        whiteSpace: "nowrap",
                        ":hover": {
                          borderColor: theme.colors.buttonPrimaryFill,
                          color: isSelected ? "#ffffff" : theme.colors.buttonPrimaryFill,
                        },
                      })}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order date */}
            <div className={css({ flex: "0 0 200px" })}>
              <label className={labelStyle}>Fecha de orden</label>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => {
                  setOrderDate(e.target.value);
                  markDirty();
                }}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Row 2: Customer + Phone + Payment status */}
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "2fr 1.5fr 1fr",
              gap: "16px",
              "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
              },
            })}
          >
            {/* Customer name */}
            <div>
              <label className={labelStyle}>
                Cliente <span style={{ color: theme.colors.contentNegative }}>*</span>
              </label>
              <input
                type="text"
                value={customerName}
                placeholder="Nombre del cliente"
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customer_name) setErrors({});
                  markDirty();
                }}
                className={css({
                  width: "100%",
                  padding: "9px 12px",
                  fontSize: "14px",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: theme.colors.contentPrimary,
                  backgroundColor: theme.colors.backgroundSecondary,
                  border: `1px solid ${errors.customer_name ? theme.colors.contentNegative : theme.colors.borderOpaque}`,
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing: "border-box",
                  ":focus": {
                    borderColor: theme.colors.buttonPrimaryFill,
                    backgroundColor: white,
                  },
                })}
              />
              {errors.customer_name && (
                <span
                  className={css({
                    fontSize: "12px",
                    color: theme.colors.contentNegative,
                    fontFamily: "var(--font-inter), sans-serif",
                    marginTop: "4px",
                    display: "block",
                  })}
                >
                  {errors.customer_name}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelStyle}>Teléfono / Cel.</label>
              <input
                type="text"
                value={customerPhone}
                placeholder="Ej. 69043783"
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  markDirty();
                }}
                className={inputStyle}
              />
            </div>

            {/* Payment status */}
            <div>
              <label className={labelStyle}>Estado de pago</label>
              <select
                value={paymentStatus}
                onChange={(e) => {
                  setPaymentStatus(e.target.value as OrderFormValues["payment_status"]);
                  markDirty();
                }}
                className={css({
                  width: "100%",
                  padding: "9px 12px",
                  fontSize: "14px",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: theme.colors.contentPrimary,
                  backgroundColor: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.borderOpaque}`,
                  borderRadius: "8px",
                  outline: "none",
                  boxSizing: "border-box",
                  cursor: "pointer",
                  appearance: "auto",
                  ":focus": {
                    borderColor: theme.colors.buttonPrimaryFill,
                    backgroundColor: white,
                  },
                })}
              >
                {PAYMENT_STATUSES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            Card 2 — Ítems del pedido
        ════════════════════════════════════════════════════════════════════ */}
        <div className={cardStyle}>
          {/* Header */}
          <div className={css({ marginBottom: "20px" })}>
            <h3
              className={css({
                fontSize: "16px",
                fontWeight: "700",
                color: theme.colors.contentPrimary,
                fontFamily: "var(--font-inter), sans-serif",
                margin: "0 0 4px 0",
              })}
            >
              Ítems del pedido
            </h3>
            <p
              className={css({
                fontSize: "13px",
                color: theme.colors.contentSecondary,
                fontFamily: "var(--font-inter), sans-serif",
                margin: "0",
              })}
            >
              La fecha de entrega por ítem toma la fecha de orden por defecto
            </p>
          </div>

          {/* Table header */}
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: COL_WIDTHS.join(" "),
              gap: "8px",
              padding: "8px 0",
              borderBottom: `1px solid ${theme.colors.borderOpaque}`,
              marginBottom: "8px",
              "@media (max-width: 900px)": { display: "none" },
            })}
          >
            {TABLE_COLS.map((col, i) => (
              <span
                key={i}
                className={css({
                  fontSize: "11px",
                  fontWeight: "600",
                  color: theme.colors.contentSecondary,
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textAlign: i >= 2 && i <= 3 ? "right" : "left",
                })}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Items list */}
          {items.length === 0 ? (
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
                color: theme.colors.contentSecondary,
                gap: "12px",
              })}
            >
              {/* List icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span
                className={css({
                  fontSize: "14px",
                  fontFamily: "var(--font-inter), sans-serif",
                })}
              >
                Sin ítems aún. Agrega el primero.
              </span>
            </div>
          ) : (
            <div className={css({ display: "flex", flexDirection: "column", gap: "8px" })}>
              {items.map((item) => {
                const itemTotal = item.quantity * item.price_unit;
                return (
                  <div
                    key={item.id}
                    className={css({
                      display: "grid",
                      gridTemplateColumns: COL_WIDTHS.join(" "),
                      gap: "8px",
                      alignItems: "start",
                      padding: "10px 0",
                      borderBottom: `1px solid ${theme.colors.borderOpaque}`,
                      "@media (max-width: 900px)": {
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                      },
                    })}
                  >
                    {/* CANT */}
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className={css({
                        width: "100%",
                        padding: "8px 8px",
                        fontSize: "14px",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: theme.colors.contentPrimary,
                        backgroundColor: theme.colors.backgroundSecondary,
                        border: `1px solid ${theme.colors.borderOpaque}`,
                        borderRadius: "8px",
                        outline: "none",
                        boxSizing: "border-box",
                        textAlign: "center",
                        ":focus": {
                          borderColor: theme.colors.buttonPrimaryFill,
                          backgroundColor: white,
                        },
                      })}
                    />

                    {/* DETALLE / DESCRIPCIÓN */}
                    <div className={css({ display: "flex", flexDirection: "column", gap: "4px" })}>
                      <input
                        type="text"
                        value={item.detail}
                        placeholder="Detalle del ítem..."
                        onChange={(e) => updateItem(item.id, "detail", e.target.value)}
                        className={inputStyle}
                      />
                      <input
                        type="text"
                        value={item.description}
                        placeholder="Descripción opcional..."
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className={css({
                          width: "100%",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontStyle: "italic",
                          fontFamily: "var(--font-inter), sans-serif",
                          color: theme.colors.contentSecondary,
                          backgroundColor: "transparent",
                          border: `1px solid ${theme.colors.borderTransparent ?? "transparent"}`,
                          borderRadius: "8px",
                          outline: "none",
                          boxSizing: "border-box",
                          ":focus": {
                            borderColor: theme.colors.borderOpaque,
                            backgroundColor: theme.colors.backgroundSecondary,
                          },
                          "::placeholder": {
                            color: theme.colors.contentDisabled ?? theme.colors.contentSecondary,
                          },
                        })}
                      />
                    </div>

                    {/* P/U */}
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.price_unit}
                      placeholder="0.00"
                      onChange={(e) =>
                        updateItem(item.id, "price_unit", parseFloat(e.target.value) || 0)
                      }
                      className={css({
                        width: "100%",
                        padding: "8px 8px",
                        fontSize: "14px",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: theme.colors.contentPrimary,
                        backgroundColor: theme.colors.backgroundSecondary,
                        border: `1px solid ${theme.colors.borderOpaque}`,
                        borderRadius: "8px",
                        outline: "none",
                        boxSizing: "border-box",
                        textAlign: "right",
                        ":focus": {
                          borderColor: theme.colors.buttonPrimaryFill,
                          backgroundColor: white,
                        },
                      })}
                    />

                    {/* TOTAL */}
                    <div
                      className={css({
                        padding: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: theme.colors.contentPrimary,
                        textAlign: "right",
                        paddingTop: "10px",
                      })}
                    >
                      {formatBs(itemTotal)}
                    </div>

                    {/* F. ENTREGA */}
                    <input
                      type="date"
                      value={item.delivery_date}
                      onChange={(e) => updateItem(item.id, "delivery_date", e.target.value)}
                      className={css({
                        width: "100%",
                        padding: "8px 8px",
                        fontSize: "13px",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: theme.colors.contentPrimary,
                        backgroundColor: theme.colors.backgroundSecondary,
                        border: `1px solid ${theme.colors.borderOpaque}`,
                        borderRadius: "8px",
                        outline: "none",
                        boxSizing: "border-box",
                        ":focus": {
                          borderColor: theme.colors.buttonPrimaryFill,
                          backgroundColor: white,
                        },
                      })}
                    />

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className={css({
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "transparent",
                        color: theme.colors.contentSecondary,
                        cursor: "pointer",
                        fontSize: "18px",
                        lineHeight: "1",
                        ":hover": {
                          backgroundColor: theme.colors.backgroundNegative ?? "#FEF2F2",
                          color: theme.colors.contentNegative,
                        },
                      })}
                      title="Eliminar ítem"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer: Add item button */}
          <div className={css({ marginTop: "16px" })}>
            <button
              type="button"
              onClick={addItem}
              className={css({
                background: "none",
                border: "none",
                padding: "8px 0",
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "var(--font-inter), sans-serif",
                color: theme.colors.buttonPrimaryFill,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                ":hover": {
                  opacity: "0.8",
                },
              })}
            >
              + Agregar ítem
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            Card 3 — Resumen de pago
        ════════════════════════════════════════════════════════════════════ */}
        <div className={cardStyle}>
          <h3
            className={css({
              fontSize: "16px",
              fontWeight: "700",
              color: theme.colors.contentPrimary,
              fontFamily: "var(--font-inter), sans-serif",
              margin: "0 0 20px 0",
            })}
          >
            Resumen de pago
          </h3>

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              "@media (max-width: 600px)": {
                gridTemplateColumns: "1fr",
              },
            })}
          >
            {/* Box 1: Total */}
            <div
              className={css({
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              })}
            >
              <span
                className={css({
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: theme.colors.contentSecondary,
                  fontFamily: "var(--font-inter), sans-serif",
                })}
              >
                TOTAL
              </span>
              <span
                className={css({
                  fontSize: "20px",
                  fontWeight: "700",
                  color: theme.colors.contentPrimary,
                  fontFamily: "var(--font-inter), sans-serif",
                })}
              >
                {formatBs(totalFromItems)}
              </span>
            </div>

            {/* Box 2: A cuenta (anticipo) */}
            <div
              className={css({
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              })}
            >
              <span
                className={css({
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: theme.colors.contentSecondary,
                  fontFamily: "var(--font-inter), sans-serif",
                })}
              >
                A CUENTA (ANTICIPO)
              </span>
              <div className={css({ display: "flex", alignItems: "center", gap: "6px" })}>
                <span
                  className={css({
                    fontSize: "14px",
                    fontWeight: "600",
                    color: theme.colors.contentSecondary,
                    fontFamily: "var(--font-inter), sans-serif",
                    whiteSpace: "nowrap",
                  })}
                >
                  Bs
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={paymentAdvance}
                  onChange={(e) => {
                    setPaymentAdvance(parseFloat(e.target.value) || 0);
                    markDirty();
                  }}
                  className={css({
                    flex: 1,
                    width: "100%",
                    padding: "4px 8px",
                    fontSize: "18px",
                    fontWeight: "700",
                    fontFamily: "var(--font-inter), sans-serif",
                    color: theme.colors.contentPrimary,
                    backgroundColor: "transparent",
                    border: `1px solid ${theme.colors.borderOpaque}`,
                    borderRadius: "6px",
                    outline: "none",
                    boxSizing: "border-box",
                    ":focus": {
                      borderColor: theme.colors.buttonPrimaryFill,
                      backgroundColor: white,
                    },
                  })}
                />
              </div>
            </div>

            {/* Box 3: Saldo pendiente */}
            <div
              className={css({
                backgroundColor: "#EFF6FF",
                borderRadius: "10px",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              })}
            >
              <span
                className={css({
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#3B82F6",
                  fontFamily: "var(--font-inter), sans-serif",
                })}
              >
                SALDO PENDIENTE
              </span>
              <span
                className={css({
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1D4ED8",
                  fontFamily: "var(--font-inter), sans-serif",
                })}
              >
                {formatBs(Math.max(0, balance))}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
