"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import {
  ClipboardList,
  PenTool,
  Layers,
  Printer,
  Scissors,
  PackageCheck,
  Truck,
  Check,
} from "lucide-react";
import { Badge } from "@repo/ui";
import {
  ProductionStatus,
  PaymentStatus,
  PRODUCTION_STAGES,
} from "@/entities/order/model/types";
import { PRODUCTION_STATUS_CONFIG } from "../shared/statusConfig";
import { StageAdvanceButton } from "./StageAdvanceButton";

// ── Stage icon map ────────────────────────────────────────────────────────────

const STAGE_ICONS: Record<ProductionStatus, React.ElementType> = {
  received: ClipboardList,
  design: PenTool,
  plate: Layers,
  printing: Printer,
  finishing: Scissors,
  ready: PackageCheck,
  delivered: Truck,
};

function getStatusLabel(
  status: ProductionStatus,
  t: ReturnType<typeof useTranslations>
): string {
  if (status === "delivered") return t("statusDelivered");
  if (status === "ready") return t("statusReady");
  return t("inProgress");
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  orderId: string;
  currentStatus: ProductionStatus;
  paymentStatus: PaymentStatus;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProductionProgressCard({ orderId, currentStatus, paymentStatus }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const currentIndex = PRODUCTION_STAGES.indexOf(currentStatus);
  const statusConfig = PRODUCTION_STATUS_CONFIG[currentStatus];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentLabel = t(statusConfig.labelKey as any);
  const overallLabel = getStatusLabel(currentStatus, t);

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "0",
        border: `1px solid ${theme.colors.borderOpaque}`,
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: (theme.colors as Record<string, string>).mono100 ?? "#ffffff",
      })}
    >
      {/* ── Left status panel ── */}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          padding: "20px 24px",
          backgroundColor: `${theme.colors.buttonPrimaryFill}0d`,
          borderRight: `1px solid ${theme.colors.borderOpaque}`,
          minWidth: "150px",
          alignSelf: "stretch",
          justifyContent: "center",
        })}
      >
        {/* Icon container */}
        <div
          className={css({
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            backgroundColor: `${theme.colors.buttonPrimaryFill}1a`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <ClipboardList size={26} color={theme.colors.buttonPrimaryFill} strokeWidth={1.8} />
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Badge label={overallLabel} variant={statusConfig.variant} />
        <span
          className={css({
            fontSize: "12px",
            color: theme.colors.contentSecondary,
            textAlign: "center",
            lineHeight: "1.4",
          })}
        >
          {t("stageCurrentLabel", { stage: currentLabel })}
        </span>
      </div>

      {/* ── Stage stepper ── */}
      <div
        className={css({
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "24px 20px",
          overflowX: "auto",
          gap: "0",
        })}
      >
        {PRODUCTION_STAGES.map((stage, i) => {
          const isDone = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isLast = i === PRODUCTION_STAGES.length - 1;
          const StageIcon = STAGE_ICONS[stage];

          return (
            <div
              key={stage}
              className={css({
                display: "flex",
                alignItems: "center",
                flex: isLast ? "0 0 auto" : "1 1 0",
              })}
            >
              {/* Stage node */}
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: "60px",
                })}
              >
                <div
                  className={css({
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isDone
                      ? theme.colors.backgroundPositive
                      : isCurrent
                      ? theme.colors.buttonPrimaryFill
                      : theme.colors.backgroundSecondary,
                    border: isCurrent
                      ? `2px solid ${theme.colors.buttonPrimaryFill}`
                      : isDone
                      ? `2px solid ${theme.colors.backgroundPositive}`
                      : `2px solid ${theme.colors.borderOpaque}`,
                    transition: "all 200ms",
                  })}
                >
                  {isDone ? (
                    <Check size={16} color="#ffffff" strokeWidth={2.5} />
                  ) : (
                    <StageIcon
                      size={17}
                      color={isCurrent ? "#ffffff" : theme.colors.contentSecondary}
                      strokeWidth={isCurrent ? 2.2 : 1.8}
                    />
                  )}
                </div>
                <span
                  className={css({
                    fontSize: "11px",
                    textAlign: "center",
                    color: isCurrent
                      ? theme.colors.buttonPrimaryFill
                      : isDone
                      ? theme.colors.contentPrimary
                      : theme.colors.contentSecondary,
                    fontWeight: isCurrent ? "700" : isDone ? "500" : "400",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-inter), sans-serif",
                  })}
                >
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {t(PRODUCTION_STATUS_CONFIG[stage].labelKey as any)}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={css({
                    flex: 1,
                    height: "2px",
                    backgroundColor: isDone
                      ? theme.colors.backgroundPositive
                      : theme.colors.borderOpaque,
                    marginBottom: "24px",
                    minWidth: "12px",
                    transition: "background-color 200ms",
                  })}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Advance CTA ── */}
      <div
        className={css({
          padding: "20px 24px",
          borderLeft: `1px solid ${theme.colors.borderOpaque}`,
          alignSelf: "stretch",
          display: "flex",
          alignItems: "center",
        })}
      >
        <StageAdvanceButton
          orderId={orderId}
          currentStatus={currentStatus}
          paymentStatus={paymentStatus}
        />
      </div>
    </div>
  );
}
