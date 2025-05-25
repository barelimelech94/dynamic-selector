import { useEffect, useState, useCallback, useMemo } from 'react';
import type { ExampleMultiSelectListboxDynamicSelectorProps, Item } from '../utils/types';
import { DEBOUNCE_DELAY, PAGE_SIZE } from '../utils/config';
import useDebounce from './useDebounce';

export function useDynamicSelector({
    searchItems,
    getItemsById,
    initialSelectedIds = [],
}: ExampleMultiSelectListboxDynamicSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [items, setItems] = useState<Item[]>([]);
    const [initialSelectedItems, setInitialSelectedItems] = useState<Item[]>([]);
    const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, Item>>(() => new Map());
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearchTerm = useDebounce(searchTerm.trim(), DEBOUNCE_DELAY);

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
            } catch {
                setError('Failed to load initial items.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialItems();
    }, [getItemsById, initialSelectedIds]);

    const fetchItems = useCallback(
        async (term: string, pageNum: number, append = false) => {
            try {
                setError(null);
                setLoading(true);
                const resultItems = await searchItems(term, pageNum);
                setItems((prev) => (append ? [...prev, ...resultItems] : resultItems));
                setHasMore(resultItems.length === PAGE_SIZE);
            } catch {
                setError('Failed to fetch search results.');
            } finally {
                setLoading(false);
            }
        },
        [searchItems]
    );

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

    // Combine initial selected items with fetched items
    // Keep initial items at the start and filter out duplicates
    const combinedItems = useMemo(() => {
        const initialValues = new Set(initialSelectedItems.map((item) => item.value));
        const filtered = items.filter((item) => !initialValues.has(item.value));
        return [...initialSelectedItems, ...filtered];
    }, [items, initialSelectedItems]);

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

    return {
        searchTerm,
        setSearchTerm,
        handleSearchChange,
        handleShowMoreClick,
        combinedItems,
        isItemSelected,
        toggleSelection,
        selectedItems: Array.from(selectedItemsMap.values()),
        loading,
        hasMore,
        error,
        debouncedSearchTerm,
    };
}

export default useDynamicSelector;
