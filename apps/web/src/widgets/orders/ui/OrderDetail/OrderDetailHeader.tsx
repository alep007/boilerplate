"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { HeadingMedium } from "baseui/typography";
import { Button } from "@repo/ui";
import { Order } from "@/entities/order/model/types";

interface Props {
  order: Order | null;
  isNew: boolean;
  isEditing: boolean;
  isDirty: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export function OrderDetailHeader({
  order,
  isNew,
  isEditing,
  isDirty,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onPrint,
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

  const title = isNew
    ? t("newOrder")
    : order
    ? `#${String(order.order_number).padStart(3, "0")} — ${order.customer_name}`
    : "…";

  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "8px",
      })}
    >
      <div className={css({ display: "flex", alignItems: "center", gap: "16px" })}>
        <button
          onClick={handleBack}
          className={css({
            background: "none",
            border: "none",
            cursor: "pointer",
            color: theme.colors.contentSecondary,
            fontSize: "14px",
            padding: "4px 8px",
            borderRadius: "4px",
            ":hover": { color: theme.colors.contentPrimary },
          })}
        >
          {t("back")}
        </button>
        <HeadingMedium color={theme.colors.contentPrimary} $style={{ margin: 0 }}>
          {title}
        </HeadingMedium>
      </div>

      <div className={css({ display: "flex", gap: "8px" })}>
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
            <Button onClick={onPrint}>{t("print")}</Button>
          </>
        )}
      </div>
    </div>
  );
}
