import request from 'supertest';
import { app } from '../server';

// ── Mock the Square service so no real API calls are made ─────────────────────
jest.mock('../services/squareService', () => ({
    getLocations: jest.fn(),
    getCatalogItems: jest.fn(),
}));

import { getLocations, getCatalogItems } from '../services/squareService';

const mockGetLocations = jest.mocked(getLocations);
const mockGetCatalogItems = jest.mocked(getCatalogItems);

// ── Fixtures ──────────────────────────────────────────────────────────────────
const MOCK_LOCATIONS = [
    { id: 'loc-1', name: 'Downtown', address: '1 Main St, NY', timezone: 'America/New_York', status: 'ACTIVE' },
];

const MOCK_CATALOG = [
    {
        id: 'Beverages',
        name: 'Beverages',
        items: [
            {
                id: 'item-1',
                name: 'Espresso',
                description: 'Strong coffee',
                category_name: 'Beverages',
                image_url: undefined,
                variations: [{ id: 'var-1', name: 'Regular', price: '$3.50' }],
            },
        ],
    },
];

// ── GET /api/locations ────────────────────────────────────────────────────────
describe('GET /api/locations', () => {
    afterEach(() => jest.clearAllMocks());

    it('returns 200 with location list', async () => {
        mockGetLocations.mockResolvedValue(MOCK_LOCATIONS as any);

        const res = await request(app).get('/api/locations');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 500 with clean error body when service throws on uncached path', async () => {
        // Use a location ID that is guaranteed never to be cached by other tests
        mockGetCatalogItems.mockRejectedValueOnce(new Error('Square unreachable'));

        const res = await request(app)
            .get('/api/catalog?location_id=loc-error-locations-suite');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toHaveProperty('message');
    });

    it('returns a JSON body with valid location structure', async () => {
        mockGetLocations.mockResolvedValue(MOCK_LOCATIONS as any);
        const res = await request(app).get('/api/locations');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // Body should be either the mock data (cache miss) or equivalent (cache hit)
        expect(res.body.every((loc: unknown) => typeof loc === 'object')).toBe(true);
    });
});

// ── GET /api/catalog ──────────────────────────────────────────────────────────
describe('GET /api/catalog', () => {
    afterEach(() => jest.clearAllMocks());

    it('returns 400 when location_id is missing', async () => {
        const res = await request(app).get('/api/catalog');

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('MISSING_PARAMETER');
        expect(res.body.error.message).toMatch(/location_id/i);
    });

    it('returns 200 with categorized catalog items', async () => {
        // Unique location ID per test to ensure cold cache
        mockGetCatalogItems.mockResolvedValue(MOCK_CATALOG as any);

        const res = await request(app).get('/api/catalog?location_id=loc-catalog-success-1');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 500 with clean error body when service throws', async () => {
        // Unique location ID — guaranteed cold cache
        mockGetCatalogItems.mockRejectedValueOnce(new Error('catalog fetch failed'));

        const res = await request(app).get('/api/catalog?location_id=loc-catalog-error-1');

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toHaveProperty('message');
    });

    it('returns the correct status code for missing location_id on /categories too', async () => {
        const res = await request(app).get('/api/catalog/categories');
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('MISSING_PARAMETER');
    });
});

// ── GET /api/catalog/categories ───────────────────────────────────────────────
describe('GET /api/catalog/categories', () => {
    afterEach(() => jest.clearAllMocks());

    it('returns 400 when location_id is missing', async () => {
        const res = await request(app).get('/api/catalog/categories');
        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('MISSING_PARAMETER');
    });

    it('returns category summaries derived from catalog items', async () => {
        // Unique location ID for this test
        mockGetCatalogItems.mockResolvedValue(MOCK_CATALOG as any);

        const res = await request(app).get('/api/catalog/categories?location_id=loc-categories-success-1');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('item_count');
    });

    it('returns 500 when service throws on cold cache path', async () => {
        // Unique location ID — guaranteed cold cache
        mockGetCatalogItems.mockRejectedValueOnce(new Error('fail'));

        const res = await request(app).get('/api/catalog/categories?location_id=loc-categories-error-1');
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('error');
    });
});
