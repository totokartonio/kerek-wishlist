import { LinkButton } from "../ui/Button/LinkButton";
import styles from "./NotFound.module.css";
import notFoundIllustration from "../../assets/illustrations/character-404.png";
import type { NotFoundRouteProps } from "@tanstack/react-router";

type Props = NotFoundRouteProps & {
  title?: string;
  message?: string;
};

const NotFound = ({
  title = "Page not found",
  message = "The page you're looking for doesn't exist or has been moved.",
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <img
        src={notFoundIllustration}
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

export { NotFound };
