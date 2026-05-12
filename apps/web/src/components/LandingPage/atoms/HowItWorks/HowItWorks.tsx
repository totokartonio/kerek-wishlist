import Card from "../../../ui/Card";
import styles from "./HowItWorks.module.css";
import checklist from "../../../../assets/illustrations/checklist.png";
import heartHug from "../../../../assets/illustrations/heart-hug.png";
import phoneScrolling from "../../../../assets/illustrations/phone-scrolling.png";

type Step = {
  illustration: string;
  illustrationAlt: string;
  number: number;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    illustration: checklist,
    illustrationAlt: "Clay-style checklist with pencil",
    number: 1,
    title: "Create",
    body: "Add gift ideas, prices, links, notes, and icons. Make each list feel personal.",
  },
  {
    illustration: heartHug,
    illustrationAlt: "Clay character hugging a heart",
    number: 2,
    title: "Share",
    body: "Send a private invite link, add collaborators, or make the list public when everyone should see it.",
  },
  {
    illustration: phoneScrolling,
    illustrationAlt: "Clay character scrolling on phone with hearts and stars",
    number: 3,
    title: "Claim",
    body: "Friends can secretly claim gifts so nobody buys the same thing twice.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles.section}>
      <header className={styles.head}>
        <span className={styles.eyebrow}>How it works</span>
        <h2 className={styles.title}>
          Three simple steps, zero awkward gift coordination.
        </h2>
      </header>

      <div className={styles.grid}>
        {steps.map((step) => (
          <Card key={step.number} variant="flat" color="secondary" className={styles.step}>
            <div className={styles.illoWrap}>
              <img
                src={step.illustration}
                alt={step.illustrationAlt}
                className={`${styles.illo} ${styles[`illo${step.number}`]}`}
              />
            </div>
            <div className={styles.numberBadge}>{step.number}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepBody}>{step.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export { HowItWorks };
