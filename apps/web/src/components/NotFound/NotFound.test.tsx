import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { NotFound } from "./NotFound";
import { renderWithClient } from "../../test/utils";

vi.mock("../ui/Button/LinkButton", () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => (
    <a>{children}</a>
  ),
}));

vi.mock("../../assets/illustrations/character-404.png", () => ({
  default: "character-404.png",
}));

describe("NotFound", () => {
  test("renders default heading", () => {
    renderWithClient(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
  });

  test("renders default message", () => {
    renderWithClient(<NotFound />);

    expect(
      screen.getByText(
        "The page you're looking for doesn't exist or has been moved.",
      ),
    ).toBeInTheDocument();
  });

  test("renders go back home link", () => {
    renderWithClient(<NotFound />);

    expect(screen.getByText("Go Back Home")).toBeInTheDocument();
  });

  test("renders custom title and message", () => {
    renderWithClient(
      <NotFound
        title="Wishlist not found"
        message="This wishlist doesn't exist."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Wishlist not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This wishlist doesn't exist."),
    ).toBeInTheDocument();
  });
});
