import Skeleton from "../ui/Skeleton";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import styles from "./WishlistGrid.module.css";

const WishlistGridSkeleton = () => {
  return (
    <Card color="secondary" className={styles.grid}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className={styles.skeletonCard}
          borderRadius="var(--radius-xl)"
        >
          <div className={styles.innerContainer}>
            <span className={styles.skeletonHeading} />
            <Badge variant="neutral" className={styles.skeletonBadge} />
          </div>
        </Skeleton>
      ))}
    </Card>
  );
};

export { WishlistGridSkeleton };
