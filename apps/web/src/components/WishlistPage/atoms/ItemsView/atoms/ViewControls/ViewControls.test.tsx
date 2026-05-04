import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { ViewControls } from "./ViewControls";
import { renderWithClient } from "../../../../../../test/utils";

vi.mock("../../../../../../hooks/ui/useIsMobile", () => ({
  useIsMobile: vi.fn(),
}));

import { useIsMobile } from "../../../../../../hooks/ui/useIsMobile";

const defaultProps = {
  viewMode: "table" as const,
  onViewChange: vi.fn(),
  filters: {},
  onFilterChange: vi.fn(),
  onClearFilters: vi.fn(),
  canEdit: false,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useIsMobile).mockReturnValue(false);
});

describe("ViewControls", () => {
  describe("desktop", () => {
    test("renders view toggle buttons", () => {
      renderWithClient(<ViewControls {...defaultProps} />);
      expect(screen.getByText("Table")).toBeInTheDocument();
      expect(screen.getByText("Grid")).toBeInTheDocument();
    });

    test("calls onViewChange when grid is clicked", async () => {
      const user = userEvent.setup();
      const onViewChange = vi.fn();
      renderWithClient(
        <ViewControls {...defaultProps} onViewChange={onViewChange} />,
      );

      await user.click(screen.getByText("Grid"));
      expect(onViewChange).toHaveBeenCalledWith("grid");
    });

    test("calls onViewChange when table is clicked", async () => {
      const user = userEvent.setup();
      const onViewChange = vi.fn();
      renderWithClient(
        <ViewControls
          {...defaultProps}
          viewMode="grid"
          onViewChange={onViewChange}
        />,
      );

      await user.click(screen.getByText("Table"));
      expect(onViewChange).toHaveBeenCalledWith("table");
    });

    test("renders status and sort selects", () => {
      renderWithClient(<ViewControls {...defaultProps} />);
      expect(
        screen.getByRole("combobox", { name: "Show status" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: "Sort by" }),
      ).toBeInTheDocument();
    });

    test("calls onFilterChange when status changes", async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      renderWithClient(
        <ViewControls {...defaultProps} onFilterChange={onFilterChange} />,
      );

      await user.selectOptions(
        screen.getByRole("combobox", { name: "Show status" }),
        "want",
      );
      expect(onFilterChange).toHaveBeenCalledWith({ status: "want" });
    });

    test("calls onFilterChange with undefined when status set to all", async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      renderWithClient(
        <ViewControls
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

    test("renders claimed by me button", () => {
      renderWithClient(<ViewControls {...defaultProps} />);
      expect(screen.getByText("Claimed by me")).toBeInTheDocument();
    });

    test("calls onFilterChange when claimed by me is clicked", async () => {
      const user = userEvent.setup();
      const onFilterChange = vi.fn();
      renderWithClient(
        <ViewControls {...defaultProps} onFilterChange={onFilterChange} />,
      );

      await user.click(screen.getByText("Claimed by me"));
      expect(onFilterChange).toHaveBeenCalledWith({ claimedByMe: true });
    });

    test("does not render show archived button when canEdit is false", () => {
      renderWithClient(<ViewControls {...defaultProps} canEdit={false} />);
      expect(screen.queryByText("Show archived")).not.toBeInTheDocument();
    });

    test("renders show archived button when canEdit is true", () => {
      renderWithClient(<ViewControls {...defaultProps} canEdit={true} />);
      expect(screen.getByText("Show archived")).toBeInTheDocument();
    });

    test("does not render clear button when no active filters", () => {
      renderWithClient(<ViewControls {...defaultProps} filters={{}} />);
      expect(screen.queryByText("Clear")).not.toBeInTheDocument();
    });

    test("renders clear button when filters are active", () => {
      renderWithClient(
        <ViewControls {...defaultProps} filters={{ status: "want" }} />,
      );
      expect(screen.getByText("Clear")).toBeInTheDocument();
    });

    test("calls onClearFilters when clear is clicked", async () => {
      const user = userEvent.setup();
      const onClearFilters = vi.fn();
      renderWithClient(
        <ViewControls
          {...defaultProps}
          filters={{ claimedByMe: true }}
          onClearFilters={onClearFilters}
        />,
      );

      await user.click(screen.getByText("Clear"));
      expect(onClearFilters).toHaveBeenCalled();
    });
  });

  describe("mobile", () => {
    beforeEach(() => {
      vi.mocked(useIsMobile).mockReturnValue(true);
    });

    test("does not render view toggle on mobile", () => {
      renderWithClient(<ViewControls {...defaultProps} />);
      expect(screen.queryByText("Table")).not.toBeInTheDocument();
      expect(screen.queryByText("Grid")).not.toBeInTheDocument();
    });

    test("renders Filters button on mobile", () => {
      renderWithClient(<ViewControls {...defaultProps} />);
      expect(screen.getByText("Filters")).toBeInTheDocument();
    });

    test("opens filter modal when Filters button is clicked", async () => {
      const user = userEvent.setup();
      renderWithClient(<ViewControls {...defaultProps} />);

      await user.click(screen.getByText("Filters"));
      expect(
        screen.getByText("Filters", { selector: "h2" }),
      ).toBeInTheDocument();
    });
  });
});
