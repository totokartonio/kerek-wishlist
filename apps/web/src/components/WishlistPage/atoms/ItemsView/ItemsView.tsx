import type { Item, ItemFilters } from "@wishlist/types";
import ItemsTable from "../ItemsTable";
import ItemsGrid from "../ItemsGrid";
import { useViewMode } from "../../../../hooks/ui/useViewMode";
import { useIsMobile } from "../../../../hooks/ui/useIsMobile";
import ViewControls from "./atoms/ViewControls";
import styles from "./ItemsView.module.css";

type Props = {
  items: Item[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClaim: (id: string) => void;
  onUnclaim: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  userId: string | null;
  canEdit: boolean;
  showClaim: boolean;
  filters: ItemFilters;
  onFilterChange: (updates: Partial<ItemFilters>) => void;
  onClearFilters: () => void;
};

const ItemsView = ({
  items,
  onEdit,
  onDelete,
  onClaim,
  onUnclaim,
  onArchive,
  onUnarchive,
  userId,
  canEdit,
  showClaim,
  filters,
  onFilterChange,
  onClearFilters,
}: Props) => {
  const { viewMode, setView } = useViewMode();
  const isMobile = useIsMobile();
  const props = {
    items,
    onEdit,
    onDelete,
    onClaim,
    onUnclaim,
    onArchive,
    onUnarchive,
    userId,
    canEdit,
    showClaim,
  };

  const renderComponent = () => {
    if (isMobile) return <ItemsGrid {...props} />;
    return viewMode === "table" ? (
      <ItemsTable {...props} />
    ) : (
      <ItemsGrid {...props} />
    );
  };

  return (
    <>
      <ViewControls
        viewMode={viewMode}
        onViewChange={setView}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        canEdit={canEdit}
      />
      {items.length > 0 ? (
        renderComponent()
      ) : (
        <p className={styles.emptyState}>No wishes found.</p>
      )}
    </>
  );
};

export { ItemsView };
