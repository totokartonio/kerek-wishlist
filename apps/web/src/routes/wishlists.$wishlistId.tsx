import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import Wishlist from "../components/WishlistPage";

const searchSchema = z.object({
  status: z.enum(["want", "claimed"]).optional(),
  claimedByMe: z.boolean().optional(),
  showArchived: z.boolean().optional(),
  sort: z
    .enum([
      "name-asc",
      "name-desc",
      "price-asc",
      "price-desc",
      "date-asc",
      "date-desc",
    ])
    .optional(),
});

export const Route = createFileRoute("/wishlists/$wishlistId")({
  validateSearch: zodValidator(searchSchema),
  component: RouteComponent,
});

function RouteComponent() {
  const { wishlistId } = Route.useParams();
  return <Wishlist wishlistId={wishlistId} />;
}
