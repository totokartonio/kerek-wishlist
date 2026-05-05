import { type Item } from "@wishlist/types";
import styles from "./ItemsTable.module.css";
import { CURRENCY_SYMBOLS } from "../../../../data";
import ClaimButton from "../ClaimButton";
import Actions from "../Actions";

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
  className?: string;
};

const ItemsTable = ({
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
  className,
}: Props) => {
  return (
    <div
      className={`${styles.wrapper} ${className ?? ""}`}
      data-testid="items-table-wrapper"
    >
      <table className={styles.table}>
        <thead>
          <tr data-testid="items-table-header-row">
            <th aria-label="Preview" className={styles.previewCell} />
            <th className={styles.nameCell}>Name</th>
            <th className={styles.priceCell}>Price</th>
            {showClaim && <th className={styles.statusCell}>Status</th>}
            <th className={styles.linkCell}>Link</th>
            {canEdit && <th className={styles.actionsCell}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              data-testid="items-table-body-row"
              className={item.archived ? styles.archived : ""}
            >
              <td className={styles.previewCell}>
                <div className={styles.previewWrapper}>
                  <div className={styles.placeholder} />
                </div>
              </td>
              <td className={styles.nameCell}>{item.name}</td>
              <td className={styles.priceCell}>
                {item.price === 0 && !item.currency
                  ? "—"
                  : item.currency
                    ? CURRENCY_SYMBOLS[item.currency] + item.price
                    : item.price}
              </td>
              {showClaim && (
                <td className={styles.statusCell}>
                  <ClaimButton
                    item={item}
                    userId={userId}
                    onClaim={onClaim}
                    onUnclaim={onUnclaim}
                  />
                </td>
              )}
              <td className={styles.linkCell}>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    data-testid="items-table-link"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  "—"
                )}
              </td>
              {canEdit && (
                <td className={styles.actionsCell}>
                  <Actions
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onUnarchive={onUnarchive}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ItemsTable };
