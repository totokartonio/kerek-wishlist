import { useState, type SubmitEventHandler } from "react";
import styles from "../../SettingsPage.module.css";
import ConfirmationModal from "../../../ui/ConfirmationModal";
import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import { Button } from "../../../ui/Button/Button";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";

type Props = {
  onChangePassword: (
    currentPassword: string | undefined,
    newPassword: string | undefined,
  ) => void;
  onDelete: () => void;
};

type ModalMode = "password" | "delete" | null;

const Security = ({ onChangePassword, onDelete }: Props) => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const rightElement = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      data-testid="show-password"
      className={styles.iconButton}
    >
      {showPassword ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
    </button>
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formName = event.currentTarget.name as ModalMode;
    setModalMode(formName);
  };

  const handleChangePassword = (
    currentPassword: string | undefined,
    newPassword: string | undefined,
  ) => {
    onChangePassword(currentPassword, newPassword);
    setModalMode(null);
  };

  const handleDelete = () => {
    onDelete();
    setModalMode(null);
  };

  return (
    <section className={styles.section}>
      <h2>Security</h2>
      <Card variant="flat" color="secondary" className={styles.card}>
        <h3>Change Password</h3>
        <form
          id="password"
          name="password"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.inputWrapper}>
            <Input
              type={showPassword ? "text" : "password"}
              id="current-password-input"
              label="Enter your current password:"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={styles.input}
              rightElement={rightElement}
            />
            <Input
              type={showPassword ? "text" : "password"}
              id="new-password-input"
              label="Enter your new password:"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={styles.input}
              rightElement={rightElement}
            />
          </div>
          <Button
            variant="raised"
            color="secondary"
            type="submit"
            disabled={!currentPassword || !newPassword}
          >
            Submit
          </Button>
        </form>
        <Button
          variant="raised"
          color="secondary"
          className={styles.deleteButton}
          onClick={() => setModalMode("delete")}
        >
          Delete Account
        </Button>
      </Card>
      {modalMode === "password" && (
        <ConfirmationModal
          title="Changing Password"
          message={
            <>
              Are you sure you want to change your password?
              <br />
              You'll be logged out after this action.
            </>
          }
          onConfirm={() => handleChangePassword(currentPassword, newPassword)}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === "delete" && (
        <ConfirmationModal
          title="Delete Account"
          message={
            <>
              Are you sure you want to delete your account?
              <br />
              All wishlists created by you will be deleted.
              <br />
              This cannot be undone.
            </>
          }
          onConfirm={handleDelete}
          onClose={() => setModalMode(null)}
        />
      )}
    </section>
  );
};

export { Security };
