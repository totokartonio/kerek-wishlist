import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { Drawer } from "./Drawer";

vi.mock("../../../lib/scrollCount", () => ({
  lockScroll: vi.fn(),
  unlockScroll: vi.fn(),
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Drawer", () => {
  test("renders children", () => {
    render(<Drawer onClose={vi.fn()}>Drawer content</Drawer>);
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  test("renders close button", () => {
    render(<Drawer onClose={vi.fn()}>Content</Drawer>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  test("calls onClose when backdrop clicked", () => {
    const onClose = vi.fn();
    render(<Drawer onClose={onClose}>Content</Drawer>);

    fireEvent.click(screen.getByTestId("modal-backdrop"));
    vi.advanceTimersByTime(250);
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<Drawer onClose={onClose}>Content</Drawer>);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    vi.advanceTimersByTime(250);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
