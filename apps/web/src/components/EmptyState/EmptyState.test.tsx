import { screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { EmptyState } from "./EmptyState";
import { renderWithClient } from "../../test/utils";

describe("EmptyState", () => {
  test("renders illustration and title", () => {
    renderWithClient(
      <EmptyState illustration="test.png" title="No items yet" />,
    );

    expect(
      screen.getByRole("img", { name: "No items yet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No items yet" }),
    ).toBeInTheDocument();
  });

  test("renders optional message when provided", () => {
    renderWithClient(
      <EmptyState
        illustration="test.png"
        title="No items"
        message="Add your first item to get started."
      />,
    );

    expect(
      screen.getByText("Add your first item to get started."),
    ).toBeInTheDocument();
  });

  test("does not render message when not provided", () => {
    renderWithClient(<EmptyState illustration="test.png" title="No items" />);

    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  test("renders optional action when provided", () => {
    renderWithClient(
      <EmptyState
        illustration="test.png"
        title="No items"
        action={<button>Add item</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Add item" }),
    ).toBeInTheDocument();
  });

  test("does not render action when not provided", () => {
    renderWithClient(<EmptyState illustration="test.png" title="No items" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
