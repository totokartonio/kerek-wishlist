import styles from "./Drawer.module.css";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Button } from "../Button/Button";
import { useEffect } from "react";
import { lockScroll, unlockScroll } from "../../../lib/scrollCount";

type Props = {
  onClose: () => void;
  className?: string;
  children: ReactNode;
};

const Drawer = ({ onClose, className, children }: Props) => {
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
      <div className={`${styles.drawer} ${className ?? ""}`}>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          <Button
            type="button"
            variant="ghost"
            color="secondary"
            onClick={onClose}
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
