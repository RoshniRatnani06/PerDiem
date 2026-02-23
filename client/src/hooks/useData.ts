import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Location, CategoryGroup, CategorySummary } from '../types';
import { MOCK_LOCATIONS, MOCK_CATALOG, MOCK_CATEGORIES } from '../mocks/staticData';

/**
 * When VITE_USE_MOCK_DATA=true, all hooks return rich static data without
 * making any network requests. This lets the UI be evaluated without a
 * live Square API or running backend.
 */
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// ── Locations ─────────────────────────────────────────────────────────────────

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async (): Promise<Location[]> => {
      if (USE_MOCK_DATA) return MOCK_LOCATIONS;
      const { data } = await apiClient.get<Location[]>('/locations');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ── Catalog ───────────────────────────────────────────────────────────────────

export const useCatalog = (locationId: string | null) => {
  return useQuery({
    queryKey: ['catalog', locationId],
    queryFn: async (): Promise<CategoryGroup[]> => {
      if (!locationId) return [];
      if (USE_MOCK_DATA) return MOCK_CATALOG;
      const { data } = await apiClient.get<CategoryGroup[]>(
        `/catalog?location_id=${locationId}`
      );
      return data;
    },
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5,
  });
};

// ── Categories ────────────────────────────────────────────────────────────────

export const useCategories = (locationId: string | null) => {
  return useQuery({
    queryKey: ['categories', locationId],
    queryFn: async (): Promise<CategorySummary[]> => {
      if (!locationId) return [];
      if (USE_MOCK_DATA) return MOCK_CATEGORIES;
      const { data } = await apiClient.get<CategorySummary[]>(
        `/catalog/categories?location_id=${locationId}`
      );
      return data;
    },
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5,
  });
};
