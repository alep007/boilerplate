"use client";

import { useStyletron } from "baseui";
import { Order } from "@/entities/order/model/types";
import { SpecificationsCard } from "./SpecificationsCard";
import { NotesCard } from "./NotesCard";
import { ClientCard } from "./ClientCard";
import { PaymentCard } from "./PaymentCard";

interface Props {
  order: Order;
  onEdit: () => void;
}

export function OrderInfoView({ order, onEdit }: Props) {
  const [css] = useStyletron();
  const hasNotes = !!(order.operator_notes || order.internal_notes);

  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "3fr 2fr",
        gap: "20px",
        alignItems: "start",
        "@media (max-width: 768px)": { gridTemplateColumns: "1fr" },
      })}
    >
      {/* ── Left column: specs + notes ── */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "16px" })}>
        <SpecificationsCard order={order} />
        {hasNotes && (
          <NotesCard
            notes={order.operator_notes ?? ""}
            internalNotes={order.internal_notes}
          />
        )}
      </div>

      {/* ── Right column: client + payment ── */}
      <div className={css({ display: "flex", flexDirection: "column", gap: "16px" })}>
        <ClientCard order={order} />
        <PaymentCard order={order} onEdit={onEdit} />
      </div>
    </div>
  );
}
