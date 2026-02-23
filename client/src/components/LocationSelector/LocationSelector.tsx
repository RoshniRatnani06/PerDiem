import React, { useEffect } from 'react';
import { useLocations } from '../../hooks/useData';

interface Props {
    selectedLocationId: string | null;
    onSelect: (id: string) => void;
}

export const LocationSelector: React.FC<Props> = ({ selectedLocationId, onSelect }) => {
    const { data: locations, isLoading, error, refetch } = useLocations();

    useEffect(() => {
        if (!selectedLocationId && locations && locations.length > 0) {
            onSelect(locations[0].id);
        }
    }, [locations, selectedLocationId, onSelect]);

    if (isLoading) return (
        <div className="flex items-center gap-2 px-2 py-2 text-slate-500 dark:text-slate-400 text-xs" role="status" aria-live="polite">
            <div className="w-3 h-3 border-2 border-slate-600 dark:border-slate-500 border-t-blue-400 dark:border-t-blue-500 rounded-full animate-spin shrink-0" aria-hidden="true" />
            <span>Loading locations...</span>
        </div>
    );

    if (error) return (
        <div className="flex flex-col gap-2 px-2" role="alert" aria-live="assertive">
            <p className="text-red-400 dark:text-red-500 text-xs">Failed to load locations.</p>
            <button
                onClick={() => refetch()}
                className="self-start text-xs text-slate-400 dark:text-slate-300 border border-slate-600 dark:border-slate-700 px-3 py-1 rounded-md hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Retry loading locations"
            >
                Retry
            </button>
        </div>
    );

    if (!locations || locations.length === 0) return (
        <p className="text-slate-600 dark:text-slate-400 text-xs px-2" role="status">No locations available.</p>
    );

    return (
        <div className="flex flex-col gap-0.5" role="radiogroup" aria-label="Select location">
            {locations.map((loc) => {
                const isActive = loc.id === selectedLocationId;
                return (
                    <button
                        key={loc.id}
                        onClick={() => onSelect(loc.id)}
                        role="radio"
                        aria-checked={isActive}
                        aria-label={`${loc.name}${loc.address ? `, ${loc.address}` : ''}`}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                            ${isActive
                                ? 'bg-slate-700 dark:bg-slate-800 text-white'
                                : 'text-slate-400 dark:text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/50 hover:text-slate-200 dark:hover:text-slate-100'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-blue-400 dark:bg-blue-500' : 'bg-slate-600 dark:bg-slate-700'}`} aria-hidden="true" />
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate leading-tight">{loc.name}</p>
                                {loc.address && (
                                    <p className={`text-[10px] truncate mt-0.5 leading-tight ${isActive ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-500'}`}>
                                        {loc.address}
                                    </p>
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
