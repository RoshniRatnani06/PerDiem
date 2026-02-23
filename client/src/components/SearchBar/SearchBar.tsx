import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar: React.FC<Props> = ({ value, onChange }) => {
    return (
        <div className="relative flex-1 max-w-xl" role="search">
            <label htmlFor="search-input" className="sr-only">
                Search menu items
            </label>
            <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors duration-200"
                size={17}
                aria-hidden="true"
            />
            <input
                id="search-input"
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search menu items..."
                className="peer w-full py-2.5 px-4 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-750 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50"
                aria-label="Search menu items by name or description"
                aria-describedby={value ? "search-results-count" : undefined}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label="Clear search"
                    title="Clear search"
                >
                    <X size={15} aria-hidden="true" />
                </button>
            )}
        </div>
    );
};
