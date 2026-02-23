# Quick Reference Card

## 🚀 Most Common Commands

```bash
# Start development (both frontend + backend)
npm run dev

# Install all dependencies
npm run install:all

# Run all tests
npm test

# Build for production
npm run build:all

# Clean everything
npm run clean
```

## 📁 Folder Structure

```
root/
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express + TypeScript)
└── package.json     # Monorepo manager
```

## 🌐 URLs

- Frontend: http://localhost:5175
- Backend: http://localhost:3002/api

## 🔧 Configuration Files

- `server/.env` - Backend environment variables
- `client/.env` - Frontend environment variables
- `client/vite.config.ts` - Vite & proxy config
- `server/src/server.ts` - Express server config

## 📦 Installing Packages

```bash
# Client
npm install <package> --workspace=client

# Server
npm install <package> --workspace=server

# Root (dev tools)
npm install <package> --save-dev
```

## 🧪 Tes