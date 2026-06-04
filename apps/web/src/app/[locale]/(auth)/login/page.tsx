// NO necesitas "use client" aquí

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { useTranslations } from "next-intl";
import { I18N_NAMESPACES } from "@/shared/config/constants";

export default function LoginPage() {
  // Inicializamos las traducciones usando tu namespace centralizado
  const t = useTranslations(I18N_NAMESPACES.AUTH);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f7",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "24px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", fontFamily: "sans-serif" }}>
          {/* Usamos la llave 'title' que ya tienes en tu JSON */}
          {t("title")}
        </h2>

        <LoginForm />
      </div>
    </div>
  );
}
