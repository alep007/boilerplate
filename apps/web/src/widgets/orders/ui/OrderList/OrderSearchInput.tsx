"use client";

import { useStyletron } from "baseui";
import { Input } from "@repo/ui";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function OrderSearchInput({ value, onChange }: Props) {
  const [css] = useStyletron();
  const t = useTranslations("Orders");

  return (
    <div className={css({ position: "relative", width: "320px" })}>
      <Input
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        placeholder={t("searchPlaceholder")}
        startEnhancer={<Search size={16} />}
        clearable
        clearOnEscape
      />
    </div>
  );
}
