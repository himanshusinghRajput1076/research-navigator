# Local Development Setup Guide

## 🚀 Quick Start (5 minutes)

If you have Node, npm, and Docker installed:

```bash
# Clone repository (when ready)
git clone <repository>
cd research-os

# Copy environment template
cp .env.example .env

# Start database
docker-compose up -d

# Install dependencies
cd backend
npm install

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Start backend
npm run dev

# In another terminal, start frontend
cd frontend
npm install
npm run dev
```

Backend: http://localhost:3000
Frontend: http://localhost:5173

---

## 📋 Prerequisites

### Required
- **Node.js**: v18 or higher
- **npm**: v9 or higher (or use pnpm)
- **Docker**: v20+ (for PostgreSQL)
- **Docker Compose**: v1.29+
- **Git**: v2.30+

### Optional
- **pgAdmin** (included in docker-compose for database GUI)
- **VS Code** with TypeScript extension
- **Thunder Client** or **Postman** (for API testing)

---

## 💾 Installation Steps

### 1. Install Prerequisites

**macOS (using Homebrew)**
```bash
# Install Node.js and npm
brew install node

# Install Docker Desktop
brew install --cask docker

# Verify installations
node --version      # Should be v18+
npm --version       # Should be v9+
docker --version
docker-compose --version
```

**Ubuntu/Debian**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Windows**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Download Node.js installer from https://nodejs.org/
- Both include necessary tools in their installers

### 2. Clone Repository

```bash
git clone https://github.com/your-username/research-os.git
cd research-os
```

### 3. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your settings (defaults work for local dev):

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=research_os
DB_USER=research_user
DB_PASSWORD=research_password
DB_SSL=false

# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# JWT (generate random string)
JWT_SECRET=your_random_jwt_secret_here_minimum_32_chars
JWT_EXPIRY=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

**Generate JWT Secret** (if needed):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start PostgreSQL

```bash
docker-compose up -d
```

**Verify it's running:**
```bash
docker-compose ps

# Should show:
# postgres   running
# pgadmin    running
```

**Access pgAdmin** (optional):
- URL: http://localhost:5050
- Email: admin@example.com
- Password: admin

### 5. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create TypeORM configuration (if not auto-generated)
npm run typeorm:init

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Verify database
npm run db:check
```

### 6. Start Backend Development Server

```bash
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 Server running on http://localhost:3000
```

**Test the API:**
```bash
curl http://localhost:3000/api/v1/health
# Should respond with status 200
```

### 7. Frontend Setup

In a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🧪 Verify Everything Works

### 1. Test Database Connection

```bash
# In backend directory
npm run db:check
```

Expected:
```
✅ Connected to PostgreSQL
✅ Tables created: 22/22
✅ Seed data loaded
```

### 2. Test Backend API

```bash
# Registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User"
  }'

# Expected: User created with JWT token

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Expected: JWT token returned
```

### 3. Test Frontend

Visit http://localhost:5173 in browser
- Should see login page
- Able to navigate to registration

---

## 🛠️ Common Development Commands

### Backend Commands

```bash
cd backend

# Development
npm run dev              # Start with hot reload
npm run build           # Build for production
npm start               # Run production build

# Database
npm run db:migrate      # Run pending migrations
npm run db:migrate:undo # Rollback last migration
npm run db:seed         # Seed initial data
npm run db:reset        # Drop all, recreate, seed

# Testing
npm run test            # Run all tests
npm run test:unit       # Unit tests only
npm run test:int        # Integration tests only
npm run test:coverage   # With coverage report

# Linting
npm run lint            # Check for errors
npm run lint:fix        # Auto-fix errors
npm run type-check      # TypeScript checking

# Documentation
npm run docs:gen        # Generate API documentation
```

### Frontend Commands

```bash
cd frontend

# Development
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run type-check      # TypeScript checking

# Testing
npm run test            # Run tests
npm run test:ui         # Test UI
npm run test:coverage   # Coverage report

# Linting
npm run lint            # Check errors
npm run lint:fix        # Auto-fix
```

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs postgres
docker-compose logs -f

# Reset database (careful!)
docker-compose down -v    # Remove volumes too
docker-compose up -d      # Restart
npm run db:seed           # Re-seed

# Access database directly
docker-compose exec postgres psql -U research_user -d research_os
```

---

## 📊 Database Management

### Connect to PostgreSQL

**Using psql (command line):**
```bash
docker-compose exec postgres psql -U research_user -d research_os

# Inside psql:
\dt                    # List tables
\d tablename           # Describe table
SELECT COUNT(*) FROM users;
\q                     # Quit
```

