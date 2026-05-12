import Card from "../../../ui/Card";
import { LinkButton } from "../../../ui/Button/LinkButton";
import styles from "./FinalCTA.module.css";

const FinalCTA = () => {
  return (
    <Card variant="flat" color="primary" className={styles.wrapper}>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Ready when you are</span>
        <h2 className={styles.title}>
          Make your next wishlist feel like a little celebration.
        </h2>
      </div>
      <LinkButton to="/login" variant="raised" color="primary" className={styles.cta}>
        Start your wishlist
      </LinkButton>
    </Card>
  );
};

export { FinalCTA };
