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

const Dropdown = ({ trigger, items }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (onClick?: () => void) => {
    if (onClick) onClick();
    setIsOpen(false);
  };
  useClickOutside(ref, () => setIsOpen(false));
  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={styles.menu}>
          {items.map((item) => {
            if (item.type === "link")
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={styles.item}
                  onClick={() => handleClick()}
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
