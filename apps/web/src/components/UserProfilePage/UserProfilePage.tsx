import { useGetUser } from "../../hooks/users/useGetUser";
import { useGetUserWishlist } from "../../hooks/users/useGetUserWishlists";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "../../lib/auth-client";
import { useEffect } from "react";
import styles from "./UserProfilePage.module.css";
import WishlistsGrid from "../WishlistsGrid";
import { WishlistGridSkeleton } from "../WishlistsGrid/WishlistGridSkeleton";
import Skeleton from "../ui/Skeleton";
import Avatar from "../ui/Avatar";
import ErrorPage from "../ErrorPage";
import NotFound from "../NotFound";
import surprised from "../../assets/illustrations/surprised.png";
import EmptyState from "../EmptyState";

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
      <ErrorPage
        title="Something went wrong"
        message="Can't load this user now. Try again later."
      />
    );
  if (!user)
    return (
      <NotFound title="User not found" message="This user doesn't exist." />
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
          <EmptyState
            illustration={surprised}
            title="No wishlists here"
            message="This user hasn't shared any public wishlists yet."
          />
        )}
      </section>
    </div>
  );
};

export { UserProfilePage };
