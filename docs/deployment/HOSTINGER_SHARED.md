# Hostinger Shared / Node.js Deployment Guide

This guide details how to deploy Stravex CMS 2.0 to Hostinger's standard shared hosting or premium Node.js environments without a full VPS.

## Prerequisites
- A Hostinger plan that supports **Node.js**.
- SSH access to your Hostinger account.
- A registered domain (e.g., `yourdomain.com`).
- A production database (SQLite can be used for low traffic, but Turso/PostgreSQL is recommended).

## Step 1: Prepare the Build Locally
Because shared hosting environments often have strict memory and CPU limits, compiling the Next.js application on the server may fail. It is highly recommended to build locally.

1. Clone your repository locally.
2. Run `npm install`.
3. Set your local `.env` with production keys temporarily.
4. Run `npm run build`.
5. Compress the entire project (including `.next`, `node_modules`, `public`, `prisma`, and `package.json`) into a `build.zip` file.
   *Note: Do NOT upload the `.git` directory.*

## Step 2: Upload to Hostinger
1. Log in to your Hostinger hPanel.
2. Go to **File Manager**.
3. Navigate to `public_html` (or your target sub-directory).
4. Upload `build.zip` and extract it directly into the directory.

## Step 3: Configure Environment Variables
In the root directory of your Hostinger environment, create a `.env` file containing:

```env
DATABASE_URL="file:./prod.db"
AUTH_SECRET="your_secure_secret"
AUTH_URL="https://yourdomain.com"
AUTH_TRUST_HOST="true"
AUTH_GOOGLE_ID="your_google_id"
AUTH_GOOGLE_SECRET="your_google_secret"
ADMIN_EMAILS="your.email@example.com"
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## Step 4: Initialize the Database
If you are using SQLite, the database file will be stored locally on the Hostinger server.

1. SSH into your Hostinger account.
2. Navigate to your application directory: `cd domains/yourdomain.com/public_html`
3. Run the Prisma push command to create the schema:
   ```bash
   npx prisma db push
   ```
4. Run the seed script to inject the admin emails:
   ```bash
   npx prisma db seed
   ```

## Step 5: Start the Node.js Server
Hostinger uses an integrated Node.js App Manager (often via Passenger or PM2 under the hood).

1. In hPanel, go to **Advanced > Node.js**.
2. **Application Startup File**: Enter `node_modules/next/dist/bin/next`
3. **Custom Environment Variables**: Ensure `NODE_ENV` is set to `production` and `PORT` is mapped to the internal port Hostinger assigns you.
4. Click **Save** and **Start Application**.

## Step 6: Verify Deployment
1. Open `https://yourdomain.com` in your browser.
2. Navigate to `https://yourdomain.com/admin` to confirm the Google OAuth boundary is strictly enforced.
3. Check the **Deployment Checklist** (`DEPLOYMENT_CHECKLIST.md`) for final sign-off.
