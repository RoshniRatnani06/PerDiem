# Per-Diem Frontend

> React + Vite + TypeScript + Tailwind CSS frontend for the Per Diem restaurant menu app.

## Quick Start

### With mock data (no backend needed)

```bash
npm install
npm run dev
# → http://localhost:5175
```

The `.env` file ships with `VITE_USE_MOCK_DATA=true`, so the UI displays rich static data immediately — no Square account or running backend needed.

### With live backend

```bash
# 1. Ensure backend is running on port 3002
# 2. Set VITE_USE_MOCK_DATA=false in .env
npm install
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_USE_MOCK_DATA` | `false` | Set to `true` to use built-in static demo data |
| `VITE_API_BASE_URL` | `/api` | API endpoint URL (defaults to `/api`, use full URL for production) |

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md).

## Testing

```bash
npm test
```

Tests use **Vitest** + **@testing-library/react**.

| Test file | Type | Covers |
|---|---|---|
| `MenuItemCard.test.tsx` | Unit | Name, price, description, Read More, image/placeholder, multi-variation |
| `SearchBar.test.tsx` | Unit | Render, value binding, onChange callback |
| `MenuGrid.test.tsx` | Unit | Loading skeleton, error+retry, empty state, category grouping, search filter |

## Project Structure

```
src/
├── api/           # Axios client (baseURL /api)
├── components/    # LocationSelector, CategoryNav, MenuGrid, MenuItemCard, SearchBar
├── hooks/         # useLocations, useCatalog, useCategories (React Query)
├── mocks/         # staticData.ts — rich demo data for offline development
├── types/         # Shared TypeScript interfaces
└── __tests__/     # Vitest component tests
```

## Design System

- Colors: Indigo/Pink gradient (`primary`, `secondary` Tailwind tokens)
- Font: Inter (body) + Outfit (headings)
- Mobile-first: optimised at 375px, responsive up to full-width desktop
- Glassmorphism header, sticky category nav, animated card hover transitions
