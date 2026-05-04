import { useNavigate, useSearch } from "@tanstack/react-router";

type ItemFilters = {
  status?: "want" | "claimed";
  claimedByMe?: boolean;
  showArchived?: boolean;
  sort?:
    | "name-asc"
    | "name-desc"
    | "price-asc"
    | "price-desc"
    | "date-asc"
    | "date-desc";
};

export const useItemFilters = () => {
  const filters = useSearch({ from: "/wishlists/$wishlistId" });
  const navigate = useNavigate({ from: "/wishlists/$wishlistId" });

  const setFilter = (updates: Partial<ItemFilters>) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
    });
  };

  const clearFilters = () => {
    navigate({
      search: {},
    });
  };

  return { filters, setFilter, clearFilters };
};
