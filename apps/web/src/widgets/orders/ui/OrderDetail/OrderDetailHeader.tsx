"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Printer } from "lucide-react";
import { Button, Toggle } from "@repo/ui";
import { Order } from "@/entities/order/model/types";

interface Props {
  order: Order | null;
  isNew: boolean;
  isEditing: boolean;
  isDirty: boolean;
  isSaving: boolean;
  showPrice: boolean;
  onTogglePrice: (v: boolean) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPrint: () => void;
  sticky?: boolean;
}

export function OrderDetailHeader({
  order,
  isNew,
  isEditing,
  isDirty,
  isSaving,
  showPrice,
  onTogglePrice,
  onEdit,
  onCancel,
  onSave,
  onPrint,
  sticky = false,
}: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const handleBack = () => {
    if (isDirty) {
      if (!window.confirm(t("unsavedChanges"))) return;
    }
    router.push(`/${locale}/orders`);
  };

  const orderTitle = isNew
    ? t("newOrder")
    : order
    ? `Orden #${String(order.order_number).padStart(5, "0")}`
    : "…";

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        ...(sticky && {
          position: "sticky",
          top: "0",
          zIndex: 50,
          backgroundColor: theme.colors.backgroundPrimary,
          paddingTop: "16px",
          paddingBottom: "16px",
          marginTop: "-16px",
          marginBottom: "-16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          "@media (max-width: 768px)": {
            top: "56px",
          },
        }),
      })}
    >
      {/* ── Breadcrumb ── */}
      <nav className={css({ display: "flex", alignItems: "center", gap: "6px" })}>
        <button
          onClick={handleBack}
          className={css({
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: theme.colors.contentSecondary,
            fontFamily: "var(--font-inter), sans-serif",
            ":hover": { color: theme.colors.buttonPrimaryFill },
            transition: "color 150ms",
          })}
        >
          {t("title")}
        </button>
        <span
          className={css({
            fontSize: "12px",
            color: theme.colors.contentSecondary,
            userSelect: "none",
          })}
        >
          ›
        </span>
        <span
          className={css({
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: theme.colors.contentSecondary,
            fontFamily: "var(--font-inter), sans-serif",
          })}
        >
          {isNew ? t("newOrder") : "Detalle de Orden"}
        </span>
      </nav>

      {/* ── Main row ── */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          paddingTop: "4px",
        })}
      >
        {/* Title */}
        <h1
          className={css({
            margin: 0,
            fontSize: "32px",
            fontWeight: "800",
            color: theme.colors.contentPrimary,
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
            "@media (max-width: 768px)": {
              fontSize: "22px",
            },
          })}
        >
          {orderTitle}
        </h1>

        {/* Actions */}
        <div className={css({
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          "@media (max-width: 768px)": {
            width: "100%",
          },
        })}>
          {isEditing ? (
            <>
              <Button kind="secondary" onClick={onCancel} disabled={isSaving}>
                {t("cancel")}
              </Button>
              <Button onClick={onSave} isLoading={isSaving}>
                {isNew ? t("saveOrder") : t("save")}
              </Button>
              {isNew && (
                <Button onClick={onPrint} disabled={isSaving} kind="tertiary">
                  {t("saveAndPrint")}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button kind="secondary" onClick={onEdit}>
                {t("edit")}
              </Button>
              {/* Price toggle */}
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 14px",
                  border: `1px solid ${theme.colors.borderOpaque}`,
                  borderRadius: "8px",
                  backgroundColor: (theme.colors as Record<string, string>).mono100 ?? "#fff",
                })}
              >
                <Toggle
                  checked={showPrice}
                  onChange={onTogglePrice}
                  label={t("showPrices")}
                />
              </div>
              {/* Print button */}
              <button
                onClick={onPrint}
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.colors.borderOpaque}`,
                  backgroundColor: (theme.colors as Record<string, string>).mono100 ?? "#fff",
                  color: theme.colors.contentPrimary,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  fontFamily: "var(--font-inter), sans-serif",
                  whiteSpace: "nowrap",
                  ":hover": {
                    backgroundColor: theme.colors.backgroundSecondary,
                  },
                  transition: "background-color 150ms",
                })}
              >
                <Printer size={16} strokeWidth={1.8} />
                {t("printWorksheet")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
