// src/components/WishlistPage/atoms/ItemsGrid/ItemsGrid.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { ItemsGrid } from "./ItemsGrid";
import type { Item } from "@wishlist/types";

const baseItem: Item = {
  id: "1",
  name: "Sony headphones",
  price: 100,
  currency: "USD",
  link: "https://amazon.de",
  image: "Image",
  status: "want",
  archived: false,
  claimedByUserId: null,
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
};

describe("ItemsGrid", () => {
  test("renders item name and price", () => {
    render(<ItemsGrid {...defaultProps} />);

    expect(screen.getByText("Sony headphones")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  test("renders item link", () => {
    render(<ItemsGrid {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://amazon.de");
  });

  test("does not render link when item has no link", () => {
    render(<ItemsGrid {...defaultProps} items={[{ ...baseItem, link: "" }]} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  test("does not render price when price is 0", () => {
    render(
      <ItemsGrid
        {...defaultProps}
        items={[{ ...baseItem, price: 0, currency: null }]}
      />,
    );

    expect(screen.queryByText("$0")).not.toBeInTheDocument();
  });

  test("shows claim button when showClaim is true", () => {
    render(<ItemsGrid {...defaultProps} showClaim={true} />);

    expect(screen.getByTestId("items-table-claim-button")).toBeInTheDocument();
  });

  test("hides claim button when showClaim is false", () => {
    render(<ItemsGrid {...defaultProps} showClaim={false} />);

    expect(
      screen.queryByTestId("items-table-claim-button"),
    ).not.toBeInTheDocument();
  });

  test("shows action buttons when canEdit is true", () => {
    render(<ItemsGrid {...defaultProps} canEdit={true} />);

    expect(screen.getByTestId("items-table-edit-button")).toBeInTheDocument();
    expect(screen.getByTestId("items-table-delete-button")).toBeInTheDocument();
  });

  test("hides action buttons when canEdit is false", () => {
    render(<ItemsGrid {...defaultProps} canEdit={false} />);

    expect(
      screen.queryByTestId("items-table-edit-button"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("items-table-delete-button"),
    ).not.toBeInTheDocument();
  });

  test("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();

    render(<ItemsGrid {...defaultProps} onEdit={mockOnEdit} />);

    await user.click(screen.getByTestId("items-table-edit-button"));
    expect(mockOnEdit).toHaveBeenCalledWith("1");
  });

  test("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();

    render(<ItemsGrid {...defaultProps} onDelete={mockOnDelete} />);

    await user.click(screen.getByTestId("items-table-delete-button"));
    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  test("calls onClaim when claim button clicked", async () => {
    const user = userEvent.setup();
    const mockOnClaim = vi.fn();

    render(<ItemsGrid {...defaultProps} onClaim={mockOnClaim} />);

    await user.click(screen.getByTestId("items-table-claim-button"));
    expect(mockOnClaim).toHaveBeenCalledWith("1");
  });

  test("renders multiple items", () => {
    const items = [baseItem, { ...baseItem, id: "2", name: "Nintendo Switch" }];

    render(<ItemsGrid {...defaultProps} items={items} />);

    expect(screen.getByText("Sony headphones")).toBeInTheDocument();
    expect(screen.getByText("Nintendo Switch")).toBeInTheDocument();
  });

  test("applies archived styling for archived items", () => {
    render(
      <ItemsGrid {...defaultProps} items={[{ ...baseItem, archived: true }]} />,
    );

    const card = screen.getByText("Sony headphones").closest("[class*='card']");
    expect(card?.className).toMatch(/archived/);
  });
});
