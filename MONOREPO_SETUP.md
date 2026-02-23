# Monorepo Setup Guide

This document explains the monorepo structure and how to work with it.

## 📁 Folder Structure

```
perdiem-monorepo/
├── client/                    # Frontend workspace
│   ├── src/                   # React source code
│   ├── public/                # Static assets
│   ├── package.json           # Client dependencies
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   ├── tsconfig.json          # TypeScript config
│   └── .env.example           # Environment template
│
├── server/                    # Backend workspace
│   ├── src/                   # Express source code
│   ├── package.json           # Server dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── jest.config.js         # Jest test config
│   └── .env.example           # Environment template
│
├── package.json               # Root package.json (monorepo manager)
├── docker-compose.yml         # Docker orchestration
└── README.md                  # Main documentation
```

## 🎯 How It Works

### NPM Workspaces

This monorepo uses **npm workspaces**, a built-in npm feature that allows managing multiple packages from a single root.

**Benefits:**
- Single `node_modules` at root for shared dependencies
- Workspace-specific dependencies in `client/` and `server/`
- Run scripts across all workspaces or target specific ones
- Simplified dependency management

### Root package.json

The root `package.json` defines:
- **workspaces**: `["client", "server"]` - tells npm about the workspaces
- **scripts**: Commands that orchestrate both workspaces
- **devDependencies**: Shared development tools (concurrently, rimraf)

### Workspace package.json

Each workspace (`client/` and `server/`) has its own `package.json` with:
- Its own dependencies
- Its own scripts
- Its own configuration

## 🚀 Development Workflow

### Starting Development

```bash
# From root directory
npm run dev
```

This command:
1. Starts the backend server on port 3002
2. Starts the frontend dev server on port 5175
3. Runs both concurrently with colored output
4. Watches for changes in both workspaces

**Output:**
```
[SERVER] Server running on port 3002 [sandbox]
[CLIENT] VITE v7.3.1  ready in 234 ms
[CLIENT] ➜  Local:   http://localhost:5175/
```

### Working on Frontend Only

```bash
npm run dev:client
# or
cd client && npm run dev
```

### Working on Backend Only

```bash
npm run dev:server
# or
cd server && npm run dev
```

## 📦 Dependency Management

### Installing Dependencies

**Root dependencies** (dev tools used by both):
```bash
npm install <package> --save-dev
```

**Client dependencies**:
```bash
npm install <package> --workspace=client
# or
cd client && npm install <package>
```

**Server dependencies**:
```bash
npm install <package> --workspace=server
# or
cd server && npm install <package>
```

### Installing All Dependencies

```bash
# Install root + all workspace dependencies
npm run install:all

# Or manually
npm install                    # Root
npm install --workspace=client # Client
npm install --workspace=server # Server
```

### Cleaning Up

```bash
# Remove all node_modules and build artifacts
npm run clean

# Then reinstall
npm run install:all
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

This runs:
1. Backend tests (Jest + Supertest)
2. Frontend tests (Vitest + Testing Library)

### Run Specific Tests

```bash
# Backend only
npm run test:server

# Frontend only
npm run test:client

# Or navigate to workspace
cd server && npm test
cd client && npm test
```

## 🏗️ Building for Production

### Build Everything

```bash
npm run build:all
```

This:
1. Compiles TypeScript backend to `server/dist/`
2. Builds frontend to `client/dist/`

### Build Separately

```bash
# Backend only
npm run build:server

# Frontend only
npm run build
```

### Build Output

**Backend** (`server/dist/`):
```
server/dist/
├── server.js
├── config/
├── middleware/
├── services/
└── types/
```

**Frontend** (`client/dist/`):
```
client/dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

## 🚢 Production Deployment

### Option 1: Deploy Separately

**Backend** (Railway, Render, Heroku):
```bash
# Build backend
npm run build:server

# Deploy server/ folder
# Set environment variables on platform
# Start command: npm start
```

**Frontend** (Vercel, Netlify):
```bash
# Build frontend
npm run build

# Deploy client/dist/ folder
# Set VITE_API_BASE_URL to backend URL
```

### Option 2: Deploy Together

**Single Server** (serves both):
```bash
# Build both
npm run build:all

# Backend serves frontend static files
# Configure Express to serve client/dist/
```

### Option 3: Docker

```bash
# Development
docker-compose up --build

# Production (create docker-compose.prod.yml)
docker-compose -f docker-compose.prod.yml up --build
```

## 🔧 Configuration

### Environment Variables

**Backend** (`server/.env`):
```bash
SQUARE_ACCESS_TOKEN=your_token
SQUARE_ENVIRONMENT=sandbox
PORT=3002
```

**Frontend** (`client/.env`):
```bash
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=/api
```

### Proxy Configuration

The frontend proxies `/api/*` requests to the backend:

**File**: `client/vite.config.ts`
```typescript
server: {
  port: 5175,
  proxy: {
    '/api': {
      target: 'http://localhost:3002',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

**How it works:**
- Frontend makes request to `/api/locations`
- Vite proxy forwards to `http://localhost:3002/api/locations`
- Backend responds
- Frontend receives response

### CORS Configuration

Backend allows requests from frontend:

**File**: `server/src/server.ts`
```typescript
app.use(cors());
```

In production, configure specific origins:
```typescript
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

## 🐛 Common Issues

### Issue: "Cannot find module"

**Solution:**
```bash
npm run clean
npm run install:all
```

### Issue: Port already in use

**Solution:**
```bash
# Find and kill process on port 3002 (backend)
# Windows:
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3002 | xargs kill -9

# Or change port in server/.env
PORT=3003
```

### Issue: Frontend can't reach backend

**Check:**
1. Backend is running on port 3002
2. Vite proxy is configured correctly
3. No CORS errors in browser console
4. Backend .env has correct configuration

### Issue: Workspace commands not working

**Ensure:**
1. You're using npm 7+ (workspaces support)
2. Root package.json has `"workspaces": ["client", "server"]`
3. You're running commands from root directory

## 📚 Best Practices

### 1. Always Work from Root

```bash
# ✅ Good
npm run dev
npm test
npm run build:all

# ❌ Avoid (unless working on specific workspace)
cd client && npm run dev
cd server && npm run dev
```

### 2. Use Workspace Commands

```bash
# ✅ Good
npm install axios --workspace=client

# ❌ Avoid
cd client && npm install axios
```

### 3. Keep Dependencies Separated

- **Root**: Only dev tools (concurrently, rimraf)
- **Client**: Frontend dependencies (react, vite, tailwind)
- **Server**: Backend dependencies (express, square, node-cache)

### 4. Environment Variables

- Never commit `.env` files
- Always update `.env.example` when adding new variables
- Use different values for dev/prod

### 5. Git Ignore

Ensure `.gitignore` includes:
```
node_modules/
dist/
.env
.env.local
*.log
```

## 🎓 Learning Resources

- [npm workspaces documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Monorepo best practices](https://monorepo.tools/)
- [Concurrently documentation](https://github.com/open-cli-tools/concurrently)

## 🆘 Getting Help

If you encounter issues:

1. Check this guide
2. Review main README.md
3. Check workspace-specific README files
4. Verify Node.js version (18+)
5. Try `npm run clean` and `npm run install:all`

---

**Happy coding!** 🚀
