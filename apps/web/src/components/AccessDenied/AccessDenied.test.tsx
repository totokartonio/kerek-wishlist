import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { AccessDenied } from "./AccessDenied";
import { renderWithClient } from "../../test/utils";

vi.mock("../ui/Button/LinkButton", () => ({
  LinkButton: ({ children }: { children: React.ReactNode }) => (
    <a>{children}</a>
  ),
}));
vi.mock("../../assets/illustrations/unauthorized.png", () => ({
  default: "unauthorized.png",
}));

describe("AccessDenied", () => {
  test("renders default heading and message", () => {
    renderWithClient(<AccessDenied />);

    expect(
      screen.getByRole("heading", { name: "Access Denied" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You don't have permission to view this page."),
    ).toBeInTheDocument();
  });

  test("renders custom message", () => {
    renderWithClient(
      <AccessDenied message="You don't have access to this wishlist." />,
    );

    expect(
      screen.getByText("You don't have access to this wishlist."),
    ).toBeInTheDocument();
  });

  test("renders go back home link", () => {
    renderWithClient(<AccessDenied />);

    expect(screen.getByText("Go Back Home")).toBeInTheDocument();
  });

  test("renders illustration", () => {
    renderWithClient(<AccessDenied />);

    expect(
      screen.getByRole("img", { name: "Access Denied" }),
    ).toBeInTheDocument();
  });
});
