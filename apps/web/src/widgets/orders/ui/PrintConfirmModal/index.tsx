"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal, Button } from "@repo/ui";
import { LabelMedium, ParagraphSmall } from "baseui/typography";
import { useOrderStore } from "@/entities/order/model/store";

interface Props {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}

export function PrintConfirmModal({ isOpen, orderId, onClose }: Props) {
  const t = useTranslations("Orders");
  const [priceMode, setPriceMode] = useState<"with" | "without">("with");
  const [isPrinting, setIsPrinting] = useState(false);

  const order = useOrderStore((state) =>
    state.orders.find((o) => o.id === orderId)
  );

  const handlePrint = async () => {
    if (!order) return;
    setIsPrinting(true);
    try {
      // Dynamically import pdf() and the document to avoid SSR issues
      const { pdf } = await import("@react-pdf/renderer");
      const { OrderPrintDocument } = await import("../OrderPrintDocument");
      const blob = await pdf(
        // @ts-expect-error - JSX in dynamic context
        <OrderPrintDocument order={order} priceMode={priceMode} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } finally {
      setIsPrinting(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("printModalTitle")}
      footer={
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <Button kind="secondary" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handlePrint} isLoading={isPrinting}>
            {t("printConfirm")}
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <ParagraphSmall>{t("printModalDescription")}</ParagraphSmall>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(["with", "without"] as const).map((mode) => (
            <label
              key={mode}
              style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <input
                type="radio"
                name="priceMode"
                value={mode}
                checked={priceMode === mode}
                onChange={() => setPriceMode(mode)}
              />
              <LabelMedium>{t(mode === "with" ? "printWithPrice" : "printWithoutPrice")}</LabelMedium>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
