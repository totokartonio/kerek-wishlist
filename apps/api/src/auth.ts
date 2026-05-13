import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@wishlist/database";
import { AVATAR_ICONS } from "@wishlist/icons";

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  advanced: {
    ...(isProd && {
      crossSubdomainCookies: {
        enabled: true,
      },
    }),
    defaultCookieAttributes: {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    },
  },
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  user: {
    additionalFields: {
      avatar: {
        type: "string",
        required: false,
        input: false,
      },
    },
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await prisma.item.updateMany({
          where: { claimedByUserId: user.id },
          data: { claimedByUserId: null },
        });
        await prisma.wishlist.deleteMany({
          where: { ownerId: user.id },
        });
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const randomAvatar =
            AVATAR_ICONS[Math.floor(Math.random() * AVATAR_ICONS.length)];
          return {
            data: {
              ...user,
              avatar: randomAvatar,
            },
          };
        },
      },
    },
  },
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        const anonymousId = anonymousUser.user.id;
        const newId = newUser.user.id;

        await prisma.$transaction(async (tx) => {
          // Transfer claims
          await tx.item.updateMany({
            where: { claimedByUserId: anonymousId },
            data: { claimedByUserId: newId },
          });

          // Find wishlists where the new user is already a collaborator —
          // we can't move the anonymous row there due to the unique constraint
          const existingMemberships = await tx.collaborator.findMany({
            where: { userId: newId },
            select: { wishlistId: true },
          });

          const existingWishlistIds = existingMemberships.map(
            (m) => m.wishlistId,
          );

          // Delete anonymous collaborations on wishlists where new user already has a row
          if (existingWishlistIds.length > 0) {
            await tx.collaborator.deleteMany({
              where: {
                userId: anonymousId,
                wishlistId: { in: existingWishlistIds },
              },
            });
          }

          // Transfer the rest
          await tx.collaborator.updateMany({
            where: { userId: anonymousId },
            data: { userId: newId },
          });
        });
      },
    }),
  ],
});
