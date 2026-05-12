import { Link } from "@tanstack/react-router";
import { useState, useRef, Fragment } from "react";
import styles from "./Dropdown.module.css";
import { useClickOutside } from "../../../hooks/ui/useClickOutside";

type DropdownItem =
  | { type: "link"; label: string; icon?: React.ReactNode; to: string }
  | {
      type: "action";
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      danger?: boolean;
      divider?: boolean;
    };

type Props = {
  trigger: React.ReactNode;
  items: DropdownItem[];
};

const CLOSE_DURATION = 150;

const Dropdown = ({ trigger, items }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, CLOSE_DURATION);
  };

  const handleTriggerClick = () => {
    if (isOpen) handleClose();
    else setIsOpen(true);
  };

  const handleClick = (onClick?: () => void) => {
    if (onClick) onClick();
    handleClose();
  };

  useClickOutside(ref, () => {
    if (isOpen) handleClose();
  });

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.trigger} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {(isOpen || isClosing) && (
        <div
          className={`${styles.menu} ${isClosing ? styles.menuClosing : ""}`}
        >
          {items.map((item, index) => {
            const delay = `${index * 30}ms`;
            if (item.type === "link")
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={styles.item}
                  style={{ animationDelay: delay }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            return (
              <Fragment key={item.label}>
                {item.divider && <hr className={styles.divider} />}
                <button
                  onClick={() => handleClick(item.onClick)}
                  className={`${styles.item} ${item.danger ? styles.danger : ""}`}
                  style={{ animationDelay: delay }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { Dropdown };
