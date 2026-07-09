# Production Deployment Checklist

Before deploying Stravex Technologies CMS 2.0 to a production environment (such as Hostinger VPS or Vercel), ensure every item on this checklist is verified.

## 1. Repository & Codebase
- [ ] Ensure the `main` branch is up to date and passing all GitHub Actions CI checks (`npm run lint`, `npx tsc --noEmit`).
- [ ] Confirm no hardcoded `localhost` URLs exist in production data fetching or Server Actions.

## 2. Environment Variables
- [ ] `DATABASE_URL` is set to the production database (e.g., Turso/PostgreSQL).
- [ ] `AUTH_SECRET` is securely generated (e.g., via `npx auth secret`) and kept private.
- [ ] `AUTH_URL` is explicitly set to the production domain (e.g., `https://www.stravex.com`).
- [ ] `AUTH_TRUST_HOST` is set to `true` (mandatory for custom Node servers to prevent NextAuth `UntrustedHost` errors).
- [ ] `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are configured with the correct production credentials.
- [ ] `ADMIN_EMAILS` is configured with authorized Google account emails.

## 3. Database & Prisma
- [ ] The production database is accessible from the deployment server.
- [ ] Run `npx prisma db push` or `prisma migrate deploy` to ensure the production schema is up to date.
- [ ] Run `npx prisma db seed` to insert the `ADMIN_EMAILS` into the `User` table for admin access.

## 4. External Integrations
- **Google OAuth**:
  - [ ] The Google Cloud Console has the production domain added to **Authorized JavaScript origins**.
  - [ ] The Google Cloud Console has `https://www.yourdomain.com/api/auth/callback/google` added to **Authorized redirect URIs**.
- **Cloudinary**:
  - [ ] `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correctly set.
  - [ ] Test a media upload manually to ensure the folder structure (`/stravex/`) is created successfully.

## 5. Domain & SSL
- [ ] DNS A/AAAA records point to the correct production server IP address.
- [ ] SSL certificate (e.g., Let's Encrypt / Certbot) is installed and active.
- [ ] HTTP to HTTPS redirect is configured (if using Nginx/Apache reverse proxy).

## 6. Build & Start
- [ ] Run `npm run build` on the deployment server and ensure it succeeds without errors.
- [ ] Start the application via PM2 or equivalent process manager: `pm2 start npm --name "stravex-cms" -- run start -- -p 3000`.

## 7. Smoke Tests
- [ ] **Public Routes**: Visit the homepage, `/products`, and `/blog`. Verify 200 OK responses and proper hydration.
- [ ] **Admin Boundary**: Visit `/admin` in an incognito window. Verify it correctly redirects to the Google OAuth login page (HTTP 307).
- [ ] **Admin Login**: Log in with an authorized Google account. Verify successful entry into the dashboard.
- [ ] **Forms**: Submit a test message on the Contact page to verify Server Actions execute properly in production.

## 8. Rollback Plan
- [ ] Ensure a database snapshot/backup is taken prior to deploying a new major version.
- [ ] Have the Git commit hash of the previous stable release documented and ready to `git reset --hard` if an immediate rollback is required.
