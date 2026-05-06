import {
  type Wishlist,
  type WishlistVisibility,
  WISHLIST_VISIBILITY,
  type CreateWishlistDto,
} from "@wishlist/types";
import { WISHLIST_ICONS } from "@wishlist/icons";
import Modal from "../ui/Modal";
import { useState, type SubmitEventHandler } from "react";
import styles from "./WishlistModal.module.css";
import { Button } from "../ui/Button/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import IconPicker from "../ui/IconPicker";
import { WISHLIST_ICON_MAP } from "../../lib/wishlistIconMap";

type Props = {
  onClose: () => void;
} & (
  | {
      mode: "add";
      onAdd: (wishlist: CreateWishlistDto) => void;
      wishlist?: never;
      onUpdate?: never;
    }
  | {
      mode: "edit";
      wishlist: Wishlist;
      onUpdate: (wishlist: Wishlist) => void;
      onAdd?: never;
    }
);

type FormData = {
  name: string;
  icon: string;
  description: string;
  visibility: WishlistVisibility;
  hideClaimsFromOwner: boolean;
};

const randomIcon = () =>
  WISHLIST_ICONS[Math.floor(Math.random() * WISHLIST_ICONS.length)];

const WishlistModal = ({ onClose, mode, wishlist, onAdd, onUpdate }: Props) => {
  const [formData, setFormData] = useState<FormData>(
    mode === "edit"
      ? {
          name: wishlist.name,
          icon: wishlist.icon,
          description: wishlist.description ?? "",
          visibility: wishlist.visibility,
          hideClaimsFromOwner: wishlist.hideClaimsFromOwner,
        }
      : {
          name: "",
          icon: randomIcon(),
          description: "",
          visibility: "private",
          hideClaimsFromOwner: true,
        },
  );
  const [error, setError] = useState<boolean>(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.visibility) {
      setError(true);
      return;
    }

    if (mode === "edit") {
      onUpdate({ ...wishlist, ...formData });
      return;
    }

    onAdd({
      name: formData.name,
      icon: formData.icon,
      description: formData.description || undefined,
      visibility: formData.visibility,
      hideClaimsFromOwner: formData.hideClaimsFromOwner,
    });

    setFormData({
      name: "",
      icon: randomIcon(),
      description: "",
      visibility: "private",
      hideClaimsFromOwner: true,
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2>{mode === "edit" ? "Edit Wishlist" : "New Wishlist"}</h2>
        {error && (
          <div
            role="alert"
            className={styles.formError}
            data-testid="error-message"
          >
            Please fill all fields
          </div>
        )}
        <div className={styles.iconRow}>
          <IconPicker
            icons={WISHLIST_ICONS}
            iconMap={WISHLIST_ICON_MAP}
            value={formData.icon}
            onChange={(slug) => setFormData({ ...formData, icon: slug })}
          />
        </div>
        <Input
          label="Name:"
          type="text"
          id="wishlist-name"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          onBlur={() => setError(false)}
          required
        />
        <Input
          label="Description:"
          type="text"
          id="wishlist-description"
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
          onBlur={() => setError(false)}
        />
        <Select
          label="Who can see your wishlist?"
          id="wishlist-visibility"
          value={formData.visibility}
          onChange={(event) =>
            setFormData({
              ...formData,
              visibility: event.target.value as WishlistVisibility,
            })
          }
        >
          {WISHLIST_VISIBILITY.map((visibility) => (
            <option key={visibility} value={visibility}>
              {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            </option>
          ))}
        </Select>
        <Select
          label="Surprise mode — hide claimed items from me:"
          id="wishlist-surprise"
          value={String(formData.hideClaimsFromOwner)}
          onChange={(event) =>
            setFormData({
              ...formData,
              hideClaimsFromOwner: event.target.value === "true",
            })
          }
        >
          <option value={"true"}>Yes, hide what wishes was claimed</option>
          <option value={"false"}>No, I want to see claimed wishes</option>
        </Select>
        <Button variant="flat" color="primary" type="submit">
          {mode === "edit" ? "Save Changes" : "Add Wishlist"}
        </Button>
      </form>
    </Modal>
  );
};

export { WishlistModal };
