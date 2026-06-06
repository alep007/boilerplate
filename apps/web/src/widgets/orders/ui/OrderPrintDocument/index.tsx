import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Order, PRODUCTION_STAGES } from "@/entities/order/model/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface OrderPrintDocumentProps {
  order: Order;
  priceMode: "with" | "without";
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BLUE   = "#0052ff";
const INK    = "#111111";
const GRAY   = "#666666";
const BORDER = "#d4d4d4";
const BG     = "#f8f8f8";
const WHITE  = "#ffffff";
const GREEN  = "#1a8a3c";
const RED    = "#c0392b";

const ACCOUNT_SUBTITLE = "ORDEN DE TRABAJO — HOJA DE TALLER";

const STAGE_LABELS: Record<string, string> = {
  received:  "Recibido",
  design:    "Diseño",
  plate:     "Placa",
  printing:  "Impresión",
  finishing: "Acabado",
  ready:     "Listo",
  delivered: "Entregado",
};

// ── Urgency badge ─────────────────────────────────────────────────────────────

function getPriorityLabel(deliveryDate: string): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const delivery = new Date(deliveryDate + "T00:00:00");
  const diff = Math.ceil((delivery.getTime() - today.getTime()) / 86400000);
  if (diff <= 0) return "URGENTE: HOY";
  if (diff === 1) return "URGENTE: MAÑANA";
  if (diff <= 3) return `URGENTE: ${diff} DIAS`;
  return null;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    padding: 28,
    paddingBottom: 24,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: INK,
    backgroundColor: WHITE,
  },

  // ── Header ──
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 7,
    color: GRAY,
    letterSpacing: 0.6,
    marginBottom: 7,
  },
  priorityBadge: {
    backgroundColor: INK,
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 2,
  },
  priorityText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    letterSpacing: 0.8,
  },
  headerRight: { alignItems: "flex-end" },
  orderNumberLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    letterSpacing: 1,
    marginBottom: 0,
  },
  orderNumber: {
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -1,
    lineHeight: 1,
  },

  // ── Divider ──
  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: INK,
    marginBottom: 12,
  },

  // ── Customer + Delivery ──
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  customerBlock: {
    flex: 1,
    paddingRight: 12,
  },
  deliveryBlock: {
    flex: 1,
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
    paddingLeft: 12,
  },
  blockLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
    lineHeight: 1.2,
  },
  customerSub: {
    fontSize: 9,
    color: GRAY,
  },
  deliveryDate: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: BLUE,
    marginBottom: 2,
  },
  deliverySub: {
    fontSize: 9,
    color: GRAY,
  },

  // ── Job description box ──
  jobBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: WHITE,
  },
  jobLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    letterSpacing: 1,
    marginBottom: 4,
  },
  jobDescription: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    lineHeight: 1.3,
  },
  specsCols: {
    flexDirection: "row",
  },
  specCol: { flex: 1 },
  specLabel: {
    fontSize: 8,
    color: GRAY,
    marginBottom: 3,
  },
  specValue: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
  },

  // ── Finishing + Notes row ──
  twoColRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  leftBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    padding: 8,
    marginRight: 8,
  },
  rightBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    padding: 8,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkbox: {
    width: 11,
    height: 11,
    borderWidth: 1.5,
    borderColor: GRAY,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  checkboxTicked: {
    borderColor: INK,
    backgroundColor: BG,
  },
  checkMark: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: INK,
    lineHeight: 1,
  },
  checkItemLabel: {
    fontSize: 9,
    color: INK,
  },
  notesText: {
    fontSize: 9,
    color: INK,
    lineHeight: 1.5,
  },

  // ── Instructions dashed box ──
  instructionsBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "dashed",
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    minHeight: 80,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  instructionsWarning: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginRight: 6,
    color: INK,
  },
  instructionsTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  instructionsText: {
    fontSize: 9,
    fontFamily: "Courier",
    lineHeight: 1.6,
    color: INK,
  },
  instructionsEmpty: {
    flex: 1,
  },
  dotLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    borderStyle: "dotted",
    marginTop: 20,
    marginBottom: 4,
  },

  // ── Production stages ──
  stagesSection: { marginBottom: 12 },
  stagesTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    letterSpacing: 0.8,
    textAlign: "center",
    marginBottom: 10,
  },
  stagesRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  stageItem: {
    alignItems: "center",
    width: 66,
  },
  stageBox: {
    width: 28,
    height: 28,
    borderWidth: 1.5,
    borderColor: "#aaaaaa",
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  stageBoxDone: {
    borderColor: INK,
    backgroundColor: BG,
  },
  stageCheckMark: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: INK,
    lineHeight: 1,
  },
  stageText: {
    fontSize: 7.5,
    textAlign: "center",
    color: INK,
    lineHeight: 1.3,
  },

  // ── Payment (priceMode === 'with') ──
  paymentBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    padding: 8,
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: BG,
  },
  paymentCol: { flex: 1, alignItems: "center" },
  paymentLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    letterSpacing: 1,
    marginBottom: 3,
  },
  paymentTotal: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: INK,
  },
  paymentPaid: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: GREEN,
  },
  paymentBalance: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: RED,
  },

  // ── Footer ──
  spacer: { flexGrow: 1 },
  footer: {
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerSignatureLabel: {
    fontSize: 8,
    color: GRAY,
    marginBottom: 14,
  },
  footerSignatureLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#888",
    width: 140,
  },
  footerVerified: {
    alignItems: "flex-end",
  },
  footerVerifiedBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: INK,
    backgroundColor: INK,
    marginBottom: 4,
    alignSelf: "flex-end",
  },
  footerVerifiedText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: GRAY,
    letterSpacing: 0.5,
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

