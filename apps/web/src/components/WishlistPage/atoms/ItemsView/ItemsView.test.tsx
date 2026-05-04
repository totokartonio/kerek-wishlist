import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ItemsView } from "./ItemsView";
import { renderWithClient } from "../../../../test/utils";
import type { Item, ItemFilters } from "@wishlist/types";

vi.mock("../../../../hooks/ui/useViewMode", () => ({
  useViewMode: () => ({ viewMode: "table", setView: vi.fn() }),
}));

vi.mock("../../../../hooks/ui/useIsMobile", () => ({
  useIsMobile: vi.fn(),
}));

vi.mock("./atoms/ViewControls", () => ({
  default: () => <div data-testid="view-controls" />,
}));

vi.mock("../ItemsTable", () => ({
  default: ({ items }: { items: Item[] }) => (
    <div data-testid="items-table">
      {items.map((i) => (
        <div key={i.id}>{i.name}</div>
      ))}
    </div>
  ),
}));

vi.mock("../ItemsGrid", () => ({
  default: ({ items }: { items: Item[] }) => (
    <div data-testid="items-grid">
      {items.map((i) => (
        <div key={i.id}>{i.name}</div>
      ))}
    </div>
  ),
}));

import { useIsMobile } from "../../../../hooks/ui/useIsMobile";

const baseItem: Item = {
  id: "1",
  name: "Test Item",
  price: 10,
  currency: "USD",
  link: "",
  image: "Image",
  status: "want",
  archived: false,
  claimedByUserId: null,
  createdAt: "2024-01-01T00:00:00.000Z",
};

const defaultProps = {
  items: [baseItem],
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onClaim: vi.fn(),
  onUnclaim: vi.fn(),
  onArchive: vi.fn(),
  onUnarchive: vi.fn(),
  userId: "user-1",
  canEdit: true,
  showClaim: true,
  filters: {} as ItemFilters,
  onFilterChange: vi.fn(),
  onClearFilters: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useIsMobile).mockReturnValue(false);
});

describe("ItemsView", () => {
  test("renders view controls", () => {
    renderWithClient(<ItemsView {...defaultProps} />);
    expect(screen.getByTestId("view-controls")).toBeInTheDocument();
  });

  test("renders items table on desktop", () => {
    vi.mocked(useIsMobile).mockReturnValue(false);
    renderWithClient(<ItemsView {...defaultProps} />);
    expect(screen.getByTestId("items-table")).toBeInTheDocument();
    expect(screen.queryByTestId("items-grid")).not.toBeInTheDocument();
  });

  test("renders items grid on mobile", () => {
    vi.mocked(useIsMobile).mockReturnValue(true);
    renderWithClient(<ItemsView {...defaultProps} />);
    expect(screen.getByTestId("items-grid")).toBeInTheDocument();
    expect(screen.queryByTestId("items-table")).not.toBeInTheDocument();
  });

  test("renders items in the table", () => {
    renderWithClient(<ItemsView {...defaultProps} />);
    expect(screen.getByText("Test Item")).toBeInTheDocument();
  });

  test("shows empty state when items array is empty", () => {
    renderWithClient(<ItemsView {...defaultProps} items={[]} />);
    expect(screen.getByText("No wishes found.")).toBeInTheDocument();
    expect(screen.queryByTestId("items-table")).not.toBeInTheDocument();
    expect(screen.queryByTestId("items-grid")).not.toBeInTheDocument();
  });

  test("still renders view controls when items are empty", () => {
    renderWithClient(<ItemsView {...defaultProps} items={[]} />);
    expect(screen.getByTestId("view-controls")).toBeInTheDocument();
  });
});
