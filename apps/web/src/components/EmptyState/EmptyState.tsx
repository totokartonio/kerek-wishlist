import styles from "./EmptyState.module.css";

type Props = {
  illustration: string;
  title: string;
  message?: string;
  action?: React.ReactNode;
};

const EmptyState = ({ illustration, title, message, action }: Props) => {
  return (
    <div className={styles.wrapper}>
      <img src={illustration} alt={title} className={styles.illustration} />
      <h2 className={styles.title}>{title}</h2>
      {message && <p className={styles.message}>{message}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export { EmptyState };
