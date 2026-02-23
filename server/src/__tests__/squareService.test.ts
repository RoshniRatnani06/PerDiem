import { getLocations, getCatalogItems } from '../services/squareService';

// ── Mock the Square client so no real HTTP calls are made ─────────────────────
jest.mock('../services/squareClient', () => ({
    squareClient: {
        locations: { list: jest.fn() },
        catalog: { search: jest.fn() },
    },
}));

import { squareClient } from '../services/squareClient';

// ── Helpers ───────────────────────────────────────────────────────────────────
const mockLocations = jest.mocked(squareClient.locations.list);
const mockCatalogSearch = jest.mocked(squareClient.catalog.search);

/** Build a minimal Square CatalogObject for items */
function makeCatalogItem(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        id: 'item-1',
        type: 'ITEM',
        presentAtAllLocations: true,
        itemData: {
            name: 'Espresso',
            description: 'Strong coffee',
            categoryId: 'cat-1',
            imageIds: ['img-1'],
            variations: [
                {
                    id: 'var-1',
                    type: 'ITEM_VARIATION',
                    itemVariationData: {
                        name: 'Regular',
                        priceMoney: { amount: BigInt(350), currency: 'USD' },
                    },
                },
            ],
        },
        ...overrides,
    };
}

// ── getLocations ──────────────────────────────────────────────────────────────
describe('getLocations()', () => {
    afterEach(() => jest.clearAllMocks());

    it('returns only ACTIVE locations with simplified fields', async () => {
        mockLocations.mockResolvedValueOnce({
            locations: [
                { id: 'loc-1', name: 'Main St', status: 'ACTIVE', address: { addressLine1: '1 Main St', locality: 'NY' }, timezone: 'America/New_York' },
                { id: 'loc-2', name: 'Closed Branch', status: 'INACTIVE' },
            ],
        } as any);

        const result = await getLocations();

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: 'loc-1',
            name: 'Main St',
            address: '1 Main St, NY',
            timezone: 'America/New_York',
            status: 'ACTIVE',
        });
    });

    it('returns an empty array when there are no locations', async () => {
        mockLocations.mockResolvedValueOnce({ locations: [] } as any);
        const result = await getLocations();
        expect(result).toEqual([]);
    });

    it('falls back to empty string when address is missing', async () => {
        mockLocations.mockResolvedValueOnce({
            locations: [{ id: 'loc-1', name: 'Pop-Up', status: 'ACTIVE' }],
        } as any);
        const result = await getLocations();
        expect(result[0].address).toBe('');
    });

    it('throws an Error when Square client rejects', async () => {
        mockLocations.mockRejectedValueOnce(new Error('Network error'));
        await expect(getLocations()).rejects.toThrow('Failed to fetch locations from Square');
    });
});

// ── getCatalogItems ───────────────────────────────────────────────────────────
describe('getCatalogItems()', () => {
    const locationId = 'loc-1';

    afterEach(() => jest.clearAllMocks());

    function buildSearchResponse(
        objects: unknown[],
        relatedObjects: unknown[] = [],
        cursor?: string
    ): Record<string, unknown> {
        return { objects, relatedObjects, cursor };
    }

    it('groups items by category name', async () => {
        mockCatalogSearch.mockResolvedValueOnce(
            buildSearchResponse(
                [makeCatalogItem()],
                [
                    { id: 'cat-1', type: 'CATEGORY', categoryData: { name: 'Coffee' } },
                    { id: 'img-1', type: 'IMAGE', imageData: { url: 'https://img.example.com/espresso.jpg' } },
                ]
            ) as any
        );

        const result = await getCatalogItems(locationId);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Coffee');
        expect(result[0].items).toHaveLength(1);
        expect(result[0].items[0]).toMatchObject({
            id: 'item-1',
            name: 'Espresso',
            description: 'Strong coffee',
            category_name: 'Coffee',
            image_url: 'https://img.example.com/espresso.jpg',
        });
        expect(result[0].items[0].variations[0].price).toBe('$3.50');
    });

    it('filters out items not present at the given location', async () => {
        const itemAtOtherLocation = makeCatalogItem({
            id: 'item-2',
            presentAtAllLocations: false,
            presentAtLocationIds: ['loc-999'],
        });

        mockCatalogSearch.mockResolvedValueOnce(
            buildSearchResponse([itemAtOtherLocation]) as any
        );

        const result = await getCatalogItems(locationId);
        expect(result).toHaveLength(0);
    });

    it('returns items to the correct location when presentAtLocationIds matches', async () => {
        const item = makeCatalogItem({
            presentAtAllLocations: false,
            presentAtLocationIds: [locationId],
        });
        mockCatalogSearch.mockResolvedValueOnce(buildSearchResponse([item]) as any);

        const result = await getCatalogItems(locationId);
        expect(result).toHaveLength(1);
    });

    it('handles pagination — follows cursor until exhausted', async () => {
        const page1 = { objects: [makeCatalogItem({ id: 'item-1' })], relatedObjects: [], cursor: 'NEXT' };
        const page2 = { objects: [makeCatalogItem({ id: 'item-2' })], relatedObjects: [], cursor: undefined };

        mockCatalogSearch
            .mockResolvedValueOnce(page1 as any)
            .mockResolvedValueOnce(page2 as any);

        const result = await getCatalogItems(locationId);
        // Both items land in the 'Other' category (no category related objects)
        expect(result[0].items).toHaveLength(2);
        expect(mockCatalogSearch).toHaveBeenCalledTimes(2);
        expect(mockCatalogSearch.mock.calls[1][0]).toMatchObject({ cursor: 'NEXT' });
    });

    it('falls back to "Other" when category is not in related objects', async () => {
        mockCatalogSearch.mockResolvedValueOnce(buildSearchResponse([makeCatalogItem()]) as any);
        const result = await getCatalogItems(locationId);
        expect(result[0].name).toBe('Other');
    });

    it('throws an Error when Square client rejects', async () => {
        mockCatalogSearch.mockRejectedValueOnce(new Error('timeout'));
        await expect(getCatalogItems(locationId)).rejects.toThrow('Failed to fetch catalog from Square');
    });
});
