import { screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { UserProfilePage } from "./UserProfilePage";
import { renderWithClient } from "../../test/utils";
import { getUser, getUserWishlists } from "../../api/users";
import type { UserProfile, Wishlist } from "@wishlist/types";

vi.mock("../../api/users");
vi.mock("../../lib/auth-client", () => ({
  useSession: () => ({ data: { user: { id: "other-user" } } }),
}));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
    LinkButton: ({ children }: { children: React.ReactNode }) => (
      <a>{children}</a>
    ),
  };
});
vi.mock("../../assets/illustrations/surprised.png", () => ({
  default: "surprised.png",
}));
vi.mock("../../assets/illustrations/problem-solver.png", () => ({
  default: "problem-solver.png",
}));
vi.mock("../../assets/illustrations/character-404.png", () => ({
  default: "character-404.png",
}));

const mockUser: UserProfile = { id: "user-1", name: "Jane Doe", avatar: null };
const mockWishlists: Wishlist[] = [
  {
    id: "w-1",
    name: "Birthday Wishlist",
    description: null,
    visibility: "public",
    ownerId: "user-1",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    hideClaimsFromOwner: true,
    icon: "star",
  },
];

beforeEach(() => {
  vi.mocked(getUser).mockResolvedValue(mockUser);
  vi.mocked(getUserWishlists).mockResolvedValue(mockWishlists);
});

describe("UserProfilePage", () => {
  test("renders user name and wishlists", async () => {
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(await screen.findByText("Birthday Wishlist")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    vi.mocked(getUser).mockReturnValue(new Promise(() => {}));
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(document.querySelector('[class*="skeleton"]')).toBeTruthy();
  });

  test("shows error state", async () => {
    vi.mocked(getUser).mockRejectedValue(new Error("Failed"));
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(
      await screen.findByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Can't load this user now. Try again later."),
    ).toBeInTheDocument();
  });

  test("shows not found when user is null", async () => {
    vi.mocked(getUser).mockResolvedValue(null as unknown as UserProfile);
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(
      await screen.findByRole("heading", { name: "User not found" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("This user doesn't exist."),
    ).toBeInTheDocument();
  });

  test("shows no wishlists message when wishlists are undefined", async () => {
    vi.mocked(getUserWishlists).mockResolvedValue(
      undefined as unknown as Wishlist[],
    );
    renderWithClient(<UserProfilePage userId="user-1" />);

    expect(await screen.findByText("No wishlists here")).toBeInTheDocument();
    expect(
      await screen.findByText(
        "This user hasn't shared any public wishlists yet.",
      ),
    ).toBeInTheDocument();
  });
});
