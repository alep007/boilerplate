"use client";

import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { LabelSmall } from "baseui/typography";
import { PAYMENT_STATUS_CONFIG } from "../../shared/statusConfig";
import { PaymentStatus } from "@/entities/order/model/types";

const PAYMENT_OPTIONS: PaymentStatus[] = ["paid", "partial", "pending"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PaymentStatusAdapter(props: any) {
  const { input, label } = useFieldApi(props);
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "6px" })}>
      {label && (
        <LabelSmall color={theme.colors.contentSecondary}>{label}</LabelSmall>
      )}
      <div className={css({ display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "2px" })}>
        {PAYMENT_OPTIONS.map((status) => {
          const config = PAYMENT_STATUS_CONFIG[status];
          const isActive = input.value === status;
          return (
            <button
              type="button"
              key={status}
              onClick={() => input.onChange(status)}
              className={css({
                padding: "8px 18px",
                borderRadius: "20px",
                border: `1px solid ${
                  isActive ? theme.colors.buttonPrimaryFill : theme.colors.borderOpaque
                }`,
                backgroundColor: isActive ? theme.colors.buttonPrimaryFill : "transparent",
                color: isActive ? "#ffffff" : theme.colors.contentSecondary,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: isActive ? "600" : "400",
                transition: "all 100ms",
              })}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {t(config.labelKey as any)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
