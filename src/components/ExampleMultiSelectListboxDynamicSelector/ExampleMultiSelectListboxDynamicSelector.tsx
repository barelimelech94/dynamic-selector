import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { ExampleMultiSelectListboxDynamicSelectorProps, Item } from '../../utils/types';
import { DEBOUNCE_DELAY, PAGE_SIZE } from '../../utils/config';
import SearchBox from '../SearchBox/SearchBox';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import useDebounce from '../../hooks/useDebounce';
import ResultsBox from '../ResultsBox/ResultsBox';
import './ExampleMultiSelectListboxDynamicSelector.css';
import SelectedItemsDisplay from '../SelectedItemsDisplay/SelectedItemsDisplay';

const ExampleMultiSelectListboxDynamicSelector: React.FC<
    ExampleMultiSelectListboxDynamicSelectorProps
> = ({ searchItems, getItemsById, initialSelectedIds = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [items, setItems] = useState<Item[]>([]);
    const [initialSelectedItems, setInitialSelectedItems] = useState<Item[]>([]);
    const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, Item>>(() => new Map());
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm.trim(), DEBOUNCE_DELAY);

    // 1. Load initial pre-selected items into state and map
    useEffect(() => {
        const fetchInitialItems = async () => {
            try {
                setError(null);
                setLoading(true);
                const result = await getItemsById(initialSelectedIds);
                const itemsList = initialSelectedIds
                    .map((id) => result.find((item) => item.value === id))
                    .filter(Boolean) as Item[];
                setInitialSelectedItems(itemsList);
                const map = new Map<string, Item>(itemsList.map((item) => [item.value, item]));
                setSelectedItemsMap(map);
            } catch (error) {
                console.error('Error loading items:', error);
                setError('Failed to load initial items.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialItems();
    }, [getItemsById, initialSelectedIds]);

    // 2. Fetch items for current search term & page
    const fetchItems = useCallback(
        async (term: string, pageNum: number, append = false) => {
            try {
                setError(null);
                setLoading(true);
                const resultItems = await searchItems(term, pageNum);
                setItems((prev) => (append ? [...prev, ...resultItems] : resultItems));
                // This one fails when last page had PAGE_SIZE items
                setHasMore(resultItems.length === PAGE_SIZE);
            } catch (error) {
                console.error('Error fetching items:', error);
                setError('Failed to fetch search results.');
            } finally {
                setLoading(false);
            }
        },
        [searchItems]
    );

    // Reset search on new term
    useEffect(() => {
        if (debouncedSearchTerm === '') {
            setItems([]);
            return;
        }
        setPage(0);
        fetchItems(debouncedSearchTerm, 0, false);
    }, [debouncedSearchTerm, fetchItems]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleShowMoreClick = () => {
        fetchItems(debouncedSearchTerm, page + 1, true);
        setPage((prev) => prev + 1);
    };

    // Combine initial selected items (preserving order) with fetched items
    const combinedItems = useMemo(() => {
        const initialValues = new Set(initialSelectedItems.map((item) => item.value));
        const filtered = items.filter((item) => !initialValues.has(item.value));
        return [...initialSelectedItems, ...filtered];
    }, [items, initialSelectedItems]);

    // Toggle selection: add/remove full item data
    const toggleSelection = useCallback(
        (value: string) => {
            setSelectedItemsMap((prev) => {
                const newMap = new Map(prev);
                if (newMap.has(value)) {
                    newMap.delete(value);
                } else {
                    const item = combinedItems.find((i) => i.value === value);
                    if (item) newMap.set(value, item);
                }
                return newMap;
            });
        },
        [combinedItems]
    );

    const isItemSelected = useCallback(
        (value: string) => selectedItemsMap.has(value),
        [selectedItemsMap]
    );

    return (
        <section className="dynamic-selector-container">
            <h1 className="dynamic-selector-title">Dynamic Selector</h1>
            <SelectedItemsDisplay
                selectedItems={Array.from(selectedItemsMap.values())}
                onRemove={toggleSelection}
            />
            <SearchBox value={searchTerm} onChange={handleSearchChange} />
            {error && <div className="error-message">{error}</div>}
            <ResultsBox
                items={combinedItems}
                isItemSelected={isItemSelected}
                onItemClick={toggleSelection}
            />
            {loading ? (
                <LoadingIndicator />
            ) : (
                <button
                    className="show-more-btn"
                    onClick={handleShowMoreClick}
                    disabled={!hasMore || !debouncedSearchTerm}
                >
                    Show More
                </button>
            )}
        </section>
    );
};

export default ExampleMultiSelectListboxDynamicSelector;
