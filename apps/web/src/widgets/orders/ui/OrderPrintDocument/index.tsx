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

const ACCOUNT_NAME = "Imprenta Demo";

const STAGE_LABELS: Record<string, string> = {
  received:  "Recibido",
  design:    "Diseño",
  plate:     "Placa",
  printing:  "Impresión",
  finishing: "Acabado",
  ready:     "Listo",
  delivered: "Entregado",
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  orderNumber: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#111",
  },
  accountName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  dates: {
    fontSize: 9,
    color: "#555",
    marginTop: 4,
  },
  section: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#555",
    width: 80,
  },
  value: {
    fontSize: 9,
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  stagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  stage: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  stageBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#fff",
    marginRight: 3,
  },
  stageBoxChecked: {
    backgroundColor: "#333",
  },
  stageLabel: {
    fontSize: 8,
  },
  paymentBlock: {
    flexDirection: "row",
  },
  paymentItem: {
    flexDirection: "column",
    marginRight: 16,
  },
  paymentLabel: {
    fontSize: 8,
    color: "#555",
    fontFamily: "Helvetica-Bold",
  },
  paymentValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  instructionsBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    padding: 8,
    minHeight: 40,
    marginTop: 2,
  },
});

export function OrderPrintDocument({ order, priceMode }: OrderPrintDocumentProps) {
  const entryDate = format(new Date(order.created_at), "dd/MM/yyyy", { locale: es });
  const deliveryDate = format(
    new Date(order.delivery_date + "T00:00:00"),
    "dd/MM/yyyy",
    { locale: es }
  );

  const currentStageIndex = PRODUCTION_STAGES.indexOf(order.production_status);

  const finishingParts: string[] = [];
  if (order.finishing.numbered) {
    finishingParts.push(
      `Numerado ${order.finishing.numbered.from}–${order.finishing.numbered.to}`
    );
  }
  if (order.finishing.copies) finishingParts.push(`${order.finishing.copies} copias`);
  if (order.finishing.glued) finishingParts.push("Engomado");
  if (order.finishing.perforated) finishingParts.push("Perforado");

  const balance =
    order.payment_status === "partial" && order.payment_advance != null
      ? order.price_total - order.payment_advance
      : null;

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.orderNumber}>
              #{String(order.order_number).padStart(3, "0")}
            </Text>
            <Text style={styles.accountName}>{ACCOUNT_NAME}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.dates}>Ingreso: {entryDate}</Text>
            <Text style={styles.dates}>Entrega: {deliveryDate}</Text>
          </View>
        </View>

        {/* Client */}
        <View style={styles.section}>
          <Text style={styles.customerName}>{order.customer_name}</Text>
          {order.customer_phone && (
            <Text style={styles.dates}>{order.customer_phone}</Text>
          )}
        </View>

        {/* Work */}
        <View style={styles.section}>
          <Text
            style={{
              ...styles.value,
              fontFamily: "Helvetica-Bold",
              marginBottom: 4,
            }}
          >
            {order.description}
          </Text>
          {order.product_type && (
            <View style={styles.row}>
              <Text style={styles.label}>Tipo:</Text>
              <Text style={styles.value}>
                {order.product_type}
                {order.quantity ? ` — ${order.quantity} u.` : ""}
              </Text>
            </View>
          )}
          {order.size && (
            <View style={styles.row}>
              <Text style={styles.label}>Tamaño:</Text>
              <Text style={styles.value}>{order.size}</Text>
            </View>
          )}
          {order.material && (
            <View style={styles.row}>
              <Text style={styles.label}>Material:</Text>
              <Text style={styles.value}>{order.material}</Text>
            </View>
          )}
          {order.colors && (
            <View style={styles.row}>
              <Text style={styles.label}>Tinta:</Text>
              <Text style={styles.value}>{order.colors}</Text>
            </View>
          )}
          {finishingParts.length > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Acabados:</Text>
              <Text style={styles.value}>{finishingParts.join(" · ")}</Text>
            </View>
          )}
        </View>

        {/* Operator instructions */}
        <View style={styles.section}>
          <Text style={{ ...styles.label, marginBottom: 4 }}>Instrucciones</Text>
          <View style={styles.instructionsBox}>
            {order.operator_notes ? (
              <Text style={styles.value}>{order.operator_notes}</Text>
            ) : (
              <Text style={{ ...styles.value, color: "#ccc" }}> </Text>
            )}
          </View>
        </View>

        {/* Production stages */}
        <View style={styles.section}>
          <Text style={{ ...styles.label, marginBottom: 6 }}>Etapas de producción</Text>
          <View style={styles.stagesContainer}>
            {PRODUCTION_STAGES.map((stage, i) => {
              const isCompleted = i <= currentStageIndex;
              return (
                <View key={stage} style={styles.stage}>
                  <View
                    style={[styles.stageBox, isCompleted ? styles.stageBoxChecked : {}]}
                  />
                  <Text style={styles.stageLabel}>{STAGE_LABELS[stage]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Payment — only if priceMode === 'with' */}
        {priceMode === "with" && (
          <View>
            <View style={styles.paymentBlock}>
              <View style={styles.paymentItem}>
                <Text style={styles.paymentLabel}>Total</Text>
                <Text style={styles.paymentValue}>${order.price_total.toFixed(2)}</Text>
              </View>
              {order.payment_advance != null && (
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Adelanto</Text>
                  <Text style={styles.paymentValue}>
                    ${order.payment_advance.toFixed(2)}
                  </Text>
                </View>
              )}
              {balance !== null && (
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Saldo</Text>
                  <Text style={styles.paymentValue}>${balance.toFixed(2)}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
