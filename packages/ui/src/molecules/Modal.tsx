"use client";

import {
  Modal as BaseModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ROLE,
  SIZE,
} from "baseui/modal";
import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: keyof typeof SIZE;
}

export function Modal({
  isOpen,
  onClose,
  title,
  footer,
  children,
  size = "default",
}: ModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      role={ROLE.dialog}
      size={size}
    >
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalBody>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </BaseModal>
  );
}
