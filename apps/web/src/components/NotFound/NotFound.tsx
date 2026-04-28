import { LinkButton } from "../ui/Button/LinkButton";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.wrapper}>
      <h1>404</h1>
      <p>Page not found :(</p>
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

export { NotFound };
