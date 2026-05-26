import styles from "./ItemModal.module.css";
import { useState, useRef, type SubmitEventHandler } from "react";
import { CURRENCIES, type CreateItemDto } from "@wishlist/types";
import type { Currency, Item } from "@wishlist/types";
import Modal from "../../../ui/Modal";
import { Button } from "../../../ui/Button/Button";
import Select from "../../../ui/Select";
import Input from "../../../ui/Input";
import { uploadImage } from "../../../../api/cloudinary";

type FormData = {
  name: string;
  price: string;
  currency: Currency | null;
  link: string;
};

type ImageState =
  | { type: "existing"; url: string }
  | { type: "new"; file: File; preview: string }
  | { type: "removed" }
  | { type: "none" };

type Props = {
  onClose: () => void;
} & (
  | {
      mode: "add";
      onAdd: (item: CreateItemDto) => Promise<string>;
      onUploadImage: (itemId: string, file: File) => Promise<void>;
      item?: never;
      onUpdate?: never;
      canEdit?: never;
      onResetClaim?: never;
      onArchive?: never;
      onUnarchive?: never;
    }
  | {
      mode: "edit";
      onUpdate: (item: Item) => void;
      item: Item;
      canEdit: boolean;
      onResetClaim: () => void;
      onArchive: () => void;
      onUnarchive: () => void;
      onAdd?: never;
      onUploadImage?: never;
    }
);

const defaultFormData: FormData = {
  name: "",
  price: "",
  currency: null,
  link: "",
};

const ItemModal = ({
  mode,
  item,
  canEdit,
  onAdd,
  onUploadImage,
  onUpdate,
  onClose,
  onResetClaim,
  onArchive,
  onUnarchive,
}: Props) => {
  const [formData, setFormData] = useState<FormData>(
    mode === "edit"
      ? {
          name: item.name,
          price: item.price === 0 ? "" : String(item.price),
          currency: item.currency,
          link: item.link,
        }
      : defaultFormData,
  );
  const [imageState, setImageState] = useState<ImageState>(
    mode === "edit" && item.image
      ? { type: "existing", url: item.image }
      : { type: "none" },
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = mode === "edit";
  const title = isEditing ? "Edit Wish" : "New Wish";
  const buttonText = isEditing ? "Save Changes" : "Add Wish";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPEG, PNG and WebP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be under 5MB");
      return;
    }
    setImageError(null);

    const preview = URL.createObjectURL(file);
    setImageState({ type: "new", file, preview });
  };

  const handleRemoveImage = () => {
    if (imageState.type === "new") {
      URL.revokeObjectURL(imageState.preview);
    }
    setImageState({ type: "removed" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!formData.name) {
      setError(true);
      return;
    }

    setUploading(true);

    try {
      if (isEditing && item) {
        let imageUrl: string | null = item.image;

        if (imageState.type === "new") {
          imageUrl = await uploadImage(imageState.file);
        } else if (imageState.type === "removed") {
          imageUrl = null;
        } else if (imageState.type === "existing") {
          imageUrl = imageState.url;
        }

        const updatedItem: Item = {
          ...item,
          ...formData,
          price: formData.price === "" ? 0 : Number(formData.price),
          image: imageUrl,
        };

        onUpdate(updatedItem);
        onClose();
        return;
      }

      const newItem: CreateItemDto = {
        status: "want",
        ...formData,
        price: formData.price === "" ? 0 : Number(formData.price),
      };

      const itemId = await onAdd(newItem);

      if (imageState.type === "new" && onUploadImage) {
        await onUploadImage(itemId, imageState.file);
      }

      setFormData(defaultFormData);
      setImageState({ type: "none" });
      onClose();
    } finally {
      setUploading(false);
    }
  };

  const previewUrl =
    imageState.type === "existing"
      ? imageState.url
      : imageState.type === "new"
        ? imageState.preview
        : null;

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h2>{title}</h2>
        {error && (
          <div
            role="alert"
            className={styles.formError}
            data-testid="error-message"
          >
            Please fill all fields
          </div>
        )}
        <div className={styles.imageSection}>
          <div
            className={styles.imagePreview}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && fileInputRef.current?.click()
            }
            aria-label="Upload image"
          >
            {previewUrl ? (
              <img
                src={previewUrl ?? ""}
                alt="Item preview"
                className={styles.previewImg}
              />
            ) : (
              <div className={styles.imagePlaceholder} />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className={styles.hiddenInput}
            aria-label="Image file input"
          />
          {(imageState.type === "existing" || imageState.type === "new") && (
            <Button
              variant="ghost"
              color="secondary"
              type="button"
              onClick={handleRemoveImage}
              className={styles.removeImageButton}
            >
              Remove image
            </Button>
          )}
        </div>
        {imageError && <p className={styles.imageError}>{imageError}</p>}
        <Input
          label="Name:"
          type="text"
          id="item-name"
          data-testid="add-item-modal-name-input"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          onBlur={() => setError(false)}
          required
          className={styles.input}
        />
        <Input
          label="Price:"
          type="number"
          min={0}
          step={0.01}
          id="item-price"
          data-testid="add-item-modal-price-input"
          value={formData.price}
          onChange={(event) =>
            setFormData({ ...formData, price: event.target.value })
          }
          onBlur={() => setError(false)}
        />
        <Select
          label="Currency:"
          id="item-currency"
          data-testid="add-item-modal-currency-select"
          value={formData.currency ?? ""}
          onChange={(event) =>
            setFormData({
              ...formData,
              currency:
                event.target.value === ""
                  ? null
                  : (event.target.value as Currency),
            })
          }
          onBlur={() => setError(false)}
          required
        >
          <option value="">—</option>
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
        <Input
          label="Link:"
          type="text"
          id="item-link"
          data-testid="add-item-modal-link-input"
          value={formData.link}
          onChange={(event) =>
            setFormData({ ...formData, link: event.target.value })
          }
          onBlur={() => setError(false)}
        />
        {isEditing && canEdit && (
          <>
            {confirmingReset ? (
              <div className={styles.claimReset}>
                <p className={styles.message}>
                  This will release the current claim. Are you sure?
                </p>
                <div className={styles.buttonGroup}>
                  <Button
                    variant="ghost"
                    color="primary"
                    type="button"
                    onClick={() => {
                      onResetClaim();
                      setConfirmingReset(false);
                    }}
                  >
                    Yes, release claim
                  </Button>
                  <Button
                    variant="flat"
                    color="secondary"
                    type="button"
                    onClick={() => setConfirmingReset(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.claimReset}>
                <p className={styles.message}>
                  If the wish was claimed, this will release it.
                </p>
                <div className={styles.buttonGroup}>
                  <Button
                    variant="ghost"
                    color="primary"
                    type="button"
                    onClick={() => setConfirmingReset(true)}
                  >
                    Reset claim
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {(!isEditing || canEdit) && (
          <div className={styles.footer}>
            <div className={styles.buttonGroup}>
              {isEditing && (
                <Button
                  variant="flat"
                  color="secondary"
                  type="button"
                  onClick={item.archived ? onUnarchive : onArchive}
                >
                  {item.archived ? "Unarchive" : "Archive"}
                </Button>
              )}
              <Button
                variant="flat"
                color="primary"
                type="submit"
                data-testid="add-item-modal-submit-button"
                disabled={uploading}
              >
                {uploading ? "Saving..." : buttonText}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export { ItemModal };
