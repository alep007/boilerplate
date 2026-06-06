"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";

interface Props {
  notes: string;
  /** Notes not intended for printing, shown dimmed */
  internalNotes?: string;
}

export function NotesCard({ notes, internalNotes }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");
  const white = (theme.colors as Record<string, string>).mono100 ?? "#ffffff";

  return (
    <div
      className={css({
        border: `1px solid ${theme.colors.borderOpaque}`,
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: white,
      })}
    >
      {/* Operator notes — left blue accent */}
      <div
        className={css({
          borderLeft: `4px solid ${theme.colors.buttonPrimaryFill}`,
          padding: "16px 20px",
        })}
      >
        <span
          className={css({
            display: "block",
            fontSize: "10px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: theme.colors.buttonPrimaryFill,
            marginBottom: "8px",
            fontFamily: "var(--font-inter), sans-serif",
          })}
        >
          {t("sectionProductionNotes")}
        </span>
        <p
          className={css({
            margin: 0,
            fontSize: "14px",
            lineHeight: "1.6",
            color: theme.colors.contentPrimary,
            fontFamily: "var(--font-inter), sans-serif",
          })}
        >
          {notes}
        </p>
      </div>

      {/* Internal notes — only if present */}
      {internalNotes && (
        <div
          className={css({
            borderTop: `1px solid ${theme.colors.borderOpaque}`,
            borderLeft: `4px solid ${theme.colors.borderOpaque}`,
            padding: "14px 20px",
          })}
        >
          <span
            className={css({
              display: "block",
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: theme.colors.contentSecondary,
              marginBottom: "6px",
              fontFamily: "var(--font-inter), sans-serif",
            })}
          >
            {t("fieldInternalNotes")}
          </span>
          <p
            className={css({
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.6",
              color: theme.colors.contentSecondary,
              fontFamily: "var(--font-inter), sans-serif",
            })}
          >
            {internalNotes}
          </p>
        </div>
      )}
    </div>
  );
}
