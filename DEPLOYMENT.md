# Research OS — Production Deployment Guide

This guide covers deployment instructions for **Research OS** across multiple hosting environments.

---

## Architecture in Production

```
              Internet / Users (HTTPS)
                         │
                         ▼
                Reverse Proxy (Nginx)
                         │
         ┌───────────────┴───────────────┐
         │ (Static Assets & SPA Routing) │ (/api/* Proxy)
         ▼                               ▼
    Frontend Web App             Backend API Server
(React 18 / Vite / Nginx)      (Express.js / Node.js 18)
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
               PostgreSQL 15 + pgvector               Redis 7
                  (Primary Database)             (Caching & Queue)
```

---

## Option 1: One-Command Docker Production Deployment

If deploying to a Cloud VPS (AWS EC2, DigitalOcean Droplet, GCP Compute Engine, Hetzner, Linode):

### 1. Copy repository to server
```bash
git clone <your-repository-url>
cd "research-os"
```

### 2. Configure environment variables
Create `.env` based on `.env.example`:
```bash
cp .env.example .env
```
Ensure you update:
- `POSTGRES_PASSWORD`: Use a strong 32+ character random secret
- `JWT_SECRET`: Use a strong 64+ character random secret
- `CORS_ORIGIN`: Set to your production domain (e.g., `https://research.yourdomain.com`)

### 3. Launch with Docker Compose
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### 4. Verify deployment
```bash
# Check container status
docker compose -f docker-compose.prod.yml ps

# View backend logs
docker compose -f docker-compose.prod.yml logs -f backend

# Test health check
curl http://localhost/health
```

---

## Option 2: Managed Cloud Platforms (Vercel + Render/Railway + Neon/Supabase)

### 1. Managed PostgreSQL Database
Deploy a free/paid PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com):
1. Create a new PostgreSQL instance.
2. In the SQL Editor, execute the contents of [`database/schema.sql`](./database/schema.sql) to provision all 22 tables, indexes, and full-text search triggers.
3. Copy the database connection URL (`postgresql://user:password@host:5432/dbname?sslmode=require`).

### 2. Backend Deployment (Render / Railway / Fly.io)
1. **Root Directory**: `backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `node dist/app.js`
4. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=3000
   DB_HOST=<your-db-host>
   DB_PORT=5432
   DB_NAME=<your-db-name>
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   DB_SSL=true
   JWT_SECRET=<your-jwt-secret-min-32-chars>
   JWT_EXPIRY=24h
   CORS_ORIGIN=https://<your-frontend-domain>.vercel.app
   ```

### 3. Frontend Deployment (Vercel / Netlify)
1. **Root Directory**: `frontend`
2. **Framework Preset**: Vite
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variables**:
   ```env
   VITE_API_URL=https://<your-backend-domain>.onrender.com/api/v1
   ```

---

## Production Security Checklist

- [x] Passwords securely hashed with bcrypt (cost factor 12)
- [x] Stateless JWT authentication (HS256) with token expiration
- [x] Rate limiting configured for API abuse prevention
- [x] Helmet security headers active
- [x] CORS origin locked to authorized frontend domains
- [x] Input payloads strictly validated via Zod schemas
- [x] SQL injection protection via TypeORM parameterized queries
- [x] Multi-stage Docker builds minimizing production image footprint
- [x] Non-root `node` user executing backend process in containers
