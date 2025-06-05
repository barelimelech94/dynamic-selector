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
    const [preSelectedItems, setPreSelectedItems] = useState<Item[]>([]);
    const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, string>>(() => new Map());
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
                setPreSelectedItems(result);

                const matchedItemsMap = new Map<string, string>(
                    result.map((item) => [item.value, item.name])
                );
                setSelectedItemsMap(matchedItemsMap);
            } catch {
                setError('Failed to load initial items.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialItems();
    }, [getItemsById, initialSelectedIds]);

    const fetchItems = useCallback(
        async (term: string, pageNum: number) => {
            try {
                setError(null);
                setLoading(true);
                const resultItems = await searchItems(term, pageNum);
                setItems((prev) => (pageNum !== 0 ? [...prev, ...resultItems] : resultItems));
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
        fetchItems(debouncedSearchTerm, 0);
    }, [debouncedSearchTerm, fetchItems]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleShowMoreClick = () => {
        fetchItems(debouncedSearchTerm, page + 1);
        setPage((prev) => prev + 1);
    };

    // Combine initial selected items with fetched items
    // Keep initial items at the start and filter out duplicates
    const combinedItems = useMemo(() => {
        const filtered = items.filter((item) => !preSelectedItems.includes(item));
        return [...preSelectedItems, ...filtered];
    }, [items, preSelectedItems]);

    const toggleSelection = useCallback((item: Item) => {
        setSelectedItemsMap((prev) => {
            const newMap = new Map(prev);
            if (newMap.has(item.value)) {
                newMap.delete(item.value);
            } else {
                newMap.set(item.value, item.name);
            }
            return newMap;
        });
    }, []);

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
        selectedItems: selectedItemsMap,
        loading,
        hasMore,
        error,
        debouncedSearchTerm,
    };
}

export default useDynamicSelector;