**Using pgAdmin (GUI):**
1. Open http://localhost:5050
2. Add server:
   - Host: postgres
   - Port: 5432
   - User: research_user
   - Password: research_password

### Seed Data

View what's being seeded:
```bash
cat database/seeds/01_research_fields.ts
cat database/seeds/02_papers.ts
```

Clear and re-seed:
```bash
npm run db:reset    # In backend/
```

---

## 🐛 Troubleshooting

### PostgreSQL Connection Failed

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if container is running
docker-compose ps

# If not running:
docker-compose up -d

# Check logs:
docker-compose logs postgres

# If port 5432 is in use:
lsof -i :5432              # Find process
kill -9 <PID>              # Kill it
docker-compose restart     # Restart Docker container
```

### TypeORM Migration Errors

**Error**: `Migration failed`

**Solution:**
```bash
# Check what migrations exist
npm run typeorm migration:show

# Rollback problematic migration
npm run db:migrate:undo

# Create new migration from changes
npm run typeorm migration:create -n FixName
```

### Port Already in Use

**Error**: `EADDRINUSE :::3000`

**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Node Modules Issues

**Error**: `Cannot find module`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use npm clean install
npm ci
```

### TypeScript Errors

**Error**: `Cannot find name 'console'` or similar

**Solution:**
```bash
# Check tsconfig.json has lib configuration
# Should include: "lib": ["ES2020", "DOM"]

# Rebuild types
npm run type-check

# If persistent, clear tsc cache
rm -rf node_modules/.cache
```

### Docker Issues on Windows

**Error**: `Docker daemon is not running`

**Solution:**
- Open Docker Desktop application
- Wait for it to start (check taskbar)
- Retry command

**Error**: Line ending issues (`\r\n` vs `\n`)

**Solution:**
```bash
git config core.autocrlf input
git checkout --force HEAD
```

---

## 🔍 Debugging

### Backend Debugging

**Using VS Code:**

1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/app.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

2. Press F5 to start debugging

**Using console.log:**
```typescript
console.log('Debug info:', variable);
```

**Check logs:**
```bash
docker-compose logs backend  # If containerized
npm run dev 2>&1 | tee debug.log  # Save to file
```

### Database Debugging

**View active queries:**
```bash
docker-compose exec postgres psql -U research_user -d research_os -c \
  "SELECT pid, usename, application_name, state, query FROM pg_stat_activity;"
```

**Check slow queries:**
Enable in `.env`:
```
DATABASE_LOG_SLOW_QUERIES=true
DATABASE_SLOW_QUERY_THRESHOLD=100  # ms
```

---

## 📱 Mobile Development (Later)

When ready to test on mobile:

```bash
# Get your machine's IP
ipconfig getifaddr en0        # macOS
hostname -I                   # Linux
ipconfig                      # Windows (look for IPv4)

# Access from mobile on same network
http://<your-ip>:5173
```

---

## 🚀 Production-Like Testing

Run locally as close to production as possible:

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Run production build
PORT=3000 npm start
```

Visit http://localhost:3000 (backend serves frontend)

---

## 📚 Next Steps

### Before Coding
1. ✅ Complete this setup
2. Review ARCHITECTURE.md
3. Review DATABASE_SCHEMA.md
4. Review API_CONTRACTS.md
5. Review DEVELOPMENT_ROADMAP.md

### Start STEP 1
See DEVELOPMENT_ROADMAP.md for detailed instructions

---

## 💬 Getting Help

1. **Check documentation first** - ARCHITECTURE.md, DATABASE_SCHEMA.md
2. **Check existing code patterns** - Look at similar implementations
3. **Check error messages carefully** - Usually tells you what's wrong
4. **Google the error** - Chances are someone had the same issue
5. **Ask in developer communities** - Stack Overflow, Reddit, Discord

---

## 🔒 Security Reminders

⚠️ **NEVER**:
- Commit `.env` file
- Use real passwords in documentation
- Commit API keys or secrets
- Store passwords in code

✅ **ALWAYS**:
- Use `.env.example` for templates
- Rotate JWT secrets periodically
- Use strong passwords
- Keep dependencies updated

```bash
# Keep dependencies secure
npm audit              # Check for vulnerabilities
npm audit fix          # Auto-fix safe vulnerabilities
npm outdated           # Check for updates
npm update             # Update packages
```

---

## ✨ You're Ready!

You should now be able to:
- ✅ Start PostgreSQL
- ✅ Start backend API
- ✅ Start frontend
- ✅ Make API calls
- ✅ Debug issues
- ✅ Run tests

**Next**: Follow DEVELOPMENT_ROADMAP.md to build STEP 1.

Happy coding! 🎉

