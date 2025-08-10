# Deployment Guide

## Overview

This guide covers deployment options for the Web Terminal application, from development environments to production hosting platforms.

## Quick Deploy Options

### 🔴 Replit (Recommended)

The easiest way to deploy Web Terminal is on Replit, which provides an integrated development and hosting environment.

**Steps:**
1. Import the repository to Replit
2. Dependencies install automatically
3. Click "Run" to start the application
4. Your app is live at `https://your-repl-name.your-username.repl.co`

**Advantages:**
- Zero configuration required
- Automatic HTTPS
- Built-in database options
- Real-time collaboration
- Mobile-friendly editing

### 🔵 Vercel

Deploy the frontend and backend together using Vercel's full-stack capabilities.

**Steps:**
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: dist/public
   Install Command: npm install
   ```
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

**Configuration:**
```json
// vercel.json
{
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server/index.ts" },
    { "src": "/(.*)", "dest": "/client/$1" }
  ]
}
```

### 🟢 Railway

Railway provides simple deployment with PostgreSQL database support.

**Steps:**
1. Connect GitHub repository to Railway
2. Add PostgreSQL plugin
3. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   NODE_ENV=production
   ```
4. Deploy with automatic builds

### 🟡 Heroku

Traditional PaaS deployment with add-on ecosystem.

**Steps:**
1. Install Heroku CLI
2. Create application:
   ```bash
   heroku create your-app-name
   ```
3. Add PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

## Self-Hosted Deployment

### Prerequisites

- **Server**: Linux VPS (Ubuntu 20.04+ recommended)
- **Node.js**: 18+ installed
- **Database**: PostgreSQL (optional)
- **Reverse Proxy**: Nginx or Apache
- **SSL Certificate**: Let's Encrypt recommended

### Server Setup

#### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install PostgreSQL (optional)
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx
```

#### 2. Clone and Build

```bash
# Clone repository
git clone https://github.com/emiliancristea/webterminal.git
cd webterminal

# Install dependencies
npm install

# Build for production
npm run build

# Test the build
npm start
```

#### 3. Process Management with PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'webterminal',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DATABASE_URL: 'postgresql://user:password@localhost:5432/webterminal'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 4. Nginx Configuration

```nginx
# /etc/nginx/sites-available/webterminal
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Serve static files
    location / {
        root /path/to/webterminal/dist/public;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings for long-running commands
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket specific settings
        proxy_set_header Sec-WebSocket-Extensions $http_sec_websocket_extensions;
        proxy_set_header Sec-WebSocket-Key $http_sec_websocket_key;
        proxy_set_header Sec-WebSocket-Version $http_sec_websocket_version;
        
        # Prevent timeout on WebSocket connections
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/webterminal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S webterminal -u 1001

# Change to non-root user
USER webterminal

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/webterminal
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=webterminal
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

```bash
# Deploy with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Update deployment
git pull
docker-compose build
docker-compose up -d
```

## Environment Configuration

### Production Environment Variables

```bash
# Required
NODE_ENV=production
PORT=3000

# Database (optional)
DATABASE_URL=postgresql://user:password@host:5432/database

# Security (recommended)
SESSION_SECRET=your-random-secret-key
CORS_ORIGIN=https://your-domain.com

# Monitoring (optional)
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn
```

### Environment-Specific Configs

#### Development
```bash
NODE_ENV=development
PORT=5173
LOG_LEVEL=debug
```

#### Staging
```bash
NODE_ENV=staging
PORT=3000
DATABASE_URL=postgresql://staging-db-url
LOG_LEVEL=info
```

#### Production
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://production-db-url
LOG_LEVEL=warn
```

## Database Setup

### PostgreSQL Configuration

```sql
-- Create database
CREATE DATABASE webterminal;

-- Create user
CREATE USER webterminal_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE webterminal TO webterminal_user;

-- Connect to database
\c webterminal

-- Run migrations
-- (This will be handled by Drizzle when you start the app)
```

### Database Migration

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:push

# Seed initial data (if needed)
npm run db:seed
```

## Monitoring and Logging

### Application Monitoring

```javascript
// Add to server/index.ts
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}
```

### Log Management

```bash
# PM2 logs
pm2 logs webterminal

# System logs
sudo journalctl -u nginx -f
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Checks

```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

## Security Considerations

### Server Security

```bash
# Firewall configuration
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Fail2ban for brute force protection
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### Application Security

1. **Input Validation**
   - All user inputs are validated
   - Command injection prevention
   - Path traversal protection

2. **Session Security**
   - Isolated session directories
   - Command restrictions
   - Resource limits

3. **Network Security**
   - HTTPS enforcement
   - Secure WebSocket connections
   - CORS configuration

### Security Headers

```nginx
# Add to Nginx configuration
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";
```

## Backup and Recovery

### Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
pg_dump $DATABASE_URL > backups/webterminal_$DATE.sql
find backups/ -name "*.sql" -mtime +7 -delete
```

### Application Backup

```bash
# Backup application files
tar -czf webterminal_backup_$(date +%Y%m%d).tar.gz \
  /path/to/webterminal \
  --exclude=node_modules \
  --exclude=dist
```

## Performance Optimization

### Caching

```nginx
# Nginx caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
    access_log off;
}
```

### CDN Integration

```javascript
// Use CDN for static assets in production
const CDN_URL = process.env.CDN_URL || '';

app.use(express.static('dist/public', {
    setHeaders: (res, path) => {
        if (path.match(/\.(js|css)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
    }
}));
```

## Scaling Considerations

### Load Balancing

```nginx
# Nginx load balancing
upstream webterminal_backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    location /api/ {
        proxy_pass http://webterminal_backend;
    }
}
```

### WebSocket Scaling

For multiple server instances, consider:
- Redis for session sharing
- Sticky sessions for WebSocket connections
- WebSocket clustering solutions

## Troubleshooting

### Common Deployment Issues

1. **Port Conflicts**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission Issues**
   ```bash
   sudo chown -R nodejs:nodejs /path/to/webterminal
   chmod +x dist/index.js
   ```

3. **Database Connection**
   ```bash
   # Test database connection
   pg_isready -h localhost -p 5432
   psql $DATABASE_URL -c "SELECT 1;"
   ```

4. **WebSocket Issues**
   ```bash
   # Test WebSocket connection
   wscat -c wss://your-domain.com/ws
   ```

### Log Analysis

```bash
# Application errors
pm2 logs webterminal --lines 100

# Nginx errors
sudo tail -f /var/log/nginx/error.log

# System errors
sudo journalctl -xe
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm audit fix
npm update

# Rebuild application
npm run build

# Restart with PM2
pm2 restart webterminal
```

### Monitoring Checklist

- [ ] Application uptime
- [ ] Database connectivity
- [ ] SSL certificate expiry
- [ ] Disk space usage
- [ ] Memory consumption
- [ ] WebSocket connections
- [ ] Error rates
- [ ] Response times

---

## Support

For deployment issues:
1. Check the logs first
2. Review this documentation
3. Open an issue on GitHub with deployment details
4. Include error messages and configuration

Happy deploying! 🚀