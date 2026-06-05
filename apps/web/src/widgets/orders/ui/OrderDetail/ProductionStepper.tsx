"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { ProductionStatus, PRODUCTION_STAGES } from "@/entities/order/model/types";
import { PRODUCTION_STATUS_CONFIG } from "../shared/statusConfig";

interface Props {
  currentStatus: ProductionStatus;
}

export function ProductionStepper({ currentStatus }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const currentIndex = PRODUCTION_STAGES.indexOf(currentStatus);

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "flex-start",
        gap: "0",
        overflowX: "auto",
        paddingBottom: "4px",
      })}
    >
      {PRODUCTION_STAGES.map((stage, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isFuture = i > currentIndex;
        const isLast = i === PRODUCTION_STAGES.length - 1;
        const config = PRODUCTION_STATUS_CONFIG[stage];

        return (
          <div
            key={stage}
            className={css({
              display: "flex",
              alignItems: "center",
              flex: isLast ? "0 0 auto" : "1 1 0",
            })}
          >
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                minWidth: "64px",
              })}
            >
              <div
                className={css({
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  backgroundColor: isDone
                    ? theme.colors.backgroundPositive
                    : isCurrent
                    ? theme.colors.buttonPrimaryFill
                    : theme.colors.backgroundSecondary,
                  color: isDone || isCurrent ? "#ffffff" : theme.colors.contentSecondary,
                  border: isCurrent
                    ? `2px solid ${theme.colors.buttonPrimaryFill}`
                    : "2px solid transparent",
                })}
              >
                {isDone ? <Check size={14} /> : i + 1}
              </div>
              <span
                className={css({
                  fontSize: "11px",
                  textAlign: "center",
                  color: isFuture
                    ? theme.colors.contentSecondary
                    : theme.colors.contentPrimary,
                  fontWeight: isCurrent ? "600" : "400",
                  whiteSpace: "nowrap",
                })}
              >
                {t(config.labelKey as any)}
              </span>
            </div>
            {!isLast && (
              <div
                className={css({
                  flex: 1,
                  height: "2px",
                  backgroundColor: isDone
                    ? theme.colors.backgroundPositive
                    : theme.colors.borderOpaque,
                  marginBottom: "20px",
                  minWidth: "16px",
                })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
