import { LinkButton } from "../ui/Button/LinkButton";
import styles from "./ErrorPage.module.css";
import errorIllustration from "../../assets/illustrations/problem-solver.png";

type Props = {
  title?: string;
  message?: string;
};

const ErrorPage = ({
  title = "Something went wrong",
  message = "This page is temporarily unavailable. Please try again later.",
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <img
        src={errorIllustration}
        alt={title}
        className={styles.illustration}
      />
      <h1>{title}</h1>
      <p>{message}</p>
      <LinkButton variant="raised" color="primary" to="/dashboard">
        Go Back Home
      </LinkButton>
    </div>
  );
};

export { ErrorPage };
