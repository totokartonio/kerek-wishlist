import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import styles from "./Privacy.module.css";

type Option = {
  badgeVariant: "primary" | "secondary" | "green";
  label: string;
  body: string;
};

const options: Option[] = [
  {
    badgeVariant: "secondary",
    label: "Private",
    body: "Only you can see and edit your wishlist.",
  },
  {
    badgeVariant: "primary",
    label: "Invite-only",
    body: "Anyone with your invite link can browse and claim gifts.",
  },
  {
    badgeVariant: "green",
    label: "Public",
    body: "Make your wishlist discoverable when you want to share widely.",
  },
];

const Privacy = () => {
  return (
    <Card variant="flat" color="secondary" className={styles.wrapper}>
      <span className={styles.eyebrow}>Privacy options</span>
      <h2 className={styles.title}>You choose who gets to peek.</h2>
      <div className={styles.grid}>
        {options.map((option) => (
          <Card key={option.label} variant="flat" color="neutral" className={styles.option}>
            <Badge variant={option.badgeVariant}>{option.label}</Badge>
            <p className={styles.body}>{option.body}</p>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export { Privacy };
