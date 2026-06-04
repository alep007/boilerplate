// apps/web/src/features/i18n/ui/LanguageSwitcher.tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@repo/ui";
import { useTransition } from "react";

export const LanguageSwitcher = () => {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "es" ? "en" : "es";

    // Reemplazamos el fragmento de la URL actual (/es/...) por el nuevo (/en/...)
    const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);

    startTransition(() => {
      router.replace(newPathname);
    });
  };

  return (
    <Button onClick={toggleLanguage} isLoading={isPending} disabled={isPending}>
      {t("switchLanguage")}
    </Button>
  );
};
