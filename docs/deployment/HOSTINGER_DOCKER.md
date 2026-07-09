# Hostinger Docker Deployment Guide

For enterprise scalability, Stravex CMS 2.0 can be deployed using Docker on a Hostinger VPS.

## Prerequisites
- A Hostinger VPS running Ubuntu.
- Docker and Docker Compose installed.

## Step 1: Create Dockerfile
Ensure a `Dockerfile` exists in the project root. (A standalone Next.js Dockerfile is recommended for production).

```dockerfile
# Minimal Dockerfile for Next.js
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Environment variables must be passed during build if they affect the build output
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## Step 2: Configure `docker-compose.yml`
Create a `docker-compose.yml` file to manage the application and potentially a PostgreSQL database container.

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: always
```

## Step 3: Deployment Execution
1. SSH into the Hostinger VPS.
2. Clone the repository and navigate into it.
3. Create the `.env.production` file with all required production variables.
4. Run Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

## Step 4: Reverse Proxy
Configure Nginx on the host machine to route port 80/443 traffic to the Docker container on port 3000 (refer to Step 4 in `HOSTINGER_VPS.md`).
