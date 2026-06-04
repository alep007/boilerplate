// apps/web/src/app/[locale]/dashboard/layout.tsx
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { MainLayout } from "@/widgets/layout/ui/MainLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
