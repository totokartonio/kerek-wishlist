import { useRef, useState } from "react";
import { useClickOutside } from "../../../hooks/ui/useClickOutside";
import styles from "./IconPicker.module.css";

type Props = {
  icons: readonly string[];
  iconMap: Record<string, string>;
  value: string;
  triggerContent?: React.ReactNode;
  placement?: "center" | "left";
  onChange: (slug: string) => void;
};

const IconPicker = ({
  triggerContent,
  icons,
  iconMap,
  value,
  placement = "center",
  onChange,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const handleSelect = (slug: string) => {
    onChange(slug);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={ref}>
      <button
        type="button"
        className={triggerContent ? styles.customTrigger : styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Pick an icon"
      >
        {triggerContent ?? (
          <img
            src={iconMap[value]}
            alt={value}
            className={styles.triggerIcon}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={`${styles.grid} ${placement === "center" ? styles.center : styles.left}`}
        >
          {icons.map((slug) => (
            <button
              key={slug}
              type="button"
              className={`${styles.item} ${slug === value ? styles.selected : ""}`}
              onClick={() => handleSelect(slug)}
              aria-label={slug.replace(/_/g, " ")}
            >
              <img
                src={iconMap[slug]}
                alt={slug.replace(/_/g, " ")}
                className={styles.icon}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { IconPicker };
