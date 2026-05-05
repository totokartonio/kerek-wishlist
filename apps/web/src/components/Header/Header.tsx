import { Link } from "@tanstack/react-router";
import styles from "./Header.module.css";
import { useSession, signOut } from "../../lib/auth-client";
import { useState } from "react";
import ConfirmationModal from "../ui/ConfirmationModal";
import { UserIcon } from "@phosphor-icons/react";
import { useIsMobile } from "../../hooks/ui/useIsMobile";
import logoDesktop from "../../assets/logo-desktop.png";
import logoMobile from "../../assets/logo-mobile.png";
import Dropdown from "../ui/Dropdown";
import {
  HouseIcon,
  GearIcon,
  CaretDownIcon,
  SignOutIcon,
} from "@phosphor-icons/react";

const Header = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const isMobile = useIsMobile();

  const { data: session } = useSession();
  const loggedIn = !!session;
  const userName = session?.user.name;

  const handleLogout = async () => {
    await signOut();
    setShowModal(false);
    window.location.href = "/login";
  };

  const dropdownItems = [
    {
      type: "link" as const,
      label: "Dashboard",
      icon: <HouseIcon size={16} />,
      to: "/dashboard",
    },
    {
      type: "link" as const,
      label: "Settings",
      icon: <GearIcon size={16} />,
      to: "/settings",
    },
    {
      type: "action" as const,
      label: "Log out",
      icon: <SignOutIcon size={16} />,
      onClick: () => setShowModal(true),
      danger: true,
      divider: true,
    },
  ];

  const dropdownTrigger = (
    <div className={styles.trigger}>
      {isMobile ? <UserIcon size={20} /> : <span>{userName}</span>}
      <CaretDownIcon size={14} />
    </div>
  );

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link to="/dashboard">
          {isMobile ? (
            <img src={logoMobile} alt="" className={styles.logoImage} />
          ) : (
            <img src={logoDesktop} alt="Kérek" className={styles.logoImage} />
          )}
        </Link>
      </div>
      <nav className={styles.navBar}>
        {loggedIn ? (
          <Dropdown trigger={dropdownTrigger} items={dropdownItems} />
        ) : (
          <Link to="/login" className={styles.loginLink}>
            Log in
          </Link>
        )}
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
