// apps/web/src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Neuton } from "next/font/google"; // 1. Importamos la fuente
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import StyletronProvider from "./StyletronProvider";
import QueryProvider from "./QueryProvider";

// 2. Configuramos la fuente
const neuton = Neuton({
  weight: ["300", "400", "700"], // Pesos para Mensajes, Subtítulos y Títulos
  subsets: ["latin"],
  variable: "--font-neuton", // Esta es la variable que pusimos en theme.ts
});

export const metadata: Metadata = {
  title: "Boilerplate App",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    // 3. Inyectamos la clase de la variable en el HTML
    <html lang={locale} className={neuton.variable}>
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
