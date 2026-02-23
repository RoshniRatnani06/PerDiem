import React, { useMemo } from 'react';
import { useCatalog } from '../../hooks/useData';
import { MenuItemCard } from '../MenuItemCard/MenuItemCard';

interface Props {
    locationId: string | null;
    activeCategoryId: string | null;
    searchQuery: string;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="flex gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" role="status" aria-label="Loading menu item">
        <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-700 shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
            <div className="flex justify-between">
                <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                <div className="h-3.5 bg-slate-100 dark:bg-slate-600 rounded w-12" />
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded w-full" />
            <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded w-4/5" />
        </div>
        <span className="sr-only">Loading...</span>
    </div>
);

const SkeletonSection = () => (
    <section className="mb-10" aria-busy="true" aria-label="Loading menu section">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28 mb-4 animate-pulse" />
        <div className="card-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    </section>
);

// ── Main component ────────────────────────────────────────────────────────────
export const MenuGrid: React.FC<Props> = ({ locationId, activeCategoryId, searchQuery }) => {
    const { data: catalog, isLoading, error, refetch } = useCatalog(locationId);

    const filteredCatalog = useMemo(() => {
        if (!catalog) return [];

        let filtered = catalog;

        if (activeCategoryId) {
            filtered = filtered.filter(cat => cat.id === activeCategoryId);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered
                .map(cat => ({
                    ...cat,
                    items: cat.items.filter(
                        item =>
                            item.name.toLowerCase().includes(q) ||
                            (item.description ?? '').toLowerCase().includes(q)
                    ),
                }))
                .filter(cat => cat.items.length > 0);
        }

        return filtered;
    }, [catalog, activeCategoryId, searchQuery]);

    // ── States ─────────────────────────────────────────────────────────────────
    if (isLoading && locationId) return (
        <div>
            <SkeletonSection />
            <SkeletonSection />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center text-center py-20 gap-4" role="alert" aria-live="assertive">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374l7.448-12.75c.866-1.5 3.032-1.5 3.898 0l7.448 12.75zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Failed to load menu</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Check your connection and try again.</p>
            </div>
            <button
                onClick={() => refetch()}
                className="px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                aria-label="Retry loading menu"
            >
                Retry
            </button>
        </div>
    );

    if (!locationId) return (
        <div className="flex flex-col items-center justify-center text-center py-32 gap-3" role="status" aria-live="polite">
            <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="font-semibold text-slate-700 dark:text-slate-300">No location selected</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">Select a location from the sidebar.</p>
        </div>
    );

    if (filteredCatalog.length === 0) return (
        <div className="flex flex-col items-center justify-center text-center py-32 gap-3" role="status" aria-live="polite">
            <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803M10.5 7.5v3m0 0v3m0-3h3m-3 0H7.5" />
            </svg>
            <p className="font-semibold text-slate-700 dark:text-slate-300">No items found</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
                {searchQuery ? `No results for "${searchQuery}"` : 'No items found for this location.'}
            </p>
        </div>
    );

    // ── Catalog ────────────────────────────────────────────────────────────────
    return (
        <div className="pb-8">
            {filteredCatalog.map(category => (
                <section
                    key={category.id}
                    id={`category-${category.id}`}
                    className="mb-10 scroll-mt-20"
                    aria-labelledby={`category-heading-${category.id}`}
                >
                    {/* Category heading */}
                    <div className="flex items-center gap-3 mb-4">
                        <h2 
                            id={`category-heading-${category.id}`}
                            className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                        >
                            {category.name}
                        </h2>
                        <span className="text-xs text-slate-400 dark:text-slate-500" aria-label={`${category.items.length} items`}>
                            {category.items.length}
                        </span>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
                    </div>

                    {/* Grid */}
                    <div className="card-grid" role="list">
                        {category.items.map(item => (
                            <MenuItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};
