// apps/web/src/app/[locale]/not-found.tsx
import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/config/constants";

export default function CatchAllPage() {
  redirect(ROUTES.LOGIN);
}
