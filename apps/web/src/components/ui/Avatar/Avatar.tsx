import { UserIcon } from "@phosphor-icons/react";
import { AVATAR_ICON_MAP } from "../../../lib/avatarIconMap";
import styles from "./Avatar.module.css";

type Props = {
  avatar: string | null;
  size?: number;
  className?: string;
};

const Avatar = ({ avatar, size = 32, className }: Props) => {
  return (
    <div
      className={`${styles.circle} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {avatar && AVATAR_ICON_MAP[avatar] ? (
        <img
          src={AVATAR_ICON_MAP[avatar]}
          alt={avatar.replace(/_/g, " ")}
          className={styles.image}
        />
      ) : (
        <UserIcon size={size * 0.55} className={styles.fallback} />
      )}
    </div>
  );
};

export { Avatar };
