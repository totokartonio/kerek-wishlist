import Skeleton from "../../../../ui/Skeleton";
import styles from "../ItemsTable.module.css";

const ItemsTableSkeleton = () => {
  return (
    <div className={styles.skeletonWrapper}>
      <Skeleton width="100%" height={300} className={styles.skeleton}>
        <div className={styles.skeletonHeading} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={styles.skeletonPreview} />
            <div className={styles.skeletonColumn} />
          </div>
        ))}
      </Skeleton>
    </div>
  );
};

export { ItemsTableSkeleton };
