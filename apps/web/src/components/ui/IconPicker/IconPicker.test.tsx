import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { IconPicker } from "./IconPicker";

vi.mock("../../../hooks/ui/useClickOutside", () => ({
  useClickOutside: vi.fn(),
}));

const mockIcons = ["star", "heart", "gift"] as const;
const mockIconMap: Record<string, string> = {
  star: "/icons/star.png",
  heart: "/icons/heart.png",
  gift: "/icons/gift.png",
};

const defaultProps = {
  icons: mockIcons,
  iconMap: mockIconMap,
  value: "star",
  onChange: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("IconPicker", () => {
  test("renders trigger with current icon", () => {
    render(<IconPicker {...defaultProps} />);

    const img = screen.getByRole("img", { name: "star" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icons/star.png");
  });

  test("grid is hidden by default", () => {
    render(<IconPicker {...defaultProps} />);

    expect(
      screen.queryByRole("img", { name: "heart" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "gift" })).not.toBeInTheDocument();
  });

  test("clicking trigger opens the grid", async () => {
    const user = userEvent.setup();
    render(<IconPicker {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Pick an icon" }));

    expect(screen.getByRole("img", { name: "heart" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "gift" })).toBeInTheDocument();
  });

  test("clicking trigger again closes the grid", async () => {
    const user = userEvent.setup();
    render(<IconPicker {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Pick an icon" }));
    await user.click(screen.getByRole("button", { name: "Pick an icon" }));

    expect(
      screen.queryByRole("img", { name: "heart" }),
    ).not.toBeInTheDocument();
  });

  test("selecting an icon calls onChange with slug", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<IconPicker {...defaultProps} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Pick an icon" }));
    await user.click(screen.getByRole("button", { name: "heart" }));

    expect(onChange).toHaveBeenCalledWith("heart");
  });

  test("selecting an icon closes the grid", async () => {
    const user = userEvent.setup();
    render(<IconPicker {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Pick an icon" }));
    await user.click(screen.getByRole("button", { name: "heart" }));

    expect(screen.queryByRole("img", { name: "gift" })).not.toBeInTheDocument();
  });

  test("selected icon has selected style", async () => {
    const user = userEvent.setup();
    render(<IconPicker {...defaultProps} value="heart" />);

    await user.click(screen.getByRole("button", { name: "Pick an icon" }));

    const heartButton = screen.getByRole("button", { name: "heart" });
    expect(heartButton.className).toContain("selected");
  });

  test("renders custom trigger content when provided", () => {
    render(
      <IconPicker
        {...defaultProps}
        triggerContent={<span data-testid="custom-trigger">Avatar</span>}
      />,
    );

    expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "star" })).not.toBeInTheDocument();
  });
});
