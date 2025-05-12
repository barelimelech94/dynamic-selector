import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SearchBox from './SearchBox';
import { vi } from 'vitest';

describe('SearchBox', () => {
    afterEach(() => {
        cleanup();
    });
    it('renders input with placeholder', () => {
        render(<SearchBox value="" onChange={() => {}} />);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });
    it('calls onChange when typing', () => {
        const onChange = vi.fn();
        render(<SearchBox value="" onChange={onChange} />);
        fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'foo' } });
        expect(onChange).toHaveBeenCalled();
    });
    it('updates input value when value prop changes', () => {
        const { rerender } = render(<SearchBox value="initial" onChange={() => {}} />);
        const input = screen.getByPlaceholderText('Search...');
        expect(input).toHaveValue('initial');

        rerender(<SearchBox value="updated" onChange={() => {}} />);
        expect(input).toHaveValue('updated');
    });
});
