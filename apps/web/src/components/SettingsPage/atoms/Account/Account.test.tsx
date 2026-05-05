import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Account } from "./Account";

vi.mock("../../../../api/users", () => ({
  checkEmail: vi.fn(),
}));

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

import { checkEmail } from "../../../../api/users";

const mockOnChangeName = vi.fn();
const mockOnChangeEmail = vi.fn();
const mockSetMessage = vi.fn();

const defaultProps = {
  currentName: "Test User",
  currentEmail: "test@test.com",
  onChangeName: mockOnChangeName,
  onChangeEmail: mockOnChangeEmail,
  setMessage: mockSetMessage,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Account", () => {
  test("renders name and email inputs with current values", () => {
    render(<Account {...defaultProps} />);

    expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@test.com")).toBeInTheDocument();
  });

  test("name submit button is disabled when name is empty", async () => {
    const user = userEvent.setup();
    render(<Account {...defaultProps} currentName="" />);

    const nameInput = screen.getByLabelText(/change your name/i);
    await user.clear(nameInput);

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    expect(submitButtons[0]).toBeDisabled();
  });

  test("email submit button is disabled when email is empty", async () => {
    render(<Account {...defaultProps} currentEmail="" />);

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    expect(submitButtons[1]).toBeDisabled();
  });

  test("submitting name form opens name confirmation modal", async () => {
    const user = userEvent.setup();
    render(<Account {...defaultProps} />);

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[0]);

    expect(
      screen.getByRole("heading", { name: "Changing Name" }),
    ).toBeInTheDocument();
  });

  test("submitting email form with available email opens email modal", async () => {
    vi.mocked(checkEmail).mockResolvedValue({ taken: false });
    const user = userEvent.setup();
    render(<Account {...defaultProps} />);

    const emailInput = screen.getByLabelText(/change your email/i);
    await user.clear(emailInput);
    await user.type(emailInput, "new@test.com");

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[1]);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Changing Email" }),
      ).toBeInTheDocument();
    });
  });

  test("submitting email form with taken email shows error message", async () => {
    vi.mocked(checkEmail).mockResolvedValue({ taken: true });
    const user = userEvent.setup();
    render(<Account {...defaultProps} />);

    const emailInput = screen.getByLabelText(/change your email/i);
    await user.clear(emailInput);
    await user.type(emailInput, "taken@test.com");

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[1]);

    await waitFor(() => {
      expect(mockSetMessage).toHaveBeenCalledWith({
        text: "This email is already taken",
        type: "error",
      });
    });

    expect(
      screen.queryByRole("heading", { name: "Changing Email" }),
    ).not.toBeInTheDocument();
  });

  test("submitting email form with same email skips check and opens modal", async () => {
    const user = userEvent.setup();
    render(<Account {...defaultProps} />);

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[1]);

    expect(checkEmail).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Changing Email" }),
      ).toBeInTheDocument();
    });
  });

  test("confirming name modal calls onChangeName with current name", async () => {
    const user = userEvent.setup();
    render(<Account {...defaultProps} />);

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[0]);
    await user.click(screen.getByRole("button", { name: "Yes" }));

    expect(mockOnChangeName).toHaveBeenCalledWith("Test User");
  });

  test("cancelling name modal closes it without calling onChangeName", async () => {
    const user = userEvent.setup();
    render(<Account {...defaultProps} />);

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[0]);
    await user.click(screen.getByRole("button", { name: "No" }));

    expect(mockOnChangeName).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: "Changing Name" }),
    ).not.toBeInTheDocument();
  });

  test("confirming email modal calls onChangeEmail with current email", async () => {
    vi.mocked(checkEmail).mockResolvedValue({ taken: false });
    const user = userEvent.setup();
    render(<Account {...defaultProps} />);

    const emailInput = screen.getByLabelText(/change your email/i);
    await user.clear(emailInput);
    await user.type(emailInput, "new@test.com");

    const submitButtons = screen.getAllByRole("button", { name: "Submit" });
    await user.click(submitButtons[1]);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Changing Email" }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(mockOnChangeEmail).toHaveBeenCalledWith("new@test.com");
  });
});
