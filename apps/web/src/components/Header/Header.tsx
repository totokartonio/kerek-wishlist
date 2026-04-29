import { Link, useNavigate } from "@tanstack/react-router";
import styles from "./Header.module.css";
import { useSession, signOut } from "../../lib/auth-client";
import { useState } from "react";
import ConfirmationModal from "../ui/ConfirmationModal";
import { Button } from "../ui/Button/Button";
import { UserIcon } from "@phosphor-icons/react";
import { LinkButton } from "../ui/Button/LinkButton";

const Header = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigate = useNavigate();
  const { data: session } = useSession();
  const loggedIn = !!session;
  const userName = session?.user.name;

  const handleClick = async () => {
    if (loggedIn) {
      setShowModal(true);
      return;
    }
    navigate({ to: "/login" });
  };
  const handleLogout = () => {
    signOut();
    setShowModal(false);
    navigate({ to: "/login" });
  };

  return (
    <div className={styles.header}>
      <div className={styles.logo}>Logo</div>
      <nav className={styles.navBar}>
        {loggedIn && (
          <div>
            <Link to="/dashboard" className={styles.desktopOnly}>
              {userName}
            </Link>
            <LinkButton
              variant="ghost"
              color="primary"
              to="/dashboard"
              size="sm"
              className={styles.mobileOnly}
            >
              <UserIcon size={20} />
            </LinkButton>
          </div>
        )}
        <Button
          onClick={handleClick}
          size="sm"
          variant={loggedIn ? "ghost" : "flat"}
          color={loggedIn ? "secondary" : "primary"}
          className={styles.loginButton}
        >
          {loggedIn ? "Log out" : "Log in"}
        </Button>
      </nav>
      {showModal && (
        <ConfirmationModal
          title="Log Out"
          message="Are you sure you want to log out?"
          onClose={() => setShowModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export { Header };
