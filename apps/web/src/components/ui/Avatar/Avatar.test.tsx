import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { Avatar } from "./Avatar";

vi.mock("../../../lib/avatarIconMap", () => ({
  AVATAR_ICON_MAP: {
    lion: "/icons/avatars/lion.png",
    bear: "/icons/avatars/bear.png",
  },
}));

describe("Avatar", () => {
  test("renders image when valid avatar slug provided", () => {
    render(<Avatar avatar="lion" size={32} />);

    const img = screen.getByRole("img", { name: "lion" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/icons/avatars/lion.png");
  });

  test("renders fallback icon when avatar is null", () => {
    const { container } = render(<Avatar avatar={null} size={32} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("renders fallback icon when avatar slug not in map", () => {
    const { container } = render(<Avatar avatar="unknown_animal" size={32} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("applies correct size to circle", () => {
    const { container } = render(<Avatar avatar="lion" size={48} />);

    const circle = container.firstChild as HTMLElement;
    expect(circle).toHaveStyle({ width: "48px", height: "48px" });
  });

  test("applies className when provided", () => {
    const { container } = render(
      <Avatar avatar="lion" size={32} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
