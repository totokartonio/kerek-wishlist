import styles from "./Drawer.module.css";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import { useEffect, useState, useCallback } from "react";
import { lockScroll, unlockScroll } from "../../../lib/scrollCount";

type Props = {
  onClose: () => void;
  className?: string;
  children: ReactNode;
};

const CLOSE_DURATION = 250;

const Drawer = ({ onClose, className, children }: Props) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, CLOSE_DURATION);
  }, [onClose]);

  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return createPortal(
    <>
      <div
        className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ""}`}
        onClick={handleClose}
        role="presentation"
        data-testid="modal-backdrop"
      />
      <div
        className={`${styles.drawer} ${isClosing ? styles.drawerClosing : ""} ${className ?? ""}`}
      >
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          <Button
            type="button"
            variant="ghost"
            color="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </>,
    document.body,
  );
};

export { Drawer };
