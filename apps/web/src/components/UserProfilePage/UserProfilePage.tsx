import { useGetUser } from "../../hooks/users/useGetUser";
import { useGetUserWishlist } from "../../hooks/users/useGetUserWishlists";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "../../lib/auth-client";
import { useEffect } from "react";
import styles from "./UserProfilePage.module.css";
import WishlistsGrid from "../WishlistsGrid";
import { WishlistGridSkeleton } from "../WishlistsGrid/WishlistGridSkeleton";
import ErrorMessage from "../ui/ErrorMessage";
import { LinkButton } from "../ui/Button/LinkButton";
import Skeleton from "../ui/Skeleton";
import Avatar from "../ui/Avatar";

type Props = {
  userId: string;
};

const UserProfilePage = ({ userId }: Props) => {
  const { data: user, isError, isLoading } = useGetUser(userId, true);
  const { data: wishlists } = useGetUserWishlist(userId);
  const { data: session } = useSession();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id === session?.user.id) navigate({ to: "/dashboard" });
  }, [user, session, navigate]);

  if (isLoading)
    return (
      <div className={styles.wrapper}>
        <Skeleton width={200} height={32} />
        <section className={styles.section}>
          <h2>Wishlists</h2>

          <WishlistGridSkeleton />
        </section>
      </div>
    );

  if (isError)
    return (
      <div className={styles.wrapper}>
        <ErrorMessage
          title="Something went wrong"
          message="Can't load this user now. Try again later."
          action={
            <LinkButton variant="ghost" color="primary" to="/dashboard">
              Go Back
            </LinkButton>
          }
        />
      </div>
    );
  if (!user)
    return (
      <div className={styles.wrapper}>
        <ErrorMessage
          title="Something went wrong"
          message="User doesn't exist."
          action={
            <LinkButton variant="ghost" color="primary" to="/dashboard">
              Go Back
            </LinkButton>
          }
        />
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <div className={styles.nameWrapper}>
        <Avatar avatar={user.avatar ?? null} size={48} />
        <h1 className={styles.name}>{user.name}</h1>
      </div>
      <section className={styles.section}>
        <h2>Wishlists</h2>
        {wishlists && wishlists.length > 0 ? (
          <WishlistsGrid
            color="primary"
            wishlists={wishlists.map((w) => ({
              ...w,
              role: "viewer" as const,
            }))}
          />
        ) : (
          <p className={styles.emptyState}>No wishlists found.</p>
        )}
      </section>
    </div>
  );
};

export { UserProfilePage };
