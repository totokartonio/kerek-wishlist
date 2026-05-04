import type { ItemFilters } from "@wishlist/types";
import Modal from "../../../../../ui/Modal";
import Select from "../../../../../ui/Select";
import styles from "./FilterModal.module.css";
import { Button } from "../../../../../ui/Button/Button";

type Props = {
  filters: ItemFilters;
  onFilterChange: (updates: Partial<ItemFilters>) => void;
  onClose: () => void;
  canEdit: boolean;
};

const FilterModal = ({ filters, onFilterChange, onClose, canEdit }: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2>Filters</h2>
      <div className={styles.controls}>
        <Select
          id="status"
          label="Show"
          value={filters.status ?? "all"}
          onChange={(e) =>
            onFilterChange({
              status:
                e.target.value === "all"
                  ? undefined
                  : (e.target.value as "want" | "claimed"),
            })
          }
        >
          <option value="all">All</option>
          <option value="want">Wanted</option>
          <option value="claimed">Claimed</option>
        </Select>
        <Select
          id="sort"
          label="Sort by"
          value={filters.sort ?? "date-desc"}
          onChange={(e) =>
            onFilterChange({ sort: e.target.value as ItemFilters["sort"] })
          }
        >
          <option value="name-asc">Name ↑</option>
          <option value="name-desc">Name ↓</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="date-desc">Date ↓</option>
        </Select>
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
        <Button
          variant="flat"
          color="primary"
          onClick={onClose}
          className={styles.applyButton}
        >
          Apply
        </Button>
      </div>
    </Modal>
  );
};

export { FilterModal };
