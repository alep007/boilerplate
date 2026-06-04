// apps/web/src/app/[locale]/page.tsx
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f7",
      }}
    >
      {/* Inyectamos el Widget global */}
      <Sidebar />

      {/* Contenedor del contenido principal con un margen izquierdo igual al ancho del sidebar */}
      <main
        style={{
          flex: 1,
          marginLeft: "260px",
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <h1 style={{ margin: "0 0 8px 0", color: "#141414" }}>
          Dashboard Principal
        </h1>
        <p style={{ color: "#545454" }}>
          El sistema de diseño atómico y la arquitectura FSD están operando de
          manera integrada.
        </p>
      </main>
    </div>
  );
}
