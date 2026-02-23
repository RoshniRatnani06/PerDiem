import { squareClient } from './squareClient';
import { Location, CategoryGroup, MenuItem } from '../types';
import { SquareError } from 'square';
import { buildApiError } from '../middleware/errorHandler';

/**
 * Minimal type that mirrors the Square SDK's CatalogObject shape.
 * We cast the SDK response to this to avoid the overly broad `unknown` type.
 */
interface CatalogObject {
  id: string;
  type: string;
  itemData?: {
    name: string;
    description?: string;
    /** Category V1 — single categoryId */
    categoryId?: string;
    /** Category V2 — array of category memberships */
    categories?: Array<{ id: string; ordinal?: number }>;
    variations?: CatalogObject[];
    imageIds?: string[];
  };
  categoryData?: {
    name: string;
  };
  imageData?: {
    url: string;
  };
  itemVariationData?: {
    name: string;
    priceMoney?: {
      amount: bigint;
      currency: string;
    };
  };
  presentAtLocationIds?: string[];
  presentAtAllLocations?: boolean;
}

// ── Locations ─────────────────────────────────────────────────────────────────

/**
 * Fetches all ACTIVE locations from Square.
 * Returns a simplified Location array; the Square access token never leaves this service.
 */
export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await squareClient.locations.list();
    const locations = response.locations ?? [];

    return locations
      .filter((loc) => loc.status === 'ACTIVE')
      .map((loc) => ({
        id: loc.id!,
        name: loc.name ?? 'Unknown Location',
        address: loc.address
          ? [loc.address.addressLine1, loc.address.locality].filter(Boolean).join(', ')
          : '',
        timezone: loc.timezone ?? 'UTC',
        status: 'ACTIVE' as const,
      }));
  } catch (error) {
    if (error instanceof SquareError) {
      const apiErr = buildApiError(error);
      console.error('[squareService] getLocations Square error:', apiErr);
      throw Object.assign(new Error(apiErr.message), { apiError: apiErr });
    }
    console.error('[squareService] getLocations unexpected error:', error);
    throw new Error('Failed to fetch locations from Square');
  }
};

// ── Catalog ───────────────────────────────────────────────────────────────────

/**
 * Fetches all catalog ITEMs (with related CATEGORY and IMAGE objects) from Square.
 * Handles pagination transparently via the cursor loop.
 * Filters items to those present at the given locationId and groups by category name.
 *
 * @param locationId - Square location ID to filter catalog items by
 */
export const getCatalogItems = async (locationId: string): Promise<CategoryGroup[]> => {
  let items: CatalogObject[] = [];
  let relatedObjects: CatalogObject[] = [];
  let cursor: string | undefined;

  try {
    // Paginate until all objects are fetched
    do {
      const response = await squareClient.catalog.search({
        objectTypes: ['ITEM'],
        includeRelatedObjects: true,
        cursor,
      });

      if (response.objects) {
        items = items.concat(response.objects as unknown as CatalogObject[]);
      }
      if (response.relatedObjects) {
        relatedObjects = relatedObjects.concat(
          response.relatedObjects as unknown as CatalogObject[]
        );
      }
      cursor = response.cursor;
    } while (cursor);

    // Build lookup maps from related objects
    const categoriesMap = new Map<string, string>(); // id → name
    const imagesMap = new Map<string, string>();      // id → url

    relatedObjects.forEach((obj) => {
      if (obj.type === 'CATEGORY' && obj.categoryData) {
        categoriesMap.set(obj.id, obj.categoryData.name ?? 'Uncategorized');
      }
      if (obj.type === 'IMAGE' && obj.imageData?.url) {
        imagesMap.set(obj.id, obj.imageData.url);
      }
    });

    // Filter items to those present at the given location
    const locationItems = items.filter((item) => {
      if (item.presentAtAllLocations) return true;
      return (item.presentAtLocationIds ?? []).includes(locationId);
    });

    // Group items by their resolved category name
    const groupedItems: Record<string, MenuItem[]> = {};

    locationItems.forEach((item) => {
      // Support both categoryId (V1) and categories array (V2)
      const categoryId =
        item.itemData?.categoryId ??
        item.itemData?.categories?.[0]?.id;

      const categoryName = categoryId
        ? (categoriesMap.get(categoryId) ?? 'Other')
        : 'Other';

      const imageId = item.itemData?.imageIds?.[0];
      const imageUrl = imageId ? imagesMap.get(imageId) : undefined;

      const variations = (item.itemData?.variations ?? []).map((v) => ({
        id: v.id,
        name: v.itemVariationData?.name ?? '',
        price: formatPrice(v.itemVariationData?.priceMoney),
        price_money: v.itemVariationData?.priceMoney
          ? {
            amount: Number(v.itemVariationData.priceMoney.amount),
            currency: v.itemVariationData.priceMoney.currency,
          }
          : undefined,
      }));

      const menuItem: MenuItem = {
        id: item.id,
        name: item.itemData?.name ?? '',
        description: item.itemData?.description ?? '',
        category_name: categoryName,
        image_url: imageUrl,
        variations,
      };

      if (!groupedItems[categoryName]) {
        groupedItems[categoryName] = [];
      }
      groupedItems[categoryName].push(menuItem);
    });

    // Convert the grouped map to an array of CategoryGroup objects
    return Object.entries(groupedItems).map(([name, groupItems]) => ({
      id: name, // name used as stable key for grouping
      name,
      items: groupItems,
    }));
  } catch (error) {
    if (error instanceof SquareError) {
      const apiErr = buildApiError(error);
      console.error('[squareService] getCatalogItems Square error:', apiErr);
      throw Object.assign(new Error(apiErr.message), { apiError: apiErr });
    }
    console.error('[squareService] getCatalogItems unexpected error:', error);
    throw new Error('Failed to fetch catalog from Square');
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Formats a Square price_money object (amount in smallest currency unit) as a
 * locale-aware currency string (e.g. "$12.50").
 */
const formatPrice = (priceMoney?: { amount: bigint; currency: string }): string => {
  if (!priceMoney) return '';
  const amount = Number(priceMoney.amount) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: priceMoney.currency,
  }).format(amount);
};
