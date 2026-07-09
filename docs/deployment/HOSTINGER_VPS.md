# Hostinger VPS Deployment Guide

This guide details the enterprise-grade deployment of Stravex CMS 2.0 on a Hostinger Virtual Private Server (VPS) running Ubuntu.

## Prerequisites
- A Hostinger VPS running Ubuntu 22.04 or later.
- SSH access.
- A registered domain (e.g., `yourdomain.com`).
- Git installed on the VPS.

## Step 1: Server Setup
SSH into your VPS and install the required dependencies:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20+)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Reverse Proxy)
sudo apt install -y nginx

# Install Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Clone and Build the Application
```bash
# Navigate to web directory
cd /var/www

# Clone repository
git clone https://github.com/your-username/stravex-website.git stravex
cd stravex

# Install dependencies
npm install

# Create environment file
nano .env
```
Paste your production environment variables (see `.env.example`). Remember to set `AUTH_URL="https://yourdomain.com"` and `AUTH_TRUST_HOST="true"`.

```bash
# Initialize Database Schema
npx prisma db push

# Seed Admin Emails
npx prisma db seed

# Build the Next.js application
npm run build
```

## Step 3: Start the Server with PM2
We use PM2 to keep the Next.js server alive and automatically restart it on crashes or reboots.

```bash
# Start the application
pm2 start npm --name "stravex-cms" -- run start -- -p 3000

# Save PM2 state
pm2 save

# Ensure PM2 starts on server boot
pm2 startup
```

## Step 4: Configure Nginx as a Reverse Proxy
We need to route traffic from port 80/443 to our Next.js application running on port 3000.

```bash
sudo nano /etc/nginx/sites-available/stravex
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/stravex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Secure with SSL (Let's Encrypt)
Run Certbot to automatically fetch and configure an SSL certificate.

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Select the option to **Redirect** all HTTP traffic to HTTPS.

## Step 6: Verify Deployment
Visit `https://yourdomain.com` and ensure the application loads securely. Verify the admin boundary via `https://yourdomain.com/admin`.
