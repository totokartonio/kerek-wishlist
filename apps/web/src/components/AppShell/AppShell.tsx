import logoDesktop from "../../assets/logo-desktop.png";
import styles from "./AppShell.module.css";

const AppShell = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={logoDesktop} alt="Kérek" className={styles.logoImage} />
      </div>
      <main className={styles.main} />
    </div>
  );
};

export { AppShell };
