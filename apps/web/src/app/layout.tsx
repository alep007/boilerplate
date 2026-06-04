// apps/web/app/layout.tsx
import type { Metadata } from "next";
import StyletronProvider from "./StyletronProvider";
import QueryProvider from "./QueryProvider";

export const metadata: Metadata = {
  title: "Boilerplate App",
  description: "Next.js + Base Web + TanStack Query",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        <QueryProvider>
          <StyletronProvider>{children}</StyletronProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
