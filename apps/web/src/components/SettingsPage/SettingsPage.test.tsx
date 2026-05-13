import { screen, waitFor } from "@testing-library/react";
import { renderWithClient } from "../../test/utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { SettingsPage } from "./SettingsPage";

vi.mock("../../lib/auth-client", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
  authClient: {
    updateUser: vi.fn(),
    changeEmail: vi.fn(),
    changePassword: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

vi.mock("../../api/users", () => ({ getUser: vi.fn(), updateAvatar: vi.fn() }));
vi.mock("../../api/users", () => ({
  getUser: vi.fn(),
  updateAvatar: vi.fn(),
  getHasPassword: vi.fn().mockResolvedValue({ hasPassword: true }),
}));

vi.mock("./atoms/Account", () => ({
  default: ({
    onChangeName,
    onChangeEmail,
    setMessage,
    currentName,
    currentEmail,
  }: {
    onChangeName: (name: string) => void;
    onChangeEmail: (email: string | undefined) => void;
    setMessage: (msg: unknown) => void;
    currentName: string;
    currentEmail: string;
  }) => (
    <div>
      <span data-testid="current-name">{currentName}</span>
      <span data-testid="current-email">{currentEmail}</span>
      <button onClick={() => onChangeName("New Name")}>Change Name</button>
      <button onClick={() => onChangeEmail("new@test.com")}>
        Change Email
      </button>
      <button onClick={() => onChangeEmail(undefined)}>
        Change Email Empty
      </button>
      <button
        onClick={() => setMessage({ text: "Email taken", type: "error" })}
      >
        Set Error Message
      </button>
    </div>
  ),
}));

vi.mock("./atoms/Security", () => ({
  default: ({
    onChangePassword,
    onDelete,
  }: {
    onChangePassword: (current: string, next: string) => void;
    onDelete: () => void;
  }) => (
    <div>
      <button onClick={() => onChangePassword("old", "new")}>
        Change Password
      </button>
      <button onClick={onDelete}>Delete Account</button>
    </div>
  ),
}));

import { useSession, signOut, authClient } from "../../lib/auth-client";

const mockSession = {
  data: {
    user: {
      id: "1",
      name: "Test User",
      email: "test@test.com",
      emailVerified: false,
      isAnonymous: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      id: "1",
      userId: "1",
      token: "token",
      expiresAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  isPending: false,
  isRefetching: false,
  error: null,
  refetch: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useSession).mockReturnValue(mockSession);
  vi.mocked(authClient.updateUser).mockResolvedValue({ error: null } as never);
  vi.mocked(authClient.changeEmail).mockResolvedValue({ error: null } as never);
  vi.mocked(authClient.changePassword).mockResolvedValue({
    error: null,
  } as never);
  vi.mocked(authClient.deleteUser).mockResolvedValue({ error: null } as never);
  vi.mocked(signOut).mockResolvedValue({} as never);
});

describe("SettingsPage", () => {
  test("renderWithClients Settings heading", () => {
    renderWithClient(<SettingsPage />);
    expect(
      screen.getByRole("heading", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  test("passes current name and email to Account", () => {
    renderWithClient(<SettingsPage />);
    expect(screen.getByTestId("current-name")).toHaveTextContent("Test User");
    expect(screen.getByTestId("current-email")).toHaveTextContent(
      "test@test.com",
    );
  });

  test("no message shown initially", () => {
    renderWithClient(<SettingsPage />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  test("handleChangeName shows success message on success", async () => {
    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Change Name" }));

    await waitFor(() => {
      expect(screen.getByText("Name successfully changed")).toBeInTheDocument();
    });
  });

  test("handleChangeName shows error message on failure", async () => {
    vi.mocked(authClient.updateUser).mockResolvedValue({
      error: { message: "Update failed" },
    } as never);
    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Change Name" }));

    await waitFor(() => {
      expect(screen.getByText("Update failed")).toBeInTheDocument();
    });
  });

  test("handleChangeEmail shows error when email is empty", async () => {
    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(
      screen.getByRole("button", { name: "Change Email Empty" }),
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to change email")).toBeInTheDocument();
    });
  });

  test("handleChangeEmail shows success message on success", async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Change Email" }));

    await waitFor(() => {
      expect(
        screen.getByText("Email successfully changed"),
      ).toBeInTheDocument();
    });

    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  test("handleChangeEmail shows error message on failure", async () => {
    vi.mocked(authClient.changeEmail).mockResolvedValue({
      error: { message: "Email change failed" },
    } as never);
    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Change Email" }));

    await waitFor(() => {
      expect(screen.getByText("Email change failed")).toBeInTheDocument();
    });
  });

  test("handleChangePassword shows success message on success", async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(
        screen.getByText("Password successfully changed"),
      ).toBeInTheDocument();
    });

    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  test("handleChangePassword shows error message on failure", async () => {
    vi.mocked(authClient.changePassword).mockResolvedValue({
      error: { message: "Wrong password" },
    } as never);
    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(screen.getByText("Wrong password")).toBeInTheDocument();
    });
  });

  test("handleDelete redirects to /login on success", async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Delete Account" }));

    await waitFor(() => {
      expect(window.location.href).toBe("/login");
    });

    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  test("handleDelete shows error message on failure", async () => {
    vi.mocked(authClient.deleteUser).mockResolvedValue({
      error: { message: "Delete failed" },
    } as never);
    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Delete Account" }));

    await waitFor(() => {
      expect(screen.getByText("Delete failed")).toBeInTheDocument();
    });
  });

  test("setMessage passed to Account displays message in SettingsPage", async () => {
    const user = userEvent.setup();
    renderWithClient(<SettingsPage />);

    await user.click(screen.getByRole("button", { name: "Set Error Message" }));

    expect(screen.getByText("Email taken")).toBeInTheDocument();
  });
});
