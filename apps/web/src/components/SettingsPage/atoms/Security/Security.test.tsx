import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Security } from "./Security";

vi.mock("../../../ui/ConfirmationModal", () => ({
  default: ({
    title,
    onClose,
    onConfirm,
  }: {
    title: string;
    onClose: () => void;
    onConfirm: () => void;
  }) => (
    <div>
      <h2>{title}</h2>
      <button onClick={onClose}>No</button>
      <button onClick={onConfirm}>Yes</button>
    </div>
  ),
}));

const mockOnChangePassword = vi.fn();
const mockOnDelete = vi.fn();

const defaultProps = {
  onChangePassword: mockOnChangePassword,
  onDelete: mockOnDelete,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Security", () => {
  test("renders current and new password inputs", () => {
    render(<Security {...defaultProps} />);

    expect(
      screen.getByLabelText(/enter your current password/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/enter your new password/i),
    ).toBeInTheDocument();
  });

  test("submit button is disabled when both inputs are empty", () => {
    render(<Security {...defaultProps} />);

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  test("submit button is disabled when only current password is filled", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.type(
      screen.getByLabelText(/enter your current password/i),
      "password123",
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  test("submit button is disabled when only new password is filled", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.type(
      screen.getByLabelText(/enter your new password/i),
      "newpassword123",
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  test("submit button is enabled when both inputs are filled", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.type(
      screen.getByLabelText(/enter your current password/i),
      "password123",
    );
    await user.type(
      screen.getByLabelText(/enter your new password/i),
      "newpassword123",
    );

    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();
  });

  test("submitting password form opens confirmation modal", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.type(
      screen.getByLabelText(/enter your current password/i),
      "password123",
    );
    await user.type(
      screen.getByLabelText(/enter your new password/i),
      "newpassword123",
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      screen.getByRole("heading", { name: "Changing Password" }),
    ).toBeInTheDocument();
  });

  test("confirming password modal calls onChangePassword with correct args", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.type(
      screen.getByLabelText(/enter your current password/i),
      "password123",
    );
    await user.type(
      screen.getByLabelText(/enter your new password/i),
      "newpassword123",
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: "Yes" }));

    expect(mockOnChangePassword).toHaveBeenCalledWith(
      "password123",
      "newpassword123",
    );
  });

  test("cancelling password modal closes it without calling onChangePassword", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.type(
      screen.getByLabelText(/enter your current password/i),
      "password123",
    );
    await user.type(
      screen.getByLabelText(/enter your new password/i),
      "newpassword123",
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    await user.click(screen.getByRole("button", { name: "No" }));

    expect(mockOnChangePassword).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: "Changing Password" }),
    ).not.toBeInTheDocument();
  });

  test("clicking Delete Account button opens delete confirmation modal", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete Account" }));

    expect(
      screen.getByRole("heading", { name: "Delete Account" }),
    ).toBeInTheDocument();
  });

  test("confirming delete modal calls onDelete", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete Account" }));
    await user.click(screen.getByRole("button", { name: "Yes" }));

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  test("cancelling delete modal closes it without calling onDelete", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Delete Account" }));
    await user.click(screen.getByRole("button", { name: "No" }));

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: "Delete Account" }),
    ).not.toBeInTheDocument();
  });

  test("show/hide password toggle changes input type", async () => {
    const user = userEvent.setup();
    render(<Security {...defaultProps} />);

    const currentPasswordInput = screen.getByLabelText(
      /enter your current password/i,
    );
    expect(currentPasswordInput).toHaveAttribute("type", "password");

    await user.click(screen.getAllByTestId("show-password")[0]);

    expect(currentPasswordInput).toHaveAttribute("type", "text");
  });
});
