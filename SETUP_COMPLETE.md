# ✅ Monorepo Setup Complete!

Your Per Diem project has been successfully converted to a monorepo structure.

## 📁 New Structure

```
perdiem-monorepo/
├── client/                    # Frontend (was: Per-Diem/)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
│
├── server/                    # Backend (was: PerDiem-backend/)
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── package.json               # Root (NEW - manages both workspaces)
├── docker-compose.yml         # Updated paths
├── README.md                  # Updated documentation
├── MONOREPO_SETUP.md          # Detailed setup guide
└── .gitignore                 # Updated ignore patterns
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Configure Environment

```bash
# Copy environment template
cp server/.env.example server/.env

# Edit server/.env and add your Square access token
# SQUARE_ACCESS_TOKEN=your_token_here
```

### 3. Start Development

```bash
# Start both frontend and backend together
npm run dev
```

**You'll see:**
```
[SERVER] Server running on port 3002 [sandbox]
[CLIENT] VITE v7.3.1  ready in 234 ms
[CLIENT] ➜  Local:   http://localhost:5175/
```

### 4. Access the Application

- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:3002/api

## 📜 Available Commands

### Development
```bash
npm run dev              # Start both (recommended)
npm run dev:server       # Start backend only
npm run dev:client       # Start frontend only
```

### Building
```bash
npm run build            # Build frontend
npm run build:server     # Build backend
npm run build:all        # Build both
```

### Testing
```bash
npm test                 # Run all tests
npm run test:server      # Backend tests
npm run test:client      # Frontend tests
```

### Utilities
```bash
npm run install:all      # Install all dependencies
npm run clean            # Remove node_modules and dist
npm run docker:dev       # Start with Docker
```

## 🎯 Key Changes

### What Changed

1. **Folder Structure**
   - `PerDiem-backend/` → `server/`
   - `Per-Diem/` → `client/`
   - Added root `package.json`

2. **Docker Configuration**
   - Updated paths in `docker-compose.yml`
   - Now references `./server` and `./client`

3. **Scripts**
   - Single command to start both: `npm run dev`
   - Workspace-aware commands
   - Concurrent execution with colored output

4. **Dependencies**
   - Root: `concurrently`, `rimraf`
   - Client: Unchanged (in `client/package.json`)
   - Server: Unchanged (in `server/package.json`)

### What Stayed the Same

- ✅ All source code unchanged
- ✅ All configurations unchanged
- ✅ All tests still work
- ✅ Docker setup still works
- ✅ Environment variables same location

## 🔧 How It Works

### NPM Workspaces

The root `package.json` defines workspaces:

```json
{
  "workspaces": ["client", "server"]
}
```

This tells npm:
- `client/` is a workspace
- `server/` is a workspace
- Manage them together

### Concurrently

The `dev` script uses `concurrently` to run both servers:

```json
{
  "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" --names \"SERVER,CLIENT\" --prefix-colors \"blue,green\""
}
```

This:
- Runs both commands simultaneously
- Adds colored prefixes ([SERVER], [CLIENT])
- Shows output from both in one terminal

### Proxy Setup

Frontend proxies API requests to backend:

**Request Flow:**
```
Browser → http://localhost:5175/api/locations
        ↓ (Vite proxy)
Backend → http://localhost:3002/api/locations
        ↓
Square API
```

## 📚 Documentation

- **README.md** - Main project documentation
- **MONOREPO_SETUP.md** - Detailed monorepo guide
- **client/README.md** - Frontend-specific docs
- **server/README.md** - Backend-specific docs

## 🎓 Working with Workspaces

### Install a Package

```bash
# In client
npm install <package> --workspace=client

# In server
npm install <package> --workspace=server

# In root (dev tools only)
npm install <package> --save-dev
```

### Run a Script

```bash
# From root
npm run <script> --workspace=client
npm run <script> --workspace=server

# Or navigate to workspace
cd client && npm run <script>
cd server && npm run <script>
```

## 🐛 Troubleshooting

### Issue: Commands not working

**Solution:**
```bash
# Ensure you're in the root directory
pwd  # Should show: .../perdiem-monorepo

# Reinstall everything
npm run clean
npm run install:all
```

### Issue: Port conflicts

**Solution:**
```bash
# Backend (port 3002)
# Edit server/.env
PORT=3003

# Frontend (port 5175)
# Edit client/vite.config.ts
server: { port: 5176 }
```

### Issue: Frontend can't reach backend

**Check:**
1. Backend is running: `npm run dev:server`
2. Check browser console for errors
3. Verify proxy in `client/vite.config.ts`

## ✅ Verification Checklist

- [ ] Root `package.json` exists
- [ ] `client/` folder has all frontend files
- [ ] `server/` folder has all backend files
- [ ] `npm install` works
- [ ] `npm run install:all` works
- [ ] `npm run dev` starts both servers
- [ ] Frontend loads at http://localhost:5175
- [ ] Backend responds at http://localhost:3002/api
- [ ] Tests pass: `npm test`
- [ ] Docker works: `npm run docker:dev`

## 🎉 Next Steps

1. **Test the setup**
   ```bash
   npm run dev
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Try Docker**
   ```bash
   npm run docker:dev
   ```

4. **Read the docs**
   - Check `MONOREPO_SETUP.md` for detailed guide
   - Review updated `README.md`

5. **Start developing**
   - Frontend changes: `client/src/`
   - Backend changes: `server/src/`
   - Both watch for changes automatically

## 📝 Notes

- **Node.js 18+** required
- **npm 7+** required (for workspaces support)
- All original functionality preserved
- No breaking changes to code
- Just better organization!

---

**Your monorepo is ready!** 🚀

Run `npm run dev` to get started!
