import { Hono } from "hono";
import { prisma } from "@wishlist/database";
import type { AuthVariables } from "../middleware/auth";
import { auth } from "../auth";
import { AVATAR_ICONS } from "@wishlist/icons";

const users = new Hono<{ Variables: AuthVariables }>();

users.get("/check-email", async (c) => {
  const email = c.req.query("email");

  if (!email) {
    return c.json({ error: "Email is required" }, 400);
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return c.json({ taken: !!user });
});

users.patch("/me", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json<{ avatar: string }>();

    if (!body.avatar || !AVATAR_ICONS.includes(body.avatar)) {
      return c.json({ error: "Invalid avatar" }, 400);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: body.avatar },
      select: { id: true, name: true, avatar: true },
    });

    return c.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

users.get("/me/has-password", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "credential",
    },
    select: { id: true },
  });

  return c.json({ hasPassword: !!account });
});

users.get("/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const user = await prisma.user.findUnique({
      select: { id: true, name: true, avatar: true },
      where: { id: userId },
    });
    if (!user) return c.json({ error: "User not found" }, 404);

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

users.get("/:userId/wishlists", async (c) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const requesterId = session?.user.id ?? null;
    const userId = c.req.param("userId");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return c.json({ error: "User not found" }, 404);

    const wishlists = await prisma.wishlist.findMany({
      where: {
        ownerId: userId,
        OR: [
          { visibility: "public" },
          ...(requesterId
            ? [{ collaborators: { some: { userId: requesterId } } }]
            : []),
        ],
      },
    });

    return c.json(wishlists);
  } catch (error) {
    console.error("Error fetching user wishlists:", error);
    return c.json({ error: "Failed to fetch user wishlists" }, 500);
  }
});

export default users;
