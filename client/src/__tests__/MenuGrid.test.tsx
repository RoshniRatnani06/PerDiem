import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MenuGrid } from '../components/MenuGrid/MenuGrid';

// ── Mock the data hook so no real fetches happen ──────────────────────────────
vi.mock('../hooks/useData', () => ({
    useCatalog: vi.fn(),
}));

import { useCatalog } from '../hooks/useData';
const mockUseCatalog = vi.mocked(useCatalog);

// ── Fixtures ──────────────────────────────────────────────────────────────────
const CATALOG = [
    {
        id: 'Coffee',
        name: 'Coffee',
        items: [
            {
                id: 'item-1',
                name: 'Espresso',
                description: 'Bold.',
                category_name: 'Coffee',
                image_url: undefined,
                variations: [{ id: 'v1', name: 'Regular', price: '$3.50' }],
            },
            {
                id: 'item-2',
                name: 'Latte',
                description: 'Creamy.',
                category_name: 'Coffee',
                image_url: undefined,
                variations: [{ id: 'v2', name: 'Large', price: '$5.00' }],
            },
        ],
    },
];

// ── Helper wrapper ────────────────────────────────────────────────────────────
function renderWithQuery(ui: React.ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('<MenuGrid />', () => {
    afterEach(() => vi.clearAllMocks());

    it('shows skeleton cards while loading', () => {
        mockUseCatalog.mockReturnValue({
            data: undefined,
            isLoading: true,
            error: null,
            refetch: vi.fn(),
        } as any);

        renderWithQuery(
            <MenuGrid locationId="loc-1" activeCategoryId={null} searchQuery="" />
        );

        // Skeletons appear — no actual item text is rendered
        expect(screen.queryByText('Espresso')).not.toBeInTheDocument();
    });

    it('shows the error state with a retry button on failure', () => {
        mockUseCatalog.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: new Error('Network error'),
            refetch: vi.fn(),
        } as any);

        renderWithQuery(
            <MenuGrid locationId="loc-1" activeCategoryId={null} searchQuery="" />
        );

        expect(screen.getByText(/failed to load menu/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('shows empty state when no items match', () => {
        mockUseCatalog.mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        renderWithQuery(
            <MenuGrid locationId="loc-1" activeCategoryId={null} searchQuery="" />
        );

        expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });

    it('renders menu items grouped by category', () => {
        mockUseCatalog.mockReturnValue({
            data: CATALOG,
            isLoading: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        renderWithQuery(
            <MenuGrid locationId="loc-1" activeCategoryId={null} searchQuery="" />
        );

        expect(screen.getByText('Coffee')).toBeInTheDocument();
        expect(screen.getByText('Espresso')).toBeInTheDocument();
        expect(screen.getByText('Latte')).toBeInTheDocument();
    });

    it('filters items by search query', () => {
        mockUseCatalog.mockReturnValue({
            data: CATALOG,
            isLoading: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        renderWithQuery(
            <MenuGrid locationId="loc-1" activeCategoryId={null} searchQuery="espresso" />
        );

        expect(screen.getByText('Espresso')).toBeInTheDocument();
        expect(screen.queryByText('Latte')).not.toBeInTheDocument();
    });

    it('shows empty state when search query matches nothing', () => {
        mockUseCatalog.mockReturnValue({
            data: CATALOG,
            isLoading: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        renderWithQuery(
            <MenuGrid locationId="loc-1" activeCategoryId={null} searchQuery="xyz-no-match" />
        );

        expect(screen.getByText(/no items found/i)).toBeInTheDocument();
    });
});