export function OrderPrintDocument({ order, priceMode }: OrderPrintDocumentProps) {
  const entryDate = format(new Date(order.created_at), "dd MMM yyyy", { locale: es })
    .toUpperCase();
  const deliveryDateLong = format(
    new Date(order.delivery_date + "T00:00:00"),
    "dd MMM yyyy",
    { locale: es }
  ).toUpperCase();

  const currentIndex = PRODUCTION_STAGES.indexOf(order.production_status);
  const priority = getPriorityLabel(order.delivery_date);
  const orderCode = `#${String(order.order_number).padStart(5, "0")}`;
  const stagesCount = PRODUCTION_STAGES.length;

  // Finishing items
  const finishingItems: { label: string; checked: boolean }[] = [
    {
      label: order.finishing.numbered
        ? `Numerado ${order.finishing.numbered.from}–${order.finishing.numbered.to}`
        : "Numerado",
      checked: !!order.finishing.numbered,
    },
    {
      label: order.finishing.copies
        ? `Copias (${order.finishing.copies})`
        : "Copias",
      checked: !!order.finishing.copies,
    },
    { label: "Engomado",   checked: !!order.finishing.glued },
    { label: "Perforado",  checked: !!order.finishing.perforated },
  ];

  const balance =
    order.payment_status === "partial" && order.payment_advance != null
      ? order.price_total - order.payment_advance
      : null;

  // Right column: internal notes (hidden version) or product/colors info
  const rightColTitle = priceMode === "without" ? "NOTAS INTERNAS" : "DATOS DEL PRODUCTO";
  const rightColContent =
    priceMode === "without" && order.internal_notes
      ? order.internal_notes
      : [
          order.product_type && `Tipo: ${order.product_type}`,
          order.colors && `Tintas: ${order.colors}`,
        ]
          .filter(Boolean)
          .join("\n") || "—";

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            <Text style={s.headerTitle}>ORDEN DE TRABAJO</Text>
            <Text style={s.headerSubtitle}>{ACCOUNT_SUBTITLE}</Text>
            {priority && (
              <View style={s.priorityBadge}>
                <Text style={s.priorityText}>PRIORITY: {priority}</Text>
              </View>
            )}
          </View>
          <View style={s.headerRight}>
            <Text style={s.orderNumberLabel}>ORDER NUMBER</Text>
            <Text style={s.orderNumber}>{orderCode}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Customer + Delivery ── */}
        <View style={s.infoRow}>
          <View style={s.customerBlock}>
            <Text style={s.blockLabel}>CUSTOMER</Text>
            <Text style={s.customerName}>{order.customer_name}</Text>
            {order.customer_phone && (
              <Text style={s.customerSub}>Tel: {order.customer_phone}</Text>
            )}
            <Text style={s.customerSub}>Ingreso: {entryDate}</Text>
          </View>
          <View style={s.deliveryBlock}>
            <Text style={s.blockLabel}>DELIVERY DATE</Text>
            <Text style={s.deliveryDate}>{deliveryDateLong}</Text>
            <Text style={s.deliverySub}>Fecha de entrega acordada</Text>
          </View>
        </View>

        {/* ── Job Description ── */}
        <View style={s.jobBox}>
          <Text style={s.jobLabel}>JOB DESCRIPTION</Text>
          <Text style={s.jobDescription}>{order.description || "—"}</Text>
          <View style={s.specsCols}>
            <View style={s.specCol}>
              <Text style={s.specLabel}>Quantity</Text>
              <Text style={s.specValue}>
                {order.quantity ? `${order.quantity} Unidades` : "—"}
              </Text>
            </View>
            <View style={s.specCol}>
              <Text style={s.specLabel}>Material</Text>
              <Text style={s.specValue}>{order.material || "—"}</Text>
            </View>
            <View style={s.specCol}>
              <Text style={s.specLabel}>Format</Text>
              <Text style={s.specValue}>{order.size || "—"}</Text>
            </View>
          </View>
        </View>

        {/* ── Finishing + Notes ── */}
        <View style={s.twoColRow}>
          {/* Finishing checkboxes */}
          <View style={s.leftBox}>
            <Text style={s.blockLabel}>FINISHING</Text>
            {finishingItems.map((item) => (
              <View key={item.label} style={s.checkItem}>
                <View style={[s.checkbox, item.checked ? s.checkboxTicked : {}]}>
                  {item.checked && <Text style={s.checkMark}>✓</Text>}
                </View>
                <Text style={s.checkItemLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Right info column */}
          <View style={s.rightBox}>
            <Text style={s.blockLabel}>{rightColTitle}</Text>
            <Text style={s.notesText}>{rightColContent}</Text>
          </View>
        </View>

        {/* ── Operator Instructions ── */}
        <View style={s.instructionsBox}>
          <View style={s.instructionsHeader}>
            <Text style={s.instructionsWarning}>!</Text>
            <Text style={s.instructionsTitle}>INSTRUCCIONES PARA EL OPERARIO</Text>
          </View>
          {order.operator_notes ? (
            <Text style={s.instructionsText}>{order.operator_notes.toUpperCase()}</Text>
          ) : (
            <View style={s.instructionsEmpty}>
              <View style={s.dotLine} />
              <View style={s.dotLine} />
              <View style={s.dotLine} />
            </View>
          )}
        </View>

        {/* ── Production Stages ── */}
        <View style={s.stagesSection}>
          <Text style={s.stagesTitle}>
            {stagesCount} PRODUCTION STAGES CHECKLIST
          </Text>
          <View style={s.stagesRow}>
            {PRODUCTION_STAGES.map((stage, i) => {
              const isDone = i <= currentIndex;
              return (
                <View key={stage} style={s.stageItem}>
                  <View style={[s.stageBox, isDone ? s.stageBoxDone : {}]}>
                    {isDone && <Text style={s.stageCheckMark}>✓</Text>}
                  </View>
                  <Text style={s.stageText}>{STAGE_LABELS[stage]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Payment (only when priceMode = 'with') ── */}
        {priceMode === "with" && (
          <View style={s.paymentBox}>
            <View style={s.paymentCol}>
              <Text style={s.paymentLabel}>TOTAL</Text>
              <Text style={s.paymentTotal}>${order.price_total.toFixed(2)}</Text>
            </View>
            {order.payment_status === "partial" && order.payment_advance != null && (
              <>
                <View style={s.paymentCol}>
                  <Text style={s.paymentLabel}>ADELANTO</Text>
                  <Text style={s.paymentPaid}>${order.payment_advance.toFixed(2)}</Text>
                </View>
                {balance !== null && (
                  <View style={s.paymentCol}>
                    <Text style={s.paymentLabel}>SALDO</Text>
                    <Text style={s.paymentBalance}>${balance.toFixed(2)}</Text>
                  </View>
                )}
              </>
            )}
            {order.payment_status === "paid" && (
              <View style={s.paymentCol}>
                <Text style={s.paymentLabel}>ESTADO</Text>
                <Text style={s.paymentPaid}>PAGADO</Text>
              </View>
            )}
          </View>
        )}

        {/* push footer to bottom of page */}
        <View style={s.spacer} />

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View>
            <Text style={s.footerSignatureLabel}>Supervisor Signature</Text>
            <View style={s.footerSignatureLine} />
          </View>
          <View style={s.footerVerified}>
            {/* QR placeholder */}
            <View style={s.footerVerifiedBox}>
              <Text style={{ fontSize: 6, color: WHITE, textAlign: "center", marginTop: 6 }}>
                {orderCode}
              </Text>
            </View>
            <Text style={s.footerVerifiedText}>
              ORDEN {orderCode}
            </Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
