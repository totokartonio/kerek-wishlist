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
          <span className={styles.skeletonCircle} />
          <div className={styles.content}>
            <span className={styles.skeletonHeading} />
            <div className={styles.footer}>
              <Badge variant="neutral" className={styles.skeletonBadge} />
            </div>
          </div>
        </Skeleton>
      ))}
    </Card>
  );
};

export { WishlistGridSkeleton };
