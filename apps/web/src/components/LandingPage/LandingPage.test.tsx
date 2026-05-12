import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { LandingPage } from "./LandingPage";
import { renderWithClient } from "../../test/utils";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    LinkButton: ({
      children,
      to,
    }: {
      children: React.ReactNode;
      to: string;
    }) => <a href={to}>{children}</a>,
  };
});

vi.mock("../../assets/illustrations/checklist.png", () => ({
  default: "checklist.png",
}));
vi.mock("../../assets/illustrations/heart-hug.png", () => ({
  default: "heart-hug.png",
}));
vi.mock("../../assets/illustrations/phone-scrolling.png", () => ({
  default: "phone-scrolling.png",
}));
vi.mock("../../assets/illustrations/coffee-mug.png", () => ({
  default: "coffee-mug.png",
}));
vi.mock("../../assets/illustrations/price-tag.png", () => ({
  default: "price-tag.png",
}));
vi.mock("../../assets/illustrations/book.png", () => ({ default: "book.png" }));

describe("LandingPage", () => {
  test("renders hero heading and CTAs", () => {
    renderWithClient(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: /share your wishlist/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create your wishlist" }),
    ).toBeInTheDocument();
    expect(screen.getByText("See how it works")).toBeInTheDocument();
  });

  test("renders how it works section with all steps", () => {
    renderWithClient(<LandingPage />);

    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("Claim")).toBeInTheDocument();
  });

  test("renders features section", () => {
    renderWithClient(<LandingPage />);

    expect(screen.getAllByText("Surprise mode").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByText("Easy link sharing")).toBeInTheDocument();
    expect(screen.getByText("Collaborators")).toBeInTheDocument();
    expect(screen.getByText("Multi-currency")).toBeInTheDocument();
  });

  test("renders privacy section", () => {
    renderWithClient(<LandingPage />);

    expect(
      screen.getByText("You choose who gets to peek."),
    ).toBeInTheDocument();
    expect(screen.getByText("Private")).toBeInTheDocument();
    expect(screen.getAllByText("Invite-only").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  test("renders final CTA", () => {
    renderWithClient(<LandingPage />);

    expect(
      screen.getByRole("link", { name: "Start your wishlist" }),
    ).toBeInTheDocument();
  });
});
