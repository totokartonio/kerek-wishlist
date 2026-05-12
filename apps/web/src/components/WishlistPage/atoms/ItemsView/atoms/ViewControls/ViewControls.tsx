import { useIsMobile } from "../../../../../../hooks/ui/useIsMobile";
import type { ItemFilters } from "@wishlist/types";
import styles from "./ViewControls.module.css";
import { TableIcon } from "@phosphor-icons/react";
import { SquaresFourIcon } from "@phosphor-icons/react";
import { FadersHorizontalIcon } from "@phosphor-icons/react";
import { Button } from "../../../../../ui/Button/Button";
import { useState } from "react";
import { FilterControls } from "../FilterControls";
import { FilterModal } from "../FilterModal";

type Props = {
  viewMode: "table" | "grid";
  onViewChange: (mode: "table" | "grid") => void;
  filters: ItemFilters;
  onFilterChange: (updates: Partial<ItemFilters>) => void;
  onClearFilters: () => void;
  canEdit: boolean;
};

const ViewControls = ({
  viewMode,
  onViewChange,
  filters,
  onFilterChange,
  onClearFilters,
  canEdit,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const isMobile = useIsMobile();
  const hasActiveFilters = !!(
    filters.status ||
    filters.claimedByMe ||
    filters.showArchived ||
    filters.sort
  );
  return (
    <>
      {isMobile ? (
        <>
          <div className={styles.mobileBar}>
            <Button
              variant="ghost"
              color="primary"
              className={styles.mobileButton}
              size="sm"
              onClick={() => setShowModal(!showModal)}
            >
              <FadersHorizontalIcon />
              <span>Filters</span>
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                color="secondary"
                size="sm"
                onClick={onClearFilters}
                className={styles.mobileButton}
              >
                Clear
              </Button>
            )}
          </div>
          {showModal && (
            <FilterModal
              filters={filters}
              onFilterChange={onFilterChange}
              onClose={() => setShowModal(false)}
              canEdit={canEdit}
            />
          )}
        </>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.viewToggle}>
            <div
              className={`${styles.indicator} ${viewMode === "grid" ? styles.indicatorRight : ""}`}
            />
            <button
              className={styles.toggleOption}
              onClick={() => onViewChange("table")}
            >
              <TableIcon size={18} />
              <span>Table</span>
            </button>
            <button
              className={styles.toggleOption}
              onClick={() => onViewChange("grid")}
            >
              <SquaresFourIcon size={18} />
              <span>Grid</span>
            </button>
          </div>
          <FilterControls
            filters={filters}
            onFilterChange={onFilterChange}
            canEdit={canEdit}
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              color="secondary"
              size="sm"
              onClick={onClearFilters}
              className={styles.clearButton}
            >
              Clear
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export { ViewControls };
