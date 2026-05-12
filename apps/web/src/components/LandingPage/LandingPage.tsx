import styles from "./LandingPage.module.css";
import Hero from "./atoms/Hero";
import HowItWorks from "./atoms/HowItWorks";
import Features from "./atoms/Features";
import Privacy from "./atoms/Privacy";
import FinalCTA from "./atoms/FinalCTA";

const LandingPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.page}>
        <Hero />
        <HowItWorks />
        <Features />
        <Privacy />
        <FinalCTA />
      </div>
    </div>
  );
};

export { LandingPage };
