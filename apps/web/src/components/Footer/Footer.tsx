import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p className={styles.text}>
        Icons and illustrations by{" "}
        <a
          href="https://www.claybees.art"
          target="_blank"
          rel="noopener noreferrer"
        >
          CLAYBEES
        </a>
      </p>
      <p className={styles.text}>
        Made by{" "}
        <a
          href="https://github.com/totokartonio"
          target="_blank"
          rel="noopener noreferrer"
        >
          toto
        </a>
      </p>
    </div>
  );
};

export { Footer };
