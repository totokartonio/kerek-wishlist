import { type Message } from "../../SettingsPage";
import { useState, type SubmitEventHandler } from "react";
import styles from "../../SettingsPage.module.css";
import ConfirmationModal from "../../../ui/ConfirmationModal";
import Card from "../../../ui/Card";
import Input from "../../../ui/Input";
import { Button } from "../../../ui/Button/Button";
import { checkEmail } from "../../../../api/users";

type Props = {
  currentName: string | undefined;
  currentEmail: string | undefined;
  onChangeName: (name: string | undefined) => void;
  onChangeEmail: (email: string | undefined) => void;
  setMessage: (message: Message) => void;
};

type ModalMode = "name" | "email" | null;

const Account = ({
  currentEmail,
  currentName,
  onChangeName,
  onChangeEmail,
  setMessage,
}: Props) => {
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formName = event.currentTarget.name as ModalMode;

    if (formName === "email") {
      if (!email) return;
      if (email !== currentEmail) {
        const { taken } = await checkEmail(email);
        if (taken) {
          setMessage({ text: "This email is already taken", type: "error" });
          setTimeout(() => setMessage(null), 3000);
          return;
        }
      }
    }

    setModalMode(formName);
  };

  const handleChangeName = (name: string | undefined) => {
    onChangeName(name);
    setModalMode(null);
  };
  const handleChangeEmail = (email: string | undefined) => {
    onChangeEmail(email);
    setModalMode(null);
  };

  return (
    <section className={styles.section}>
      <h2>Account</h2>
      <Card variant="flat" color="primary" className={styles.card}>
        <form
          id="name"
          name="name"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.inputWrapper}>
            <Input
              type="text"
              id="name-input"
              label="Change your name:"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={styles.input}
            />
          </div>
          <Button
            variant="raised"
            color="primary"
            type="submit"
            disabled={!name}
          >
            Submit
          </Button>
        </form>
        <form
          id="email"
          name="email"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.inputWrapper}>
            <Input
              type="email"
              id="email-input"
              label="Change your email:"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={styles.input}
            />
          </div>
          <Button
            variant="raised"
            color="primary"
            type="submit"
            disabled={!email}
          >
            Submit
          </Button>
        </form>
      </Card>
      {modalMode === "name" && (
        <ConfirmationModal
          title="Changing Name"
          message="Are you sure you want to change your name?"
          onConfirm={() => handleChangeName(name)}
          onClose={() => setModalMode(null)}
        />
      )}
      {modalMode === "email" && (
        <ConfirmationModal
          title="Changing Email"
          message={
            <>
              Are you sure you want to change your email?
              <br />
              You'll be logged out after this action.
            </>
          }
          onConfirm={() => handleChangeEmail(email)}
          onClose={() => setModalMode(null)}
        />
      )}
    </section>
  );
};

export { Account };
