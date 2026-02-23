import { useState } from 'react';
import type { MenuItem } from '../../types';

interface Props {
    item: MenuItem;
}

// Neutral grey placeholder — no colorful gradients
const ImagePlaceholder = ({ name }: { name: string }) => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700" aria-hidden="true">
        <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 select-none">
            {name.slice(0, 2).toUpperCase()}
        </span>
    </div>
);

export const MenuItemCard = ({ item }: Props) => {
    const [expanded, setExpanded] = useState(false);

    const hasMultipleVariations = item.variations.length > 1;
    const basePrice = item.variations[0]?.price ?? '';
    const hasDescription = !!item.description?.trim();
    const isLong = hasDescription && (item.description?.length ?? 0) > 100;

    return (
        <article 
            className="flex gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all duration-150 cursor-default"
            role="listitem"
        >
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={`${item.name} - ${item.category_name}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <ImagePlaceholder name={item.name} />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
                {/* Name + price */}
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        {item.name}
                    </h3>
                    {!hasMultipleVariations && basePrice && (
                        <span 
                            className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                            aria-label={`Price: ${basePrice}`}
                        >
                            {basePrice}
                        </span>
                    )}
                </div>

                {/* Description */}
                {hasDescription && (
                    <div>
                        <p 
                            className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}
                            id={`description-${item.id}`}
                        >
                            {item.description}
                        </p>
                        {isLong && (
                            <button
                                onClick={() => setExpanded(e => !e)}
                                className="text-blue-600 dark:text-blue-400 text-[11px] font-medium mt-0.5 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800 rounded"
                                aria-expanded={expanded}
                                aria-controls={`description-${item.id}`}
                            >
                                {expanded ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                )}

                {/* Multi-variation pricing */}
                {hasMultipleVariations && (
                    <div className="flex flex-wrap gap-1.5 mt-1" role="list" aria-label="Available sizes and prices">
                        {item.variations.map(v => (
                            <span
                                key={v.id}
                                className="inline-flex items-center gap-1.5 text-[11px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                                role="listitem"
                            >
                                <span>{v.name}</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200" aria-label={`${v.name} price`}>{v.price}</span>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
};
