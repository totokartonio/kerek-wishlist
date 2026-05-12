import { LinkButton } from "../ui/Button/LinkButton";
import styles from "./AccessDenied.module.css";
import unauthorizedIllustration from "../../assets/illustrations/unauthorized.png";

type Props = {
  message?: string;
};

const AccessDenied = ({
  message = "You don't have permission to view this page.",
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <img
        src={unauthorizedIllustration}
        alt="Access Denied"
        className={styles.illustration}
      />
      <h1>Access Denied</h1>
      <p>{message}</p>
      <LinkButton variant="raised" color="primary" to="/dashboard">
        Go Back Home
      </LinkButton>
    </div>
  );
};

export { AccessDenied };
