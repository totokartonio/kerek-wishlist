import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { FilterModal } from "./FilterModal";
import { renderWithClient } from "../../../../../../test/utils";

vi.mock("../../../../../ui/Modal", () => ({
  default: ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div>
      <button onClick={onClose} data-testid="modal-close-button">
        Close
      </button>
      {children}
    </div>
  ),
}));

const defaultProps = {
  filters: {},
  onFilterChange: vi.fn(),
  onClose: vi.fn(),
  canEdit: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("FilterModal", () => {
  test("renders Filters heading", () => {
    renderWithClient(<FilterModal {...defaultProps} />);
    expect(
      screen.getByRole("heading", { name: "Filters" }),
    ).toBeInTheDocument();
  });

  test("renders status and sort selects", () => {
    renderWithClient(<FilterModal {...defaultProps} />);
    expect(screen.getByLabelText("Show")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort by")).toBeInTheDocument();
  });

  test("calls onFilterChange when status changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    renderWithClient(
      <FilterModal {...defaultProps} onFilterChange={onFilterChange} />,
    );

    await user.selectOptions(screen.getByLabelText("Show"), "want");
    expect(onFilterChange).toHaveBeenCalledWith({ status: "want" });
  });

  test("calls onFilterChange when sort changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    renderWithClient(
      <FilterModal {...defaultProps} onFilterChange={onFilterChange} />,
    );

    await user.selectOptions(screen.getByLabelText("Sort by"), "name-asc");
    expect(onFilterChange).toHaveBeenCalledWith({ sort: "name-asc" });
  });

  test("renders claimed by me button", () => {
    renderWithClient(<FilterModal {...defaultProps} />);
    expect(screen.getByText("Claimed by me")).toBeInTheDocument();
  });

  test("calls onFilterChange when claimed by me is clicked", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    renderWithClient(
      <FilterModal {...defaultProps} onFilterChange={onFilterChange} />,
    );

    await user.click(screen.getByText("Claimed by me"));
    expect(onFilterChange).toHaveBeenCalledWith({ claimedByMe: true });
  });

  test("toggles claimedByMe off when already active", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    renderWithClient(
      <FilterModal
        {...defaultProps}
        filters={{ claimedByMe: true }}
        onFilterChange={onFilterChange}
      />,
    );

    await user.click(screen.getByText("Claimed by me"));
    expect(onFilterChange).toHaveBeenCalledWith({ claimedByMe: undefined });
  });

  test("does not render show archived when canEdit is false", () => {
    renderWithClient(<FilterModal {...defaultProps} canEdit={false} />);
    expect(screen.queryByText("Show archived")).not.toBeInTheDocument();
  });

  test("renders show archived when canEdit is true", () => {
    renderWithClient(<FilterModal {...defaultProps} canEdit={true} />);
    expect(screen.getByText("Show archived")).toBeInTheDocument();
  });

  test("calls onClose when Apply is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithClient(<FilterModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByText("Apply"));
    expect(onClose).toHaveBeenCalled();
  });

  test("calls onClose when modal close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithClient(<FilterModal {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByTestId("modal-close-button"));
    expect(onClose).toHaveBeenCalled();
  });
});
