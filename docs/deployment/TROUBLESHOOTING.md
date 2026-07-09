# Deployment Troubleshooting

If you encounter issues during or after deployment, refer to this troubleshooting guide for common resolutions.

## 1. NextAuth / Authentication Errors

### Error: `UntrustedHost: Host must be trusted.`
**Symptom:** When attempting to log in, you receive an error page or server logs indicate an `UntrustedHost` error.
**Cause:** Auth.js v5 enforces strict host checking when running on a custom server (like PM2 or a VPS).
**Fix:** Ensure your production `.env` file explicitly defines:
```env
AUTH_URL="https://www.yourdomain.com"
AUTH_TRUST_HOST="true"
```
Restart the server after modifying `.env`.

### Error: `OAuthCallback` or `redirect_uri_mismatch`
**Symptom:** Google OAuth login fails and returns a mismatch error.
**Cause:** The domain you are logging in from is not whitelisted in the Google Cloud Console.
**Fix:** In the Google Cloud Console, add `https://www.yourdomain.com/api/auth/callback/google` to the **Authorized redirect URIs** for your OAuth client.

## 2. Database Issues

### Error: `PrismaClientInitializationError` or `Connection refused`
**Symptom:** The application starts but crashes immediately when attempting to fetch data.
**Cause:** The application cannot connect to the database specified in `DATABASE_URL`.
**Fix:** Verify the `DATABASE_URL` is correct. If using SQLite, ensure the file path is correct and the application process has read/write permissions to the `.db` file and its containing directory.

## 3. Media Upload Failures

### Error: `Must supply api_key` or Cloudinary API rejections
**Symptom:** Uploading an image via the Media Library fails silently or throws an API error.
**Cause:** The Cloudinary environment variables are missing, malformed, or invalid.
**Fix:** Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your `.env` file. Do not wrap the values in quotes if they contain special characters that might conflict.

## 4. Build Errors

### Error: Out of Memory (OOM) during `npm run build`
**Symptom:** The build process hangs or is killed by the OS (common on smaller Hostinger shared plans or 1GB VPS instances).
**Cause:** Next.js compilation requires significant RAM.
**Fix:** Build the application locally and upload the `.next` directory to the server, or temporarily increase the server's swap space.

## 5. CSS / Styling Not Applying

### Symptom: The production site loads HTML but no Tailwind CSS styling is applied.
**Cause:** The build cache is stale or PostCSS failed during the build.
**Fix:** Delete the `.next` directory and rebuild:
```bash
rm -rf .next
npm run build
```
