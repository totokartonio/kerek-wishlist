import type { ReactNode } from "react";
import styles from "./Modal.module.css";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { lockScroll, unlockScroll } from "../../../lib/scrollCount";

type Props = {
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

const Modal = ({ onClose, children, className }: Props) => {
  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
        role="presentation"
        data-testid="modal-backdrop"
      />
      <div color="neutral" className={`${styles.modal} ${className ?? ""}`}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          data-testid="modal-close-button"
          aria-label="Close modal"
        >
          <XIcon size={18} />
        </button>

        {children}
      </div>
    </>,
    document.body,
  );
};

export { Modal };
