import { LoginForm } from "@/features/auth/ui/LoginForm";

export default function LoginPage() {
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
          Iniciar Sesion
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
