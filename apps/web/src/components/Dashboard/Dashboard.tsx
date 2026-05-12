import { useCreateWishlist } from "../../hooks/wishlists/useCreateWishlist";
import { useWishlists } from "../../hooks/wishlists/useWishlists";
import { useState } from "react";
import type { CreateWishlistDto } from "@wishlist/types";
import WishlistModal from "../WishlistModal";
import WishlistsGrid from "../WishlistsGrid";
import { WishlistGridSkeleton } from "../WishlistsGrid/WishlistGridSkeleton";
import { Button } from "../ui/Button/Button";
import styles from "./Dashboard.module.css";
import ErrorMessage from "../ui/ErrorMessage";
import { PlusIcon } from "@phosphor-icons/react";
import FAB from "../ui/FAB";
import emptyInbox from "../../assets/illustrations/empty-inbox.png";
import EmptyState from "../EmptyState";

const Dashboard = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { data: wishlists = [], isLoading, isError } = useWishlists();
  const { mutate: createWishlist } = useCreateWishlist();

  const ownedWishlists = wishlists.filter((w) => w.role === "owner");
  const sharedWishlists = wishlists.filter((w) => w.role !== "owner");

  const handleAdd = (newWishlist: CreateWishlistDto) => {
    createWishlist(newWishlist, { onSuccess: () => setShowModal(false) });
  };

  if (isError)
    return (
      <div className={styles.wrapper}>
        <ErrorMessage
          title="Something went wrong"
          message="Can't load your dashboard now. Try again later."
        />
      </div>
    );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <Button
          variant="raised"
          color="primary"
          onClick={() => {
            setShowModal(true);
          }}
          className={styles.desktopOnly}
          data-testid="create-wishlist-button"
        >
          Create wishlist
        </Button>
        <FAB
          icon={<PlusIcon size={30} />}
          onClick={() => {
            setShowModal(true);
          }}
          ariaLabel="Create wishlist"
        />
      </div>
      <section className={styles.section}>
        <h2>My Wishlists</h2>
        {isLoading ? (
          <WishlistGridSkeleton />
        ) : ownedWishlists.length > 0 ? (
          <WishlistsGrid color="primary" wishlists={ownedWishlists} />
        ) : (
          <EmptyState
            illustration={emptyInbox}
            title="No wishlists yet"
            message="Create your first wishlist and start sharing with family and friends."
          />
        )}
      </section>
      {sharedWishlists.length > 0 && (
        <section className={styles.section}>
          <h2>Shared with me</h2>
          <WishlistsGrid color="secondary" wishlists={sharedWishlists} />
        </section>
      )}
      {showModal && (
        <WishlistModal
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
          mode="add"
        />
      )}
    </div>
  );
};

export { Dashboard };
