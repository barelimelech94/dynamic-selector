import React, { useEffect, useState, useCallback, useMemo } from 'react';
import type { ExampleMultiSelectListboxDynamicSelectorProps, Item } from '../../utils/types';
import { DEBOUNCE_DELAY, PAGE_SIZE } from '../../utils/config';
import SearchBox from '../SearchBox/SearchBox';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import useDebounce from '../../hooks/useDebounce';
import ResultsBox from '../ResultsBox/ResultsBox';
import './ExampleMultiSelectListboxDynamicSelector.css';

const ExampleMultiSelectListboxDynamicSelector: React.FC<
    ExampleMultiSelectListboxDynamicSelectorProps
> = ({ searchItems, getItemsById, initialSelectedIds = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [items, setItems] = useState<Item[]>([]);
    const [initialSelectedItems, setInitialSelectedItems] = useState<Item[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

    // 1. Load initial pre-selected items, store their order
    useEffect(() => {
        const fetchInitialItems = async () => {
            try {
                setLoading(true);
                const result = await getItemsById(initialSelectedIds);
                const selectedItems = initialSelectedIds
                    .map((id) => result.find((item) => item.value === id))
                    .filter(Boolean) as Item[];
                setInitialSelectedItems(selectedItems);
                setSelectedIds(new Set(initialSelectedIds));
            } catch (error) {
                console.error('Error loading items:', error);
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
                setLoading(true);
                const result = await searchItems(term, pageNum);
                const deduped = result.filter((item) => !initialSelectedIds.includes(item.value));
                setItems((prev) => (append ? [...prev, ...deduped] : deduped));
                setHasMore(result.length === PAGE_SIZE);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setLoading(false);
            }
        },
        [searchItems, initialSelectedIds]
    );

    // Reset search on new term
    useEffect(() => {
        console.log('Search term changed:', debouncedSearchTerm);
        setItems([]);
        setPage(0);
        fetchItems(debouncedSearchTerm, 0, false);
    }, [debouncedSearchTerm, fetchItems]);

    // Load more on pagination
    useEffect(() => {
        console.log('Page changed:', page);
        if (page > 0) {
            fetchItems(debouncedSearchTerm, page, true);
        }
    }, [page, debouncedSearchTerm, fetchItems]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const toggleSelection = useCallback((value: string) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return newSet;
        });
    }, []);

    // Always keep initial items at top in original order
    const combinedItems = useMemo(() => {
        const selectedSet = new Set(initialSelectedItems.map((i) => i.value));
        const filteredItems = items.filter((i) => !selectedSet.has(i.value));
        return [...initialSelectedItems, ...filteredItems];
    }, [initialSelectedItems, items]);

    const isItemSelected = useCallback((value: string) => selectedIds.has(value), [selectedIds]);

    return (
        <section className="dynamic-selector-container">
            <h1 className="dynamic-selector-title">Dynamic Selector</h1>

            <SearchBox value={searchTerm} onChange={handleSearchChange} />
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
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasMore}
                >
                    Show More
                </button>
            )}
        </section>
    );
};

export default ExampleMultiSelectListboxDynamicSelector;
