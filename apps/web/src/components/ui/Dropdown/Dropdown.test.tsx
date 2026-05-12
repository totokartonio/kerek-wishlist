import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
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
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
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

  test("clicking trigger opens the menu", () => {
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    fireEvent.click(screen.getByText("Open"));

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });

  test("clicking trigger again closes the menu", () => {
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    fireEvent.click(screen.getByText("Open"));
    fireEvent.click(screen.getByText("Open"));
    act(() => vi.advanceTimersByTime(150));

    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
  });

  test("clicking a link item closes the menu", () => {
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    fireEvent.click(screen.getByText("Open"));
    fireEvent.click(screen.getByRole("link", { name: "Dashboard" }));

    expect(
      screen.queryByRole("link", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
  });

  test("clicking an action item calls onClick and closes the menu", () => {
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    fireEvent.click(screen.getByText("Open"));
    fireEvent.click(screen.getByRole("button", { name: "Log out" }));
    act(() => vi.advanceTimersByTime(150));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "Log out" }),
    ).not.toBeInTheDocument();
  });

  test("renders link items as anchor elements with correct href", () => {
    render(<Dropdown trigger={<span>Open</span>} items={linkItems} />);

    fireEvent.click(screen.getByText("Open"));

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
  });

  test("renders divider before items with divider flag", () => {
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    fireEvent.click(screen.getByText("Open"));

    expect(document.querySelector("hr")).toBeInTheDocument();
  });

  test("danger item has danger class", () => {
    render(<Dropdown trigger={<span>Open</span>} items={allItems} />);

    fireEvent.click(screen.getByText("Open"));

    const logOutButton = screen.getByRole("button", { name: "Log out" });
    expect(logOutButton.className).toContain("danger");
  });

  test("renders icons when provided", () => {
    const itemsWithIcons = [
      {
        type: "link" as const,
        label: "Dashboard",
        to: "/dashboard",
        icon: <span data-testid="icon">★</span>,
      },
    ];
    render(<Dropdown trigger={<span>Open</span>} items={itemsWithIcons} />);

    fireEvent.click(screen.getByText("Open"));

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
