// apps/web/src/app/[locale]/page.tsx
"use client"; // <-- ¡Esta es la llave mágica!

import {
  HeadingLarge,
  HeadingMedium,
  ParagraphMedium,
} from "baseui/typography";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { Button } from "@repo/ui";

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f7",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          marginLeft: "260px",
          padding: "40px",
        }}
      >
        {/* Ahora estos componentes pueden acceder al Contexto del Tema */}
        <HeadingLarge>Este es un Título con Neuton Bold</HeadingLarge>
        <HeadingMedium>Este es un Subtítulo con Neuton Regular</HeadingMedium>
        <ParagraphMedium>
          Este es un mensaje base con Neuton Light, siguiendo las reglas
          establecidas en FSD.
        </ParagraphMedium>
        <Button>Enviar</Button>
      </main>
    </div>
  );
}
