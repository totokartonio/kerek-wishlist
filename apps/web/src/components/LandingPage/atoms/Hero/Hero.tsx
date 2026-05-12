import { LinkButton } from "../../../ui/Button/LinkButton";
import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import styles from "./Hero.module.css";
import coffeeMug from "../../../../assets/illustrations/coffee-mug.png";
import priceTag from "../../../../assets/illustrations/price-tag.png";
import book from "../../../../assets/illustrations/book.png";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <div className={styles.eyebrow}>Built for real gift moments</div>
        <h1 className={styles.title}>
          Share your wishlist.
          <br />
          Skip the duplicate gifts.
        </h1>
        <p className={styles.subtitle}>
          Create warm, personal wishlists for birthdays, holidays, weddings, or
          just-because moments. Share them with family and friends — they can
          claim gifts secretly, so the surprise stays alive.
        </p>
        <div className={styles.ctaRow}>
          <LinkButton to="/login" variant="raised" color="primary">
            Create your wishlist
          </LinkButton>
          <a href="#how-it-works" className={styles.ghostLink}>
            See how it works
          </a>
        </div>
        <ul className={styles.pills}>
          <li>No duplicate gifts</li>
          <li>Secret claiming</li>
          <li>Invite links</li>
        </ul>
      </div>

      <div className={styles.visual}>
        <Card variant="raised" color="primary" className={styles.mockCard}>
          <div className={styles.mockHeader}>
            <Badge variant="secondary">Invite-only</Badge>
            <span className={styles.mockDots} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <h3 className={styles.mockTitle}>Anna's Birthday</h3>
          <ul className={styles.mockItems}>
            <li className={styles.mockItem}>
              <span className={styles.mockThumb}>
                <img src={coffeeMug} alt="" className={styles.mockThumbImg} />
              </span>
              <span className={styles.mockItemName}>Vintage coffee cups</span>
              <Badge variant="secondary">Claimed</Badge>
            </li>
            <li className={styles.mockItem}>
              <span className={styles.mockThumb}>
                <img src={priceTag} alt="" className={styles.mockThumbImg} />
              </span>
              <span className={styles.mockItemName}>Silk scarf</span>
              <Badge variant="primary">Available</Badge>
            </li>
            <li className={styles.mockItem}>
              <span className={styles.mockThumb}>
                <img src={book} alt="" className={styles.mockThumbImg} />
              </span>
              <span className={styles.mockItemName}>Book voucher</span>
              <Badge variant="secondary">Claimed</Badge>
            </li>
          </ul>
        </Card>

        <Card
          variant="flat"
          color="neutral"
          className={`${styles.note} ${styles.noteShared}`}
        >
          <span className={styles.noteLabel}>Shared with</span>
          <strong>Family, friends &amp; collaborators</strong>
        </Card>

        <Card
          variant="flat"
          color="secondary"
          className={`${styles.note} ${styles.noteSurprise}`}
        >
          <span className={styles.noteLabel}>Surprise mode</span>
          <strong>Owner can't see who claimed what</strong>
        </Card>
      </div>
    </section>
  );
};

export { Hero };
