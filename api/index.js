// Vercel Serverless Function - Main API Handler
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const { Client, Environment } = require('square');

const app = express();
const cache = new NodeCache({ stdTTL: 300 });

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
});

app.use(cors());
app.use(express.json());

// Helper function to get locations
async function getLocations() {
  try {
    const { result } = await squareClient.locationsApi.listLocations();
    return (result.locations || [])
      .filter(loc => loc.status === 'ACTIVE')
      .map(loc => ({
        id: loc.id,
        name: loc.name || 'Unnamed Location',
        address: [
          loc.address?.addressLine1,
          loc.address?.locality,
          loc.address?.administrativeDistrictLevel1,
        ].filter(Boolean).join(', '),
        timezone: loc.timezone || 'UTC',
        status: loc.status,
      }));
  } catch (error) {
    console.error('Square API Error (locations):', error);
    throw error;
  }
}

// Helper function to get catalog items
async function getCatalogItems(locationId) {
  try {
    const allItems = [];
    let cursor = undefined;

    do {
      const { result } = await squareClient.catalogApi.listCatalog(cursor, 'ITEM');
      if (result.objects) {
        allItems.push(...result.objects);
      }
      cursor = result.cursor;
    } while (cursor);

    const categoryMap = new Map();

    for (const item of allItems) {
      if (!item.itemData) continue;

      const presentAtLocations = item.presentAtLocationIds || [];
      if (!presentAtLocations.includes(locationId)) continue;

      const categoryId = item.itemData.categoryId || 'uncategorized';
      const categoryName = item.itemData.categoryId 
        ? (await getCategoryName(item.itemData.categoryId))
        : 'Uncategorized';

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: categoryName,
          items: [],
        });
      }

      const variations = item.itemData.variations || [];
      const firstVariation = variations[0];
      const price = firstVariation?.itemVariationData?.priceMoney?.amount 
        ? (firstVariation.itemVariationData.priceMoney.amount / 100).toFixed(2)
        : null;

      categoryMap.get(categoryId).items.push({
        id: item.id,
        name: item.itemData.name || 'Unnamed Item',
        description: item.itemData.description || '',
        price: price,
        currency: firstVariation?.itemVariationData?.priceMoney?.currency || 'USD',
        image_url: item.itemData.imageIds?.[0] || null,
        category: categoryName,
      });
    }

    return Array.from(categoryMap.values());
  } catch (error) {
    console.error('Square API Error (catalog):', error);
    throw error;
  }
}

// Helper to get category name
async function getCategoryName(categoryId) {
  try {
    const { result } = await squareClient.catalogApi.retrieveCatalogObject(categoryId);
    return result.object?.categoryData?.name || 'Unknown Category';
  } catch {
    return 'Unknown Category';
  }
}

// Routes
app.get('/api/locations', async (req, res) => {
  const cacheKey = 'locations';
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const locations = await getLocations();
    cache.set(cacheKey, locations);
    res.json(locations);
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to fetch locations',
      },
    });
  }
});

app.get('/api/catalog', async (req, res) => {
  const locationId = req.query.location_id;

  if (!locationId) {
    return res.status(400).json({
      error: {
        status: 400,
        code: 'MISSING_PARAMETER',
        message: 'location_id query parameter is required',
      },
    });
  }

  const cacheKey = `catalog_${locationId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const catalog = await getCatalogItems(locationId);
    cache.set(cacheKey, catalog);
    res.json(catalog);
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to fetch catalog',
      },
    });
  }
});

app.get('/api/catalog/categories', async (req, res) => {
  const locationId = req.query.location_id;

  if (!locationId) {
    return res.status(400).json({
      error: {
        status: 400,
        code: 'MISSING_PARAMETER',
        message: 'location_id query parameter is required',
      },
    });
  }

  const cacheKey = `categories_${locationId}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const catalog = await getCatalogItems(locationId);
    const categories = catalog.map(cat => ({
      id: cat.id,
      name: cat.name,
      item_count: cat.items.length,
    }));
    cache.set(cacheKey, categories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        code: 'INTERNAL_ERROR',
        message: error.message || 'Failed to fetch categories',
      },
    });
  }
});

module.exports = app;
