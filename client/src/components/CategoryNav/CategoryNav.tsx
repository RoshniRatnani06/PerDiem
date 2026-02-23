import React from 'react';
import { useCategories } from '../../hooks/useData';

interface Props {
    locationId: string | null;
    activeCategoryId: string | null;
    onSelect: (id: string | null) => void;
}

export const CategoryNav: React.FC<Props> = ({ locationId, activeCategoryId, onSelect }) => {
    const { data: categories, isLoading } = useCategories(locationId);

    if (isLoading) return (
        <div className="flex flex-col gap-1" role="status" aria-label="Loading categories">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="h-9 rounded-lg bg-slate-700/40 dark:bg-slate-800/40 animate-pulse"
                    style={{ animationDelay: `${i * 60}ms` }}
                    aria-hidden="true"
                />
            ))}
            <span className="sr-only">Loading categories...</span>
        </div>
    );

    if (!categories || categories.length === 0) return null;

    return (
        <nav className="flex flex-col gap-0.5" role="navigation" aria-label="Category filter">
            {/* All */}
            <button
                onClick={() => onSelect(null)}
                aria-pressed={!activeCategoryId}
                aria-label="Show all items"
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                    ${!activeCategoryId
                        ? 'bg-blue-600 dark:bg-blue-500 text-white font-medium'
                        : 'text-slate-400 dark:text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 hover:text-slate-200 dark:hover:text-slate-100'
                    }`}
            >
                <span>All Items</span>
            </button>

            {/* Categories */}
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    aria-pressed={activeCategoryId === cat.id}
                    aria-label={`Show ${cat.name} category, ${cat.item_count} items`}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors duration-150 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                        ${activeCategoryId === cat.id
                            ? 'bg-blue-600 dark:bg-blue-500 text-white font-medium'
                            : 'text-slate-400 dark:text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 hover:text-slate-200 dark:hover:text-slate-100'
                        }`}
                >
                    <span className="truncate">{cat.name}</span>
                    <span className={`text-xs tabular-nums ml-2 shrink-0 font-medium
                        ${activeCategoryId === cat.id ? 'text-blue-200 dark:text-blue-300' : 'text-slate-600 dark:text-slate-500'}`}
                        aria-hidden="true"
                    >
                        {cat.item_count}
                    </span>
                </button>
            ))}
        </nav>
    );
};
