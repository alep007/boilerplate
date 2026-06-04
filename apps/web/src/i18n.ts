// apps/web/src/i18n.ts
import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["es", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
  // En las versiones más recientes, debemos esperar la promesa del locale
  const locale = await requestLocale;

  if (!locales.includes(locale as any)) notFound();

  return {
    // Es obligatorio retornar el locale aquí ahora
    locale,
    messages: (await import(`./shared/config/i18n/locales/${locale}.json`))
      .default,
  };
});
