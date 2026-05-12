import Card from "../../../ui/Card";
import {
  EyeSlashIcon,
  LinkIcon,
  UsersThreeIcon,
  CurrencyCircleDollarIcon,
} from "@phosphor-icons/react";
import styles from "./Features.module.css";

type Feature = {
  Icon: React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "fill" }>;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    Icon: EyeSlashIcon,
    title: "Surprise mode",
    body: "The wishlist owner sees what's on the list, but not who claimed each gift.",
  },
  {
    Icon: LinkIcon,
    title: "Easy link sharing",
    body: "One simple invite link. Perfect for group chats, families, and last-minute planners.",
  },
  {
    Icon: UsersThreeIcon,
    title: "Collaborators",
    body: "Add people who can help manage the wishlist for weddings, holidays, baby showers, or shared events.",
  },
  {
    Icon: CurrencyCircleDollarIcon,
    title: "Multi-currency",
    body: "Add prices in different currencies, so international friends can choose comfortably.",
  },
];

const Features = () => {
  return (
    <section className={styles.section}>
      <Card variant="flat" color="primary" className={styles.intro}>
        <span className={styles.eyebrow}>Made for real moments</span>
        <h2 className={styles.title}>Soft on the outside. Smart on the inside.</h2>
        <p className={styles.body}>
          Kérek keeps gift planning simple without making it feel like another
          productivity tool.
        </p>
      </Card>

      <div className={styles.grid}>
        {features.map(({ Icon, title, body }) => (
          <Card key={title} variant="flat" color="secondary" className={styles.feature}>
            <div className={styles.iconCircle}>
              <Icon size={22} weight="bold" />
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureBody}>{body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export { Features };
