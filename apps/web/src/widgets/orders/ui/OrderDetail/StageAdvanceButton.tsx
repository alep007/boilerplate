"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button, Modal } from "@repo/ui";
import { ProductionStatus, PRODUCTION_STAGES, PaymentStatus } from "@/entities/order/model/types";
import { PRODUCTION_STATUS_CONFIG } from "../shared/statusConfig";
import { useOrder } from "@/entities/order/lib/useOrder";
import { useOrderStore } from "@/entities/order/model/store";

interface Props {
  orderId: string;
  currentStatus: ProductionStatus;
  paymentStatus: PaymentStatus;
}

export function StageAdvanceButton({ orderId, currentStatus, paymentStatus }: Props) {
  const t = useTranslations("Orders");
  const { advanceStatus } = useOrder(orderId);
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const [isPending, startTransition] = useTransition();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const currentIndex = PRODUCTION_STAGES.indexOf(currentStatus);
  const isLast = currentIndex === PRODUCTION_STAGES.length - 1;

  if (isLast) return null;

  const nextStage = PRODUCTION_STAGES[currentIndex + 1] as ProductionStatus;
  const nextLabel = t(PRODUCTION_STATUS_CONFIG[nextStage].labelKey as any);
  const isAdvancingToDelivered = nextStage === "delivered";

  const doAdvance = () => {
    startTransition(async () => {
      await advanceStatus();
    });
  };

  const handleClick = () => {
    if (isAdvancingToDelivered && paymentStatus !== "paid") {
      setShowPaymentDialog(true);
    } else {
      doAdvance();
    }
  };

  const handleMarkPaid = () => {
    updateOrder(orderId, { payment_status: "paid", payment_advance: undefined });
    doAdvance();
    setShowPaymentDialog(false);
  };

  const handleOnlyDeliver = () => {
    doAdvance();
    setShowPaymentDialog(false);
  };

  return (
    <>
      <Button onClick={handleClick} isLoading={isPending}>
        {t("advanceTo", { stage: nextLabel })}
      </Button>

      <Modal
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        title={t("deliveredDialogTitle")}
        footer={
          <div style={{ display: "flex", gap: "8px" }}>
            <Button kind="secondary" onClick={handleOnlyDeliver}>
              {t("onlyDeliver")}
            </Button>
            <Button onClick={handleMarkPaid}>
              {t("markPaid")}
            </Button>
          </div>
        }
      >
        {t("deliveredDialogBody")}
      </Modal>
    </>
  );
}
