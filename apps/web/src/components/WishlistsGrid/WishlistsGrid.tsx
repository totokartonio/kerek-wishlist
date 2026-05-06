import type { WishlistWithRole } from "@wishlist/types";
import Card from "../ui/Card";
import styles from "./WishlistGrid.module.css";
import { Link } from "@tanstack/react-router";
import Badge from "../ui/Badge";
import { WISHLIST_ICON_MAP } from "../../lib/wishlistIconMap";

type Props = {
  wishlists: WishlistWithRole[];
  color: "primary" | "secondary";
};

const visibilityBadgeVariant = (
  visibility: string,
): "green" | "blue" | "neutral" => {
  if (visibility === "public") return "green";
  if (visibility === "invite") return "blue";
  return "neutral";
};

const WishlistsGrid = ({ wishlists, color }: Props) => {
  const iconCircleColor = color === "primary" ? "secondary" : "primary";

  return (
    <Card
      color={color === "primary" ? "secondary" : "primary"}
      className={styles.grid}
    >
      {wishlists.map((wishlist) => (
        <Link
          className={styles.container}
          to="/wishlists/$wishlistId"
          params={{ wishlistId: wishlist.id }}
          key={wishlist.id}
        >
          <Card variant="raised" color={color} className={styles.card}>
            <div className={`${styles.iconCircle} ${styles[iconCircleColor]}`}>
              <img
                src={WISHLIST_ICON_MAP[wishlist.icon]}
                alt={wishlist.icon.replace(/_/g, " ")}
                className={styles.icon}
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.heading}>{wishlist.name}</h3>
              <p className={styles.description}>{wishlist.description}</p>
              <div className={styles.footer}>
                <Badge variant={visibilityBadgeVariant(wishlist.visibility)}>
                  {wishlist.visibility.charAt(0).toUpperCase() +
                    wishlist.visibility.slice(1)}
                </Badge>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </Card>
  );
};

export { WishlistsGrid };
