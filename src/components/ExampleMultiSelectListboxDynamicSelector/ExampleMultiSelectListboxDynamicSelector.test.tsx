import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ExampleMultiSelectListboxDynamicSelector from './ExampleMultiSelectListboxDynamicSelector';
import type {
    Item,
    SearchBoxProps,
    ResultsBoxProps,
    ExampleMultiSelectListboxDynamicSelectorProps,
} from '../../utils/types';

vi.mock('../SearchBox/SearchBox', () => ({
    default: ({ value, onChange }: SearchBoxProps) => (
        <input data-testid="search-box" value={value} onChange={onChange} />
    ),
}));

vi.mock('../ResultsBox/ResultsBox', () => ({
    default: ({ items, onItemClick }: ResultsBoxProps) => (
        <div data-testid="results-box">
            {items.map((item) => (
                <button key={item.value} onClick={() => onItemClick(item.value)}>
                    {item.name}
                </button>
            ))}
        </div>
    ),
}));

vi.mock('../LoadingIndicator/LoadingIndicator', () => ({
    default: () => <div data-testid="loading-indicator">Loading...</div>,
}));

vi.mock('../../hooks/useDebounce', () => ({
    default: (value: string) => value,
}));

describe('ExampleMultiSelectListboxDynamicSelector', () => {
    const mockItems: Item[] = Array.from({ length: 10 }, (_, i) => ({
        value: `${i + 1}`,
        name: `Item ${i + 1}`,
    }));

    const searchItems: ExampleMultiSelectListboxDynamicSelectorProps['searchItems'] = vi
        .fn()
        .mockResolvedValue(mockItems);
    const getItemsById: ExampleMultiSelectListboxDynamicSelectorProps['getItemsById'] = vi
        .fn()
        .mockResolvedValue([mockItems[0]]);

    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('renders title and loads initial selected items', async () => {
        render(
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={searchItems}
                getItemsById={getItemsById}
                initialSelectedIds={['1']}
            />
        );
        expect(screen.getByText('Dynamic Selector')).toBeInTheDocument();
        await waitFor(() => {
            expect(getItemsById).toHaveBeenCalledWith(['1']);
        });
    });
    it('fires search on input change', async () => {
        render(
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={searchItems}
                getItemsById={getItemsById}
                initialSelectedIds={[]}
            />
        );

        const input = screen.getByTestId('search-box');
        fireEvent.change(input, { target: { value: 'test' } });

        await waitFor(() => {
            expect(searchItems).toHaveBeenCalled();
        });
    });
    it('loads items and toggles selection', async () => {
        render(
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={searchItems}
                getItemsById={getItemsById}
                initialSelectedIds={[]}
            />
        );

        const input = screen.getByTestId('search-box');
        fireEvent.change(input, { target: { value: 'test' } });
        const item = await screen.findByText('Item 1');
        fireEvent.click(item); // toggles selection
    });
    it('loads more items when "Show More" is clicked', async () => {
        render(
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={searchItems}
                getItemsById={getItemsById}
                initialSelectedIds={[]}
            />
        );

        const input = screen.getByTestId('search-box');
        fireEvent.change(input, { target: { value: 'test' } });
        await screen.findByText('Item 1');
        const showMoreButtons = screen.getAllByRole('button', { name: 'Show More' });
        // The real component's button is the last one rendered
        const showMoreBtn = showMoreButtons[showMoreButtons.length - 1];
        fireEvent.click(showMoreBtn);

        await waitFor(() => {
            expect(searchItems).toHaveBeenCalledWith('test', 1);
        });
    });
    it('does not fetch items when search is empty (except pre-selected)', async () => {
        render(
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={searchItems}
                getItemsById={getItemsById}
                initialSelectedIds={['1']}
            />
        );
        // Should only call getItemsById for initial selection, not searchItems
        await waitFor(() => {
            expect(getItemsById).toHaveBeenCalledWith(['1']);
            expect(searchItems).not.toHaveBeenCalled();
        });
    });
    it('displays error message when getItemsById fails', async () => {
        const failingGetItemsById = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
        render(
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={searchItems}
                getItemsById={failingGetItemsById}
                initialSelectedIds={['1']}
            />
        );
        await waitFor(() => {
            expect(screen.getByText('Failed to load initial items.')).toBeInTheDocument();
        });
    });
    it('displays error message when searchItems fails', async () => {
        const failingSearchItems = vi.fn().mockRejectedValue(new Error('Search failed'));
        render(
            <ExampleMultiSelectListboxDynamicSelector
                searchItems={failingSearchItems}
                getItemsById={getItemsById}
                initialSelectedIds={[]}
            />
        );

        const input = screen.getByTestId('search-box');
        fireEvent.change(input, { target: { value: 'test' } });

        await waitFor(() => {
            expect(screen.getByText('Failed to fetch search results.')).toBeInTheDocument();
        });
    });
});
