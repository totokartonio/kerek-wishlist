import { screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { ErrorMessage } from "./ErrorMessage";
import { renderWithClient } from "../../../test/utils";

describe("ErrorMessage", () => {
  test("renders title and message", () => {
    renderWithClient(
      <ErrorMessage title="Something went wrong" message="Please try again." />,
    );

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Please try again.")).toBeInTheDocument();
  });

  test("renders action when provided", () => {
    renderWithClient(
      <ErrorMessage
        title="Error"
        message="An error occurred."
        action={<a href="/dashboard">Go Back</a>}
      />,
    );

    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  test("does not render action when not provided", () => {
    renderWithClient(
      <ErrorMessage title="Error" message="An error occurred." />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
