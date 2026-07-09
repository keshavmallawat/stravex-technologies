# Development Guide

Welcome to the Stravex Technologies CMS 2.0 development documentation.

## Local Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/stravex-website.git
   cd stravex-website
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in the values for Database, Auth.js, and Cloudinary.

3. **Database Initialization**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Folder Conventions
- `src/app/(public)`: All frontend public-facing routes.
- `src/app/admin/(dashboard)`: All authenticated CMS backend routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, Prisma client instance, and Cloudinary SDK logic.
- `docs/`: Technical documentation and reports.

## Adding a New CMS Module
To add a new entity to the CMS (e.g., `Testimonials`):
1. **Schema**: Add `model Testimonial { ... }` to `prisma/schema.prisma`.
2. **Database**: Run `npx prisma db push`.
3. **Admin UI**: Create `src/app/admin/(dashboard)/testimonials/page.tsx` for the list view.
4. **Forms**: Create a reusable form component inside a `_components/` subfolder.
5. **Server Actions**: Create `actions.ts` for handling CRUD operations.
6. **Public Route**: Fetch the data directly via Prisma in `src/app/(public)/testimonials/page.tsx`.

## Coding Standards
- **TypeScript**: Strict typing required. Avoid `any`.
- **Styling**: Tailwind CSS v4 using semantic class names.
- **Data Fetching**: Use React Server Components (RSC) for data fetching. Never use `useEffect` for initial data loads.
- **Commits**: Follow conventional commit messages (e.g., `feat: add testimonials module`).
