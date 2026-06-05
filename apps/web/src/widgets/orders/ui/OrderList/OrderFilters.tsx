"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { OrderFilter } from "@/entities/order/lib/useOrderList";

interface Props {
  active: OrderFilter;
  onChange: (f: OrderFilter) => void;
}

const FILTERS: { key: OrderFilter; labelKey: string }[] = [
  { key: "all",             labelKey: "filterAll"            },
  { key: "today",           labelKey: "filterToday"          },
  { key: "pending_payment", labelKey: "filterPendingPayment" },
  { key: "in_production",   labelKey: "filterInProduction"   },
];

export function OrderFilters({ active, onChange }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");

  return (
    <div
      className={css({
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
      })}
    >
      {FILTERS.map(({ key, labelKey }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={css({
              padding: "6px 16px",
              borderRadius: "20px",
              border: `1px solid ${isActive ? theme.colors.buttonPrimaryFill : theme.colors.borderOpaque}`,
              backgroundColor: isActive ? theme.colors.buttonPrimaryFill : "transparent",
              color: isActive ? "#ffffff" : theme.colors.contentSecondary,
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: isActive ? "600" : "400",
              transition: "all 0.15s ease",
              ":hover": {
                borderColor: theme.colors.buttonPrimaryFill,
                color: isActive ? "#ffffff" : theme.colors.buttonPrimaryFill,
              },
            })}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t(labelKey as any)}
          </button>
        );
      })}
    </div>
  );
}
