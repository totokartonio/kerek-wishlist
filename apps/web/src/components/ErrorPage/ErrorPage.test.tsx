import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { ErrorPage } from "./ErrorPage";
import { renderWithClient } from "../../test/utils";

vi.mock("../ui/Button/LinkButton", () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => (
    <a>{children}</a>
  ),
}));

vi.mock("../../assets/illustrations/problem-solver.png", () => ({
  default: "problem-solver.png",
}));

describe("ErrorPage", () => {
  test("renders error heading", () => {
    renderWithClient(<ErrorPage />);

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
  });

  test("renders default error message", () => {
    renderWithClient(<ErrorPage />);

    expect(
      screen.getByText(
        "This page is temporarily unavailable. Please try again later.",
      ),
    ).toBeInTheDocument();
  });

  test("renders go back home link", () => {
    renderWithClient(<ErrorPage />);

    expect(screen.getByText("Go Back Home")).toBeInTheDocument();
  });

  test("renders custom title and message", () => {
    renderWithClient(
      <ErrorPage
        title="Custom Error"
        message="Something specific went wrong."
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Custom Error" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Something specific went wrong."),
    ).toBeInTheDocument();
  });
});
