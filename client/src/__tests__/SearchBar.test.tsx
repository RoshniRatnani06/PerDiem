import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SearchBar } from '../components/SearchBar/SearchBar';

describe('<SearchBar />', () => {
    it('renders the search input with placeholder', () => {
        render(<SearchBar value="" onChange={vi.fn()} />);
        expect(screen.getByPlaceholderText(/search menu items/i)).toBeInTheDocument();
    });

    it('displays the current value', () => {
        render(<SearchBar value="espresso" onChange={vi.fn()} />);
        const input = screen.getByDisplayValue('espresso');
        expect(input).toBeInTheDocument();
    });

    it('calls onChange with the typed value', () => {
        const handleChange = vi.fn();
        render(<SearchBar value="" onChange={handleChange} />);

        const input = screen.getByPlaceholderText(/search menu items/i);
        fireEvent.change(input, { target: { value: 'latte' } });

        expect(handleChange).toHaveBeenCalledOnce();
        expect(handleChange).toHaveBeenCalledWith('latte');
    });

    it('calls onChange with empty string when cleared', () => {
        const handleChange = vi.fn();
        render(<SearchBar value="latte" onChange={handleChange} />);

        const input = screen.getByDisplayValue('latte');
        fireEvent.change(input, { target: { value: '' } });

        expect(handleChange).toHaveBeenCalledWith('');
    });
});
