import styles from "./SettingsPage.module.css";
import { useState } from "react";
import { useSession, signOut } from "../../lib/auth-client";
import { authClient } from "../../lib/auth-client";
import Account from "./atoms/Account";
import Security from "./atoms/Security";
import { useGetUser } from "../../hooks/users/useGetUser";
import { useUpdateAvatar } from "../../hooks/users/useUpdateAvatar";

export type Message = { text: string; type: "success" | "error" } | null;

const SettingsPage = () => {
  const { data: session } = useSession();
  const userName = session?.user.name;
  const userEmail = session?.user.email;
  const [message, setMessage] = useState<Message>(null);

  const { data: user } = useGetUser(session?.user.id ?? "", !!session);
  const { mutate: updateAvatar } = useUpdateAvatar();

  const handleChangeName = async (name: string | undefined) => {
    const { error } = await authClient.updateUser({ name });
    if (error) {
      setMessage({
        text: error.message ?? "Failed to change name",
        type: "error",
      });
    } else {
      setMessage({ text: "Name successfully changed", type: "success" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangeEmail = async (email: string | undefined) => {
    if (!email) {
      setMessage({ text: "Failed to change email", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (email === userEmail) {
      setMessage({
        text: "This is already your current email",
        type: "error",
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    const { error } = await authClient.changeEmail({ newEmail: email });
    if (error) {
      setMessage({
        text: error.message ?? "Failed to change email",
        type: "error",
      });
    } else {
      setMessage({ text: "Email successfully changed", type: "success" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await signOut();
      window.location.href = "/login";
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangePassword = async (
    currentPassword: string | undefined,
    newPassword: string | undefined,
  ) => {
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Failed to change password", type: "error" });
      return;
    }
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
    });
    if (error) {
      setMessage({
        text: error.message ?? "Failed to change password",
        type: "error",
      });
    } else {
      setMessage({ text: "Password successfully changed", type: "success" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await signOut();
      window.location.href = "/login";
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleChangeAvatar = (avatar: string) => {
    updateAvatar(avatar, {
      onSuccess: () =>
        setMessage({ text: "Avatar successfully changed", type: "success" }),
      onError: () =>
        setMessage({ text: "Failed to change avatar", type: "error" }),
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async () => {
    const { error } = await authClient.deleteUser();
    if (error) {
      setMessage({
        text: error.message ?? "Failed to delete user",
        type: "error",
      });
    } else {
      window.location.href = "/login";
    }
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className={styles.wrapper}>
      <h1>Settings</h1>
      {message && (
        <p
          className={`${styles.message} ${message.type === "success" ? styles.success : styles.error}`}
        >
          {message.text}
        </p>
      )}
      <Account
        currentName={userName}
        currentEmail={userEmail}
        currentAvatar={user?.avatar ?? null}
        onChangeName={handleChangeName}
        onChangeEmail={handleChangeEmail}
        onChangeAvatar={handleChangeAvatar}
        setMessage={setMessage}
      />
      <Security
        onChangePassword={handleChangePassword}
        onDelete={handleDelete}
      />
    </div>
  );
};

export { SettingsPage };
