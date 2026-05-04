import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { FilterControls } from "./FilterControls";
import type { ItemFilters } from "@wishlist/types";

const defaultProps = {
  filters: {} as ItemFilters,
  onFilterChange: vi.fn(),
  canEdit: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("FilterControls", () => {
  test("renders status select", () => {
    render(<FilterControls {...defaultProps} />);
    expect(
      screen.getByRole("combobox", { name: "Show status" }),
    ).toBeInTheDocument();
  });

  test("renders sort select", () => {
    render(<FilterControls {...defaultProps} />);
    expect(
      screen.getByRole("combobox", { name: "Sort by" }),
    ).toBeInTheDocument();
  });

  test("calls onFilterChange with status when status select changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <FilterControls {...defaultProps} onFilterChange={onFilterChange} />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Show status" }),
      "want",
    );
    expect(onFilterChange).toHaveBeenCalledWith({ status: "want" });
  });

  test("calls onFilterChange with undefined status when all is selected", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <FilterControls
        {...defaultProps}
        filters={{ status: "want" }}
        onFilterChange={onFilterChange}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Show status" }),
      "all",
    );
    expect(onFilterChange).toHaveBeenCalledWith({ status: undefined });
  });

  test("calls onFilterChange with sort when sort select changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <FilterControls {...defaultProps} onFilterChange={onFilterChange} />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort by" }),
      "name-asc",
    );
    expect(onFilterChange).toHaveBeenCalledWith({ sort: "name-asc" });
  });

  test("renders claimed by me button", () => {
    render(<FilterControls {...defaultProps} />);
    expect(screen.getByText("Claimed by me")).toBeInTheDocument();
  });

  test("calls onFilterChange with claimedByMe true when button clicked", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <FilterControls {...defaultProps} onFilterChange={onFilterChange} />,
    );

    await user.click(screen.getByText("Claimed by me"));
    expect(onFilterChange).toHaveBeenCalledWith({ claimedByMe: true });
  });

  test("calls onFilterChange with claimedByMe undefined when already active", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <FilterControls
        {...defaultProps}
        filters={{ claimedByMe: true }}
        onFilterChange={onFilterChange}
      />,
    );

    await user.click(screen.getByText("Claimed by me"));
    expect(onFilterChange).toHaveBeenCalledWith({ claimedByMe: undefined });
  });

  test("does not render show archived button when canEdit is false", () => {
    render(<FilterControls {...defaultProps} canEdit={false} />);
    expect(screen.queryByText("Show archived")).not.toBeInTheDocument();
  });

  test("renders show archived button when canEdit is true", () => {
    render(<FilterControls {...defaultProps} canEdit={true} />);
    expect(screen.getByText("Show archived")).toBeInTheDocument();
  });

  test("calls onFilterChange with showArchived true when button clicked", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <FilterControls
        {...defaultProps}
        canEdit={true}
        onFilterChange={onFilterChange}
      />,
    );

    await user.click(screen.getByText("Show archived"));
    expect(onFilterChange).toHaveBeenCalledWith({ showArchived: true });
  });

  test("calls onFilterChange with showArchived undefined when already active", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(
      <FilterControls
        {...defaultProps}
        canEdit={true}
        filters={{ showArchived: true }}
        onFilterChange={onFilterChange}
      />,
    );

    await user.click(screen.getByText("Show archived"));
    expect(onFilterChange).toHaveBeenCalledWith({ showArchived: undefined });
  });
});
