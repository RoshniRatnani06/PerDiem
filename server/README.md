# Per Diem — Restaurant Menu App

> Full-stack restaurant menu web app connecting to the Square Catalog API.
> Built for the Per Diem Engineering Challenge (February 2025).

## Architecture

```
PerDiem-github/
├── PerDiem-backend/        # Node.js + Express + TypeScript backend
├── Per-Diem/               # React + Vite + Tailwind CSS frontend
├── docker-compose.yml      # Development mode
├── docker-compose.prod.yml # Production mode
└── DEPLOYMENT.md           # Comprehensive deployment guide
```

## Quick Start

### Option A — Docker (recommended)

```bash
# 1. Copy and fill in your Square credentials
cp PerDiem-backend/.env.example PerDiem-backend/.env
# Edit PerDiem-backend/.env and add your SQUARE_ACCESS_TOKEN

# 2. Start everything (from project root)
docker-compose up --build

# For production mode:
# docker-compose -f docker-compose.prod.yml up --build
```

- Frontend: http://localhost:5175 (dev) or http://localhost:80 (prod)
- Backend API: http://localhost:3002

---

### Option B — Static Demo (no Square account needed)

The frontend ships with rich static mock data. Set `VITE_USE_MOCK_DATA=true` (already done in `Per-Diem/.env`) and run just the frontend:

```bash
cd Per-Diem
npm install
npm run dev
# → http://localhost:5175
```

---

### Option C — Full Local Dev (live Square API)

```bash
# Terminal 1 — Backend
cd PerDiem-backend
cp .env.example .env        # fill in SQUARE_ACCESS_TOKEN
npm install
npm run dev                 # → http://localhost:3002

# Terminal 2 — Frontend
cd Per-Diem
# Set VITE_USE_MOCK_DATA=false in .env
npm install
npm run dev                 # → http://localhost:5175
```

## Running Tests

```bash
# Backend (Jest + supertest)
cd PerDiem-backend && npm test

# Frontend (Vitest + Testing Library)
cd Per-Diem && npm test
```

## Environment Variables

| Variable | Location | Default | Description |
|---|---|---|---|
| `SQUARE_ACCESS_TOKEN` | backend/.env | — | Square sandbox/production token |
| `SQUARE_ENVIRONMENT` | backend/.env | `sandbox` | `sandbox` or `production` |
| `PORT` | backend/.env | `3002` | Backend port |
| `VITE_USE_MOCK_DATA` | frontend/.env | `false` | `true` = use static data (no backend needed) |
| `VITE_API_BASE_URL` | frontend/.env | `/api` | API endpoint URL (use full URL for production) |

## Deployment

For detailed deployment instructions to Vercel, Railway, Render, or Docker production, see [DEPLOYMENT.md](../DEPLOYMENT.md).

## Key Features

- 🔐 **Secure proxy** — Square token never exposed to the frontend
- ⚡ **In-memory caching** — 5-min TTL, no hammering the Square API
- 📄 **Pagination** — transparent cursor-loop handling for large catalogs
- 🛡️ **Error handling** — typed `ApiError` responses with Square error category mapping
- 📊 **Structured logging** — JSON request logs (method, path, status, duration)
- 📱 **Mobile-first UI** — optimised for 375px viewport, works on all screen sizes
- 🔍 **Search** — client-side search by name or description
- 💀 **Skeleton loading** — smooth loading experience with pulsing placeholders
