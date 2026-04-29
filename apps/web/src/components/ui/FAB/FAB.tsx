import styles from "./FAB.module.css";

type Props = {
  icon: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  className?: string;
};

const FAB = ({ icon, ariaLabel, onClick, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className ?? ""}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

export { FAB };
