import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
    </div>
  );
};

export { Spinner };
