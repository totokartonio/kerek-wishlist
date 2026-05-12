import { screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { Footer } from "./Footer";
import { renderWithClient } from "../../test/utils";

describe("Footer", () => {
  test("renders Claybees attribution link", () => {
    renderWithClient(<Footer />);

    const claybees = screen.getByRole("link", { name: "CLAYBEES" });
    expect(claybees).toBeInTheDocument();
    expect(claybees).toHaveAttribute("href", "https://www.claybees.art");
  });

  test("renders made by link", () => {
    renderWithClient(<Footer />);

    const toto = screen.getByRole("link", { name: "toto" });
    expect(toto).toBeInTheDocument();
    expect(toto).toHaveAttribute("href", "https://github.com/totokartonio");
  });

  test("links open in new tab", () => {
    renderWithClient(<Footer />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
