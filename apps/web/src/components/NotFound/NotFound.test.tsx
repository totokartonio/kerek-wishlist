import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { NotFound } from "./NotFound";
import { renderWithClient } from "../../test/utils";

vi.mock("../ui/Button/LinkButton", () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => (
    <a>{children}</a>
  ),
}));

describe("NotFound", () => {
  test("renders 404 heading", () => {
    renderWithClient(<NotFound />);

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  test("renders not found message", () => {
    renderWithClient(<NotFound />);

    expect(screen.getByText("Page not found :(")).toBeInTheDocument();
  });

  test("renders go back home link", () => {
    renderWithClient(<NotFound />);

    expect(screen.getByText("Go Back Home")).toBeInTheDocument();
  });
});
