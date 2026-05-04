import { useState } from "react";

type ViewMode = "table" | "grid";

const STORAGE_KEY = "wishlist-view-mode";

const getInitialViewMode = (): ViewMode => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "table" || stored === "grid" ? stored : "table";
};

export const useViewMode = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);

  const setView = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return { viewMode, setView };
};
