import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MenuItemCard } from '../components/MenuItemCard/MenuItemCard';
import type { MenuItem } from '../types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const BASE_ITEM: MenuItem = {
    id: 'item-1',
    name: 'Oat Milk Latte',
    description: 'Smooth espresso with steamed oat milk.',
    category_name: 'Drinks',
    image_url: undefined,
    variations: [{ id: 'v1', name: 'Regular', price: '$5.50' }],
};

const LONG_DESCRIPTION = 'A '.repeat(60); // > 100 chars

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('<MenuItemCard />', () => {
    it('renders the item name', () => {
        render(<MenuItemCard item={BASE_ITEM} />);
        expect(screen.getByText('Oat Milk Latte')).toBeInTheDocument();
    });

    it('renders the item description', () => {
        render(<MenuItemCard item={BASE_ITEM} />);
        expect(screen.getByText(BASE_ITEM.description!)).toBeInTheDocument();
    });

    it('shows the price when there is a single variation', () => {
        render(<MenuItemCard item={BASE_ITEM} />);
        expect(screen.getByText('$5.50')).toBeInTheDocument();
    });

    it('renders variation chips when there are multiple variations', () => {
        const item: MenuItem = {
            ...BASE_ITEM,
            variations: [
                { id: 'v1', name: 'Small', price: '$4.00' },
                { id: 'v2', name: 'Medium', price: '$5.00' },
                { id: 'v3', name: 'Large', price: '$6.00' },
            ],
        };
        render(<MenuItemCard item={item} />);
        expect(screen.getByText('Small')).toBeInTheDocument();
        expect(screen.getByText('$4.00')).toBeInTheDocument();
        expect(screen.getByText('$6.00')).toBeInTheDocument();
    });

    it('shows "Read more" button for long descriptions and expands on click', () => {
        const item: MenuItem = { ...BASE_ITEM, description: LONG_DESCRIPTION };
        render(<MenuItemCard item={item} />);

        const btn = screen.getByText(/read more/i);
        expect(btn).toBeInTheDocument();

        fireEvent.click(btn);
        expect(screen.getByText(/show less/i)).toBeInTheDocument();
    });

    it('does NOT show "Read more" button for short descriptions', () => {
        render(<MenuItemCard item={BASE_ITEM} />);
        expect(screen.queryByText(/read more/i)).not.toBeInTheDocument();
    });

    it('renders the image when image_url is provided', () => {
        const item: MenuItem = { ...BASE_ITEM, image_url: 'https://example.com/latte.jpg' };
        render(<MenuItemCard item={item} />);

        const img = screen.getByRole('img', { name: /oat milk latte/i });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/latte.jpg');
    });

    it('renders a placeholder when no image_url is provided', () => {
        render(<MenuItemCard item={BASE_ITEM} />);
        // No <img> with the item name as alt — only the SVG placeholder
        expect(screen.queryByRole('img', { name: /oat milk latte/i })).not.toBeInTheDocument();
    });

    it('does not call vi.fn() — dummy to verify vi global is available', () => {
        const spy = vi.fn();
        spy();
        expect(spy).toHaveBeenCalled();
    });
});
