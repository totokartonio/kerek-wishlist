import { LinkButton } from "../ui/Button/LinkButton";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.wrapper}>
      <h1>Something went wrong</h1>
      <p>This page is temporarily unavailable :(</p>
      <LinkButton
        variant="ghost"
        color="primary"
        to={"/dashboard"}
        className={styles.backButton}
      >
        Go Back Home
      </LinkButton>
    </div>
  );
};

export { ErrorPage };
