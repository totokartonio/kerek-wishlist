-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Collaborator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wishlistId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Collaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Collaborator_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Collaborator" ("createdAt", "id", "role", "userId", "wishlistId") SELECT "createdAt", "id", "role", "userId", "wishlistId" FROM "Collaborator";
DROP TABLE "Collaborator";
ALTER TABLE "new_Collaborator" RENAME TO "Collaborator";
CREATE UNIQUE INDEX "Collaborator_wishlistId_userId_key" ON "Collaborator"("wishlistId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
