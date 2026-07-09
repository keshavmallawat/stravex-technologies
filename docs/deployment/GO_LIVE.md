# Stravex CMS 2.0 Go-Live Sequence

This document defines the exact step-by-step sequence for launching Stravex CMS 2.0 into production.

## 1. Preparation
1. Ensure the `DEPLOYMENT_CHECKLIST.md` is 100% complete.
2. Confirm the production domain DNS records have propagated.
3. Validate all environment variables in `.env` (Database, Auth, Cloudinary).

## 2. Server Initialization
1. Clone the repository onto the production server.
2. Install dependencies: `npm ci`
3. Push the database schema: `npx prisma db push`
4. Seed the initial admin accounts: `npx prisma db seed`
5. Build the application: `npm run build`
6. Start the server via PM2: `pm2 start npm --name "stravex-cms" -- run start -- -p 3000`

## 3. Production Verification
Once the server is running, perform the following manual checks:

### Public Routes
- [ ] Homepage loads correctly and hydration completes without errors.
- [ ] Blog page loads all dynamic articles.
- [ ] Products page displays all active products.
- [ ] Contact form submission succeeds.
- [ ] Careers form submission succeeds.

### Admin Dashboard
- [ ] Navigating to `/admin` without authentication correctly redirects to the Google OAuth login prompt.
- [ ] Logging in with an authorized Google account (from `ADMIN_EMAILS`) grants access to the dashboard.
- [ ] The dashboard loads without errors.
- [ ] Create a test News article. Verify it appears on the public `/news` page.
- [ ] Delete the test News article.

### Media Library
- [ ] Upload a test image to the Media Library.
- [ ] Confirm the image renders correctly in the dashboard preview.
- [ ] Confirm the image was successfully pushed to Cloudinary.
- [ ] Delete the test image and confirm it is removed from Cloudinary.

## 4. Post-Launch
- [ ] Generate or confirm the `sitemap.xml` and `robots.txt` are serving correctly at the root of the domain.
- [ ] Submit the sitemap to Google Search Console.
- [ ] Verify SSL certificate rating via SSL Labs (Target: A+).
