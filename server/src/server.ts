import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import NodeCache from 'node-cache';
import { env } from './config/env';
import { getLocations, getCatalogItems } from './services/squareService';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import type { Location, CategoryGroup, CategorySummary } from './types';

export const app = express();

/** In-memory cache with a 5-minute TTL */
const cache = new NodeCache({ stdTTL: 300 });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));          // Human-readable dev logs
app.use(requestLogger);          // Structured JSON logs (method, path, status, ms)
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * GET /api/locations
 * Returns all ACTIVE locations from Square (id, name, address, timezone, status).
 */
app.get('/api/locations', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cacheKey = 'locations';
  const cached = cache.get<Location[]>(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const locations = await getLocations();
    cache.set(cacheKey, locations);
    res.json(locations);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/catalog?location_id=<LOCATION_ID>
 * Returns catalog items grouped by category for a given location.
 */
app.get('/api/catalog', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const locationId = req.query.location_id as string | undefined;

  if (!locationId) {
    res.status(400).json({
      error: {
        status: 400,
        code: 'MISSING_PARAMETER',
        message: 'location_id query parameter is required',
      },
    });
    return;
  }

  const cacheKey = `catalog_${locationId}`;
  const cached = cache.get<CategoryGroup[]>(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const catalog = await getCatalogItems(locationId);
    cache.set(cacheKey, catalog);
    res.json(catalog);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/catalog/categories?location_id=<LOCATION_ID>
 * Returns categories (with item counts) for items present at the given location.
 */
app.get('/api/catalog/categories', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const locationId = req.query.location_id as string | undefined;

  if (!locationId) {
    res.status(400).json({
      error: {
        status: 400,
        code: 'MISSING_PARAMETER',
        message: 'location_id query parameter is required',
      },
    });
    return;
  }

  const cacheKey = `categories_${locationId}`;
  const cached = cache.get<CategorySummary[]>(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    // Reuse getCatalogItems — catalog cache will absorb repeat costs
    const catalog = await getCatalogItems(locationId);

    const categories: CategorySummary[] = catalog.map((cat) => ({
      id: cat.id,
      name: cat.name,
      item_count: cat.items.length,
    }));

    cache.set(cacheKey, categories);
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// ── Error handler ──────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.SQUARE_ENVIRONMENT}]`);
  });
}
