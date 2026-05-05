import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Header } from "./Header";

vi.mock("../../lib/auth-client", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

vi.mock("../ui/ConfirmationModal", () => ({
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

vi.mock("../../hooks/ui/useIsMobile", () => ({
  useIsMobile: () => false,
}));

import { useSession, signOut } from "../../lib/auth-client";

const mockSessionLoggedOut = {
  data: null,
  isPending: false,
  isRefetching: false,
  error: null,
  refetch: vi.fn(),
};

const mockSessionLoggedIn = {
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
});

describe("Header", () => {
  test("renders logo image", () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedOut);
    render(<Header />);

    expect(screen.getByAltText("Kérek")).toBeInTheDocument();
  });

  test("shows Log in link when not logged in", () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedOut);
    render(<Header />);

    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
  });

  test("shows username as dropdown trigger when logged in", () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    render(<Header />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Log in" }),
    ).not.toBeInTheDocument();
  });

  test("clicking username opens dropdown with nav items", async () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByText("Test User"));

    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
  });

  test("clicking Log out in dropdown shows confirmation modal", async () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByText("Test User"));
    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(
      screen.getByRole("heading", { name: "Log Out" }),
    ).toBeInTheDocument();
  });

  test("modal cancel closes without logging out", async () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByText("Test User"));
    await user.click(screen.getByRole("button", { name: /log out/i }));
    await user.click(screen.getByRole("button", { name: "No" }));

    expect(signOut).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: "Log Out" }),
    ).not.toBeInTheDocument();
  });

  test("modal confirm calls signOut and redirects to /login", async () => {
    vi.mocked(useSession).mockReturnValue(mockSessionLoggedIn);
    vi.mocked(signOut).mockResolvedValue({} as never);
    const user = userEvent.setup();

    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    render(<Header />);

    await user.click(screen.getByText("Test User"));
    await user.click(screen.getByRole("button", { name: /log out/i }));
    await user.click(screen.getByRole("button", { name: "Yes" }));

    expect(signOut).toHaveBeenCalled();
    expect(window.location.href).toBe("/login");

    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });
});
