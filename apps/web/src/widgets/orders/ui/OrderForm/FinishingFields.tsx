"use client";

import { useStyletron } from "baseui";
import { useTranslations } from "next-intl";
import { Checkbox, Input } from "@repo/ui";
import { LabelSmall } from "baseui/typography";
import { OrderFinishing } from "@/entities/order/model/types";

interface Props {
  value: OrderFinishing;
  onChange: (v: OrderFinishing) => void;
}

export function FinishingFields({ value, onChange }: Props) {
  const [css, theme] = useStyletron();
  const t = useTranslations("Orders");

  const update = (patch: Partial<OrderFinishing>) =>
    onChange({ ...value, ...patch });

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "12px" })}>
      <LabelSmall color={theme.colors.contentSecondary}>{t("finishing")}</LabelSmall>

      {/* Numbered */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "8px" })}>
        <Checkbox
          checked={!!value.numbered}
          onChange={(e) => {
            const checked = (e.target as HTMLInputElement).checked;
            update({ numbered: checked ? { from: 1, to: 100 } : undefined });
          }}
        >
          {t("finishingNumbered")}
        </Checkbox>
        {value.numbered && (
          <div className={css({ display: "flex", gap: "12px", marginLeft: "28px" })}>
            <div className={css({ flex: 1 })}>
              <LabelSmall color={theme.colors.contentSecondary}>{t("finishingFrom")}</LabelSmall>
              <Input
                type="number"
                value={String(value.numbered.from)}
                onChange={(e) =>
                  update({
                    numbered: {
                      ...value.numbered!,
                      from: parseInt((e.target as HTMLInputElement).value) || 1,
                    },
                  })
                }
              />
            </div>
            <div className={css({ flex: 1 })}>
              <LabelSmall color={theme.colors.contentSecondary}>{t("finishingTo")}</LabelSmall>
              <Input
                type="number"
                value={String(value.numbered.to)}
                onChange={(e) =>
                  update({
                    numbered: {
                      ...value.numbered!,
                      to: parseInt((e.target as HTMLInputElement).value) || 100,
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Copies */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "8px" })}>
        <Checkbox
          checked={!!value.copies}
          onChange={(e) => {
            const checked = (e.target as HTMLInputElement).checked;
            update({ copies: checked ? 2 : undefined });
          }}
        >
          {t("finishingCopies")}
        </Checkbox>
        {value.copies && (
          <div className={css({ width: "120px", marginLeft: "28px" })}>
            <Input
              type="number"
              value={String(value.copies)}
              onChange={(e) =>
                update({ copies: parseInt((e.target as HTMLInputElement).value) || 2 })
              }
            />
          </div>
        )}
      </div>

      {/* Glued */}
      <Checkbox
        checked={!!value.glued}
        onChange={(e) =>
          update({ glued: (e.target as HTMLInputElement).checked || undefined })
        }
      >
        {t("finishingGlued")}
      </Checkbox>

      {/* Perforated */}
      <Checkbox
        checked={!!value.perforated}
        onChange={(e) =>
          update({ perforated: (e.target as HTMLInputElement).checked || undefined })
        }
      >
        {t("finishingPerforated")}
      </Checkbox>
    </div>
  );
}
