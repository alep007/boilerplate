// apps/web/src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import StyletronProvider from "./StyletronProvider";
import QueryProvider from "./QueryProvider";

export const metadata: Metadata = {
  title: "Boilerplate App",
};

export default async function RootLayout({
  children,
  params, // Ya no desestructuramos aquí
}: {
  children: React.ReactNode;
  // Tipamos params explícitamente como una Promesa
  params: Promise<{ locale: string }>;
}) {
  // 1. Resolvemos la promesa para obtener el locale
  const { locale } = await params;

  // 2. Obtenemos los diccionarios de traducción
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body style={{ margin: 0, padding: 0 }}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <StyletronProvider>{children}</StyletronProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
