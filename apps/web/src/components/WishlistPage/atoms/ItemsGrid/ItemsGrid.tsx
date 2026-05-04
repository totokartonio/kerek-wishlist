import styles from "./ItemsGrid.module.css";
import { type Item } from "@wishlist/types";
import { CURRENCY_SYMBOLS } from "../../../../data";
import Card from "../../../ui/Card";
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

const ItemsGrid = ({
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
    <div className={`${styles.grid} ${className ?? ""}`}>
      {items.map((item) => (
        <Card
          variant="flat"
          color={item.archived ? "neutral" : "secondary"}
          key={item.id}
          className={`${styles.card} ${item.archived ? styles.archived : ""}`}
        >
          <div className={styles.placeholder} />
          <div className={styles.content}>
            <div className={styles.row}>
              <strong className={styles.name}>{item.name}</strong>
              {item.price > 0 && (
                <span>
                  {item.currency
                    ? CURRENCY_SYMBOLS[item.currency] + item.price
                    : item.price}
                </span>
              )}
            </div>
            <div className={styles.linkRow}>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Open
                </a>
              )}
            </div>
            <div className={styles.actionsRow}>
              {showClaim && (
                <ClaimButton
                  item={item}
                  userId={userId}
                  onClaim={onClaim}
                  onUnclaim={onUnclaim}
                  fontSize="xs"
                  iconSize={16}
                />
              )}
              <div className={styles.actions}>
                {canEdit && (
                  <Actions
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onUnarchive={onUnarchive}
                    iconSize={20}
                    space="sm"
                  />
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export { ItemsGrid };
