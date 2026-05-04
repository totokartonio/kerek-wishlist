import type { ItemFilters } from "@wishlist/types";
import { FunnelSimpleIcon, SortDescendingIcon } from "@phosphor-icons/react";
import styles from "../ViewControls/ViewControls.module.css";

type Props = {
  filters: ItemFilters;
  onFilterChange: (updates: Partial<ItemFilters>) => void;
  canEdit: boolean;
};

const FilterControls = ({ filters, onFilterChange, canEdit }: Props) => {
  return (
    <>
      <div className={styles.selectWrapper}>
        <FunnelSimpleIcon size={18} className={styles.selectIcon} />
        <select
          id="status"
          value={filters.status ?? "all"}
          onChange={(e) =>
            onFilterChange({
              status:
                e.target.value === "all"
                  ? undefined
                  : (e.target.value as "want" | "claimed"),
            })
          }
          className={styles.select}
          aria-label="Show status"
        >
          <option value="all">All</option>
          <option value="want">Wanted</option>
          <option value="claimed">Claimed</option>
        </select>
      </div>
      <div className={styles.selectWrapper}>
        <SortDescendingIcon size={18} className={styles.selectIcon} />
        <select
          id="sort"
          value={filters.sort ?? "date-desc"}
          onChange={(e) =>
            onFilterChange({ sort: e.target.value as ItemFilters["sort"] })
          }
          className={styles.select}
          aria-label="Sort by"
        >
          <option value="name-asc">Name ↑</option>
          <option value="name-desc">Name ↓</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="date-desc">Date ↓</option>
        </select>
      </div>
      <button
        className={`${styles.button} ${filters.claimedByMe ? styles.active : ""}`}
        onClick={() =>
          onFilterChange({
            claimedByMe: filters.claimedByMe ? undefined : true,
          })
        }
      >
        Claimed by me
      </button>
      {canEdit && (
        <button
          className={`${styles.button} ${filters.showArchived ? styles.active : ""}`}
          onClick={() =>
            onFilterChange({
              showArchived: filters.showArchived ? undefined : true,
            })
          }
        >
          Show archived
        </button>
      )}
    </>
  );
};

export { FilterControls };
