import { useMemo } from "react";
import type { Item, ItemFilters } from "@wishlist/types";

export const useFilteredItems = (
  items: Item[],
  filters: ItemFilters,
  userId: string | null,
) => {
  return useMemo(() => {
    const active = items.filter((item) => !item.archived);
    const archived = items.filter((item) => item.archived);

    const applyFilters = (list: Item[]) => {
      return list.filter((item) => {
        if (filters.status && item.status !== filters.status) return false;
        if (filters.claimedByMe && item.claimedByUserId !== userId)
          return false;
        return true;
      });
    };

    const applySort = (list: Item[]) => {
      const sorted = [...list];
      sorted.sort((a, b) => {
        switch (filters.sort) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "price-asc": {
            if (!a.price && !b.price) return 0;
            if (!a.price) return 1;
            if (!b.price) return -1;
            return a.price - b.price;
          }
          case "price-desc": {
            if (!a.price && !b.price) return 0;
            if (!a.price) return 1;
            if (!b.price) return -1;
            return b.price - a.price;
          }
          case "date-asc":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "date-desc":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
      return sorted;
    };

    const filteredActive = applySort(applyFilters(active));
    const filteredArchived = filters.showArchived
      ? applySort(applyFilters(archived))
      : [];

    return [...filteredActive, ...filteredArchived];
  }, [items, filters, userId]);
};
