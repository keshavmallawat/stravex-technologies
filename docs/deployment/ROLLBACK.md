# Production Rollback Strategy

In the event of a catastrophic failure during or immediately following a new deployment, execute this rollback strategy to restore the application to its previous stable state.

## 1. Code Rollback

If the issue is caused by an application bug or a bad build:

1. SSH into the production server.
2. Navigate to the application directory: `cd /var/www/stravex`
3. Identify the last stable commit hash using `git log`.
4. Hard reset the repository:
   ```bash
   git reset --hard <STABLE_COMMIT_HASH>
   ```
5. Reinstall dependencies to match the stable state:
   ```bash
   npm ci
   ```
6. Rebuild the application:
   ```bash
   npm run build
   ```
7. Restart the PM2 process:
   ```bash
   pm2 restart stravex-cms
   ```

## 2. Database Rollback

If a database migration (`npx prisma db push` or `prisma migrate deploy`) caused data corruption or schema incompatibilities:

1. Stop the application server:
   ```bash
   pm2 stop stravex-cms
   ```
2. Locate the database snapshot taken prior to deployment (e.g., in `/db-backups/`).
3. Restore the snapshot:
   - For SQLite: Simply overwrite `prod.db` with the backup file.
   - For PostgreSQL/Turso: Execute a point-in-time recovery via your database provider's dashboard or restore from a SQL dump.
4. Verify the database connection and schema integrity.
5. Perform the **Code Rollback** (Step 1) to ensure the application code matches the restored schema.
6. Restart the application.

## 3. Post-Rollback Verification
1. Monitor application logs: `pm2 logs stravex-cms`
2. Perform smoke tests (verify homepage, admin login, and a basic CRUD operation).
3. Document the incident and the root cause for the post-mortem analysis.
