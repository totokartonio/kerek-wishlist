import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { ErrorPage } from "./ErrorPage";
import { renderWithClient } from "../../test/utils";

vi.mock("../ui/Button/LinkButton", () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => (
    <a>{children}</a>
  ),
}));

describe("ErrorPage", () => {
  test("renders error heading", () => {
    renderWithClient(<ErrorPage />);

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
  });

  test("renders error message", () => {
    renderWithClient(<ErrorPage />);

    expect(
      screen.getByText("This page is temporarily unavailable :("),
    ).toBeInTheDocument();
  });

  test("renders go back home link", () => {
    renderWithClient(<ErrorPage />);

    expect(screen.getByText("Go Back Home")).toBeInTheDocument();
  });
});
