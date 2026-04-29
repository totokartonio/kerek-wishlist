import { Button } from "../../../ui/Button/Button";
import type { Item } from "@wishlist/types";
import styles from "./ClaimButton.module.css";
import { GiftIcon } from "@phosphor-icons/react";

type Props = {
  item: Item;
  userId: string | null;
  onClaim: (id: string) => void;
  onUnclaim: (id: string) => void;
};

const ClaimButton = ({ item, userId, onClaim, onUnclaim }: Props) => {
  const claimedByMe =
    item.claimedByUserId !== null && item.claimedByUserId === userId;
  const claimedBySomeoneElse = item.status === "claimed" && !claimedByMe;

  return (
    <Button
      variant="ghost"
      color="primary"
      type="button"
      disabled={claimedBySomeoneElse}
      onClick={() => (claimedByMe ? onUnclaim(item.id) : onClaim(item.id))}
      data-testid="items-table-claim-button"
      className={styles.claimButton}
      size="sm"
    >
      <div className={styles.claimButtonContainer}>
        <GiftIcon size={18} className={styles.icon} />
        {claimedByMe ? "Unclaim" : claimedBySomeoneElse ? "Claimed" : "Claim"}
      </div>
    </Button>
  );
};

export { ClaimButton };
