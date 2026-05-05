import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Dropdown } from "./Dropdown";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Link: ({
      children,
      to,
      onClick,
    }: {
      children: React.ReactNode;
      to: string;
      onClick?: () => void;
    }) => (
      <a href={to} onClick={onClick}>
        {children}
      </a>
    ),
  };
});

vi.mock("../../../hooks/ui/useClickOutside", () => ({
  useClickOutside: vi.fn(),
}));

const linkItems = [
  { type: "link" as const, label: "Dashboard", to: "/dashboard" },
  { type: "link" as const, label: "Settings", to: "/settings" },
];

const mockOnClick = vi.fn();

const actionItems = [
  {
    type: "action" as const,
    label: "Log out",
    onClick: mockOnClick,
    danger: true,
    divider: true,
  },
];

const allItems = [...linkItems, ...actionItems];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Dropdown", () => {
  test("menu is hidden by default", () => {
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Settings" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Log out" }),
    ).not.toBeInTheDocument();
  });

  test("clicking trigger opens the menu", async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  test("clicking trigger again closes the menu", async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Open"));

    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
  });

  test("clicking a link item closes the menu", async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("link", { name: "Dashboard" }));

    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
  });

  test("clicking an action item calls onClick and closes the menu", async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "Log out" }),
    ).not.toBeInTheDocument();
  });

  test("renders link items as anchor elements with correct href", async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger={<span>Open</span>} items={linkItems} />);

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
  });

  test("renders divider before items with divider flag", async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    await user.click(screen.getByText("Open"));

    expect(document.querySelector("hr")).toBeInTheDocument();
  });

  test("danger item has danger class", async () => {
    const user = userEvent.setup();
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    await user.click(screen.getByText("Open"));

    const logOutButton = screen.getByRole("button", { name: "Log out" });
    expect(logOutButton.className).toContain("danger");
  });

  test("renders icons when provided", async () => {
    const user = userEvent.setup();
    const itemsWithIcons = [
      {
        type: "link" as const,
        label: "Dashboard",
        to: "/dashboard",
        icon: <span data-testid="icon">★</span>,
      },
    ];
    render(<Dropdown trigger={<span>Open</span>} items={itemsWithIcons} />);

    await user.click(screen.getByText("Open"));

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
