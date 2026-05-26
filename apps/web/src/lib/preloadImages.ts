import Book from "../assets/illustrations/book.png";
import Character404 from "../assets/illustrations/character-404.png";
import Checklist from "../assets/illustrations/checklist.png";
import CoffeeMug from "../assets/illustrations/coffee-mug.png";
import EmptyInbox from "../assets/illustrations/empty-inbox.png";
import HeartHug from "../assets/illustrations/heart-hug.png";
import PhoneScrolling from "../assets/illustrations/phone-scrolling.png";
import PriceTag from "../assets/illustrations/price-tag.png";
import ProblemSolver from "../assets/illustrations/problem-solver.png";
import StartYourTask from "../assets/illustrations/start-your-task.png";
import Surprised from "../assets/illustrations/surprised.png";
import Unauthorized from "../assets/illustrations/unauthorized.png";
import { AVATAR_ICON_MAP } from "./avatarIconMap";
import { WISHLIST_ICON_MAP } from "./wishlistIconMap";

const preloadImages = [
  Book,
  Character404,
  Checklist,
  CoffeeMug,
  EmptyInbox,
  HeartHug,
  PhoneScrolling,
  PriceTag,
  ProblemSolver,
  StartYourTask,
  Surprised,
  Unauthorized,
  ...Object.values(AVATAR_ICON_MAP),
  ...Object.values(WISHLIST_ICON_MAP),
];

preloadImages.forEach((src) => {
  const img = new Image();
  img.src = src;
});
