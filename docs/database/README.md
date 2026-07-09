# Database Architecture

Stravex CMS 2.0 uses **Prisma ORM** as the database layer.

## Schema Overview
The complete database schema is located at `prisma/schema.prisma`.

### Core Entities
1. **User & Session**: Managed automatically by the Auth.js Prisma Adapter. The `ADMIN_EMAILS` environment variable seeds the `User` table to authorize admin access.
2. **MediaAsset**: Central repository for all images uploaded to Cloudinary.
3. **SeoMetadata**: A shared model linked via 1-to-1 relationships to public-facing content (Products, Blog, News, etc.).

### CMS Modules
Every module (Products, Technologies, Team, etc.) has its own strictly typed Prisma model. Example:
```prisma
model Product {
  id              String       @id @default(cuid())
  slug            String       @unique
  name            String
  // ... fields
  seoMetadataId   String?      @unique
  seoMetadata     SeoMetadata? @relation(fields: [seoMetadataId], references: [id])
}
```

## Migration Strategy
- **Development**: Use `npx prisma db push` for rapid prototyping without creating migration history files.
- **Production**: For enterprise scale, transition to `npx prisma migrate dev` to generate strict SQL migration files, and use `npx prisma migrate deploy` in production CI/CD pipelines.

## Database Provider
The project currently defaults to SQLite (`file:./qa.db`) for portability and zero-config deployment. To scale to a serverless edge database like **Turso**, simply change the `provider` in `schema.prisma` to `sqlite` using the LibSQL driver, or change it to `postgresql` if migrating to AWS RDS / Supabase.
