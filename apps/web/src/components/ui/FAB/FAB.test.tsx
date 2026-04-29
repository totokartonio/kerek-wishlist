// src/components/ui/FAB/FAB.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { FAB } from "./FAB";

describe("FAB", () => {
  test("renders with aria-label", () => {
    render(
      <FAB
        icon={<span>+</span>}
        ariaLabel="Create wishlist"
        onClick={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Create wishlist" }),
    ).toBeInTheDocument();
  });

  test("renders icon", () => {
    render(
      <FAB
        icon={<span data-testid="fab-icon">+</span>}
        ariaLabel="Create wishlist"
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByTestId("fab-icon")).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <FAB
        icon={<span>+</span>}
        ariaLabel="Create wishlist"
        onClick={mockOnClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create wishlist" }));
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
