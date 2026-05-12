import { screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { AppShell } from "./AppShell";
import { renderWithClient } from "../../test/utils";

vi.mock("../../assets/logo-desktop.png", () => ({
  default: "logo-desktop.png",
}));

describe("AppShell", () => {
  test("renders logo image", () => {
    renderWithClient(<AppShell />);

    expect(screen.getByRole("img", { name: "Kérek" })).toBeInTheDocument();
  });

  test("renders main element", () => {
    renderWithClient(<AppShell />);

    expect(document.querySelector("main")).toBeInTheDocument();
  });
});
