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
});
