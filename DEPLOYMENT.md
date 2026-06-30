# Bodega Robles API - Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS certificates obtained
- [ ] Monitoring system setup
- [ ] Logging system configured
- [ ] Rate limiting implemented
- [ ] Security headers verified
- [ ] CORS origins configured
- [ ] JWT secret is strong and unique
- [ ] Database credentials stored securely

## Production Environment Setup

### 1. Environment Configuration

Create `.env.production`:

```env
PORT=3000
NODE_ENV=production

# Database
DB_HOST=your-production-db-host
DB_PORT=3306
DB_NAME=bodega_robles
DB_USER=bodega_user
DB_PASSWORD=strong_password_here

# Security
JWT_SECRET=generate_with_$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# API
API_BASE_URL=https://api.bodega-robles.com
```

### 2. Database Setup

```bash
# On production server
mysql -u root -p
CREATE DATABASE bodega_robles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bodega_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON bodega_robles.* TO 'bodega_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Install Dependencies

```bash
# On production server
cd /var/www/bodega-robles-api
pnpm install --prod
```

### 4. Run Migrations

```bash
pnpm run migrate
```

### 5. Seed Initial Data (Optional)

```bash
pnpm run seed
```

## Deployment Options

### Option A: Traditional VPS (Linux Server)

#### Prerequisites
- Ubuntu 20.04 LTS or similar
- Node.js 16+ installed
- MySQL 5.7+ installed
- Nginx installed

#### Steps

1. **Create Application Directory**:
```bash
sudo mkdir -p /var/www/bodega-robles-api
sudo chown -R $USER:$USER /var/www/bodega-robles-api
```

2. **Clone/Upload Code**:
```bash
cd /var/www/bodega-robles-api
# Copy files here
```

3. **Install Dependencies**:
```bash
cd /var/www/bodega-robles-api
pnpm install --prod
```

4. **Setup PM2 (Process Manager)**:
```bash
sudo npm install -g pm2
pm2 start src/server.js --name "bodega-api" --instances max
pm2 startup
pm2 save
```

5. **Configure Nginx Reverse Proxy**:

Create `/etc/nginx/sites-available/bodega-robles-api`:

```nginx
upstream bodega_api {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name api.bodega-robles.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.bodega-robles.com;

    ssl_certificate /etc/letsencrypt/live/api.bodega-robles.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.bodega-robles.com/privkey.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://bodega_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/bodega-robles-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **Setup SSL Certificate (Let's Encrypt)**:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d api.bodega-robles.com
```

7. **Setup Log Rotation**:

Create `/etc/logrotate.d/bodega-api`:

```
/var/www/bodega-robles-api/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 nobody nobody
    sharedscripts
}
```

### Option B: Docker Container

#### Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

# Copy application
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "src/server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: bodega_robles
      MYSQL_USER: bodega_user
      MYSQL_PASSWORD: db_password
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - bodega-network

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: database
      DB_USER: bodega_user
      DB_PASSWORD: db_password
      DB_NAME: bodega_robles
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - database
    networks:
      - bodega-network
    restart: unless-stopped

volumes:
  mysql_data:

networks:
  bodega-network:
    driver: bridge
```

Deploy with:
```bash
docker-compose up -d
```

### Option C: Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel

# Configure environment variables via Vercel dashboard
```

### Option D: AWS/Cloud Deployment

#### AWS EC2
```bash
# Launch EC2 instance
# Connect via SSH
# Follow "Option A: Traditional VPS" steps
```

#### AWS RDS for Database
```bash
# Create RDS MySQL instance
# Note the endpoint
# Configure DB_HOST in .env to RDS endpoint
```

## Monitoring & Logging

### 1. Application Logging

```javascript
// Add to src/server.js
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.path}\n`;
  fs.appendFileSync(path.join(logsDir, 'access.log'), log);
  next();
});
```

### 2. Error Monitoring (Sentry)

```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

### 3. Database Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

mysqldump -u bodega_user -p$MYSQL_PASSWORD bodega_robles > \
  $BACKUP_DIR/bodega_robles_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
```

## Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_producto_categoria ON productos(categoria_id);
CREATE INDEX idx_compra_proveedor ON compras(proveedor_id);
CREATE INDEX idx_pedido_cliente ON pedidos(cliente_id);
CREATE INDEX idx_inventario_producto ON inventario_movimientos(producto_id);
```

### 2. Connection Pooling

Already configured in `src/config/database.js`:
```javascript
pool: {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
}
```

### 3. Query Optimization

- Add indexes for frequently queried fields
- Use eager loading with `include` in Sequelize
- Paginate list endpoints
- Cache frequently accessed data

### 4. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

## Security Hardening

### 1. Security Headers

Already configured with Helmet:
```javascript
app.use(helmet());
```

### 2. CORS Configuration

Update `src/server.js`:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### 3. SQL Injection Prevention

- Use parameterized queries (Sequelize does this by default)
- Validate all inputs
- Sanitize output

### 4. Authentication Security

- Use strong JWT_SECRET
- Implement token refresh mechanism
- Set appropriate JWT expiration
- Enable HTTPS only

### 5. Database Security

- Create separate DB user with limited privileges
- Use strong passwords
- Enable SSL connections
- Regular security updates

## Troubleshooting

### Issue: API not starting

```bash
# Check logs
pm2 logs bodega-api

# Or manually
node src/server.js
```

### Issue: Database connection errors

```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME

# Check .env file
cat .env
```

### Issue: High memory usage

```bash
# Restart PM2 app
pm2 restart bodega-api

# Check memory usage
pm2 monit
```

### Issue: Nginx errors

```bash
# Test configuration
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/error.log
```

## Rollback Procedure

```bash
# Backup current code
cp -r /var/www/bodega-robles-api /var/www/bodega-robles-api.backup

# Restore previous version
git checkout previous_commit

# Restart service
pm2 restart bodega-api
```

## Monitoring Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs bodega-api

# Monitor in real-time
pm2 monit

# Check database status
mysql -e "STATUS;"

# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top
```

## Maintenance Tasks

- [ ] Monthly: Review logs for errors
- [ ] Quarterly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Daily: Monitor disk space
- [ ] Daily: Monitor uptime
- [ ] Weekly: Review performance metrics
- [ ] Monthly: Database optimization

## Contact & Support

- Production Issues: ops@bodega-robles.com
- Security Issues: security@bodega-robles.com
- General Support: support@bodega-robles.com

---

**Last Updated**: 2024
**Version**: 1.0.0
