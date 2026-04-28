import styles from "./ErrorMessage.module.css";

type Props = {
  title: string;
  message: string;
  action?: React.ReactNode;
};

const ErrorMessage = ({ title, message, action }: Props) => {
  return (
    <div className={styles.wrapper}>
      <h2>{title}</h2>
      <p className={styles.message}>{message}</p>
      {action}
    </div>
  );
};

export { ErrorMessage };
