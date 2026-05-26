# Kérek

A collaborative wishlist app for sharing what you want with the people who want to give it to you.

🌐 **Live:** [kerek-wishlist.netlify.app](https://kerek-wishlist.netlify.app)

## Features

- **Wishlists** — create, edit, and share wishlists with custom icons and visibility (private, public, or invite-only)
- **Items** — add wishes with optional price, currency, link, and image
- **Collaborators** — share via invite links with role-based access (owner / editor / viewer)
- **Claim system** — collaborators can claim items as gifts, with optional "surprise mode" hiding claims from the wishlist owner
- **Authentication** — email/password or Google OAuth, with anonymous mode for casual claimers
- **Custom avatars** — choose from a set of playful animal icons
- **Image uploads** — upload custom images for wishlist items
- **Filtering & sorting** — by status, claim, archive, name, price, or date
- **Mobile-friendly** — responsive layout with table/grid view toggle

## Tech Stack

**Frontend**

- React 19 + TypeScript + Vite
- TanStack Router (file-based) + TanStack Query
- Better Auth (client)
- Cloudinary (image uploads)

**Backend**

- Bun runtime
- Hono (HTTP framework)
- Better Auth (server)
- Prisma ORM + PostgreSQL
- Cloudinary (image management)

**Infra**

- Frontend: Netlify
- Backend: Railway
- Database: Neon (Postgres)
- Image CDN: Cloudinary

## Project Structure

```
apps/
  api/              Hono backend
  web/              React frontend
packages/
  database/         Prisma schema and client
  types/            Shared TypeScript types
  icons/            Shared icon slug arrays
```

## Local Development

### Prerequisites

- [Bun](https://bun.sh) (latest)
- [Docker](https://www.docker.com) (for local Postgres)

### Setup

1. **Clone and install:**

   ```sh
   git clone <repo-url>
   cd wishlist
   bun install
   ```

2. **Start Postgres:**

   ```sh
   docker run -d \
     --name wishlist-db \
     -e POSTGRES_PASSWORD=wishlist \
     -e POSTGRES_DB=wishlist \
     -p 5432:5432 \
     postgres:16
   ```

3. **Set up environment files:**

   `apps/api/.env`:

   ```
   DATABASE_URL=postgresql://postgres:wishlist@localhost:5432/wishlist
   BETTER_AUTH_SECRET=any-long-random-string
   BETTER_AUTH_URL=http://localhost:3000
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-oauth-client-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   CLOUDINARY_UPLOAD_PRESET=wishlist-items
   ```

   `packages/database/.env`:

   ```
   DATABASE_URL=postgresql://postgres:wishlist@localhost:5432/wishlist
   ```

   `apps/web/.env.local`:

   ```
   VITE_API_URL=http://localhost:3000
   VITE_APP_URL=http://localhost:5173
   VITE_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   VITE_CLOUDINARY_UPLOAD_PRESET=wishlist-items
   ```

4. **Run migrations:**

   ```sh
   cd packages/database
   bun run prisma migrate dev
   ```

5. **Start the apps** (in separate terminals):

   ```sh
   # API (from apps/api)
   bun run dev

   # Web (from apps/web)
   bun run dev
   ```

   Open http://localhost:5173

## Scripts

```sh
bun run test         # Run all tests
bun run lint         # Lint all packages
bun run typecheck    # Type-check all packages
```

## Credits

Icons and illustrations by [Clay Bees](https://www.figma.com/community/file/1297572418007896814)
