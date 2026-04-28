import styles from "./Skeleton.module.css";

type Props = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  className?: string;
  children?: React.ReactNode;
};

const Skeleton = ({
  width,
  height,
  borderRadius = "var(--radius-sm)",
  className,
  children,
}: Props) => {
  return (
    <div
      className={`${styles.skeleton} ${className ?? ""}`}
      style={{ width, height, borderRadius }}
      data-testid="skeleton"
    >
      {children}
    </div>
  );
};

export { Skeleton };
