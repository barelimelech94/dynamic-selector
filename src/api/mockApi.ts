import type { Item } from '../utils/types.ts';
import { PAGE_SIZE, MOCK_ITEMS } from '../utils/config.ts';

export const mockSearchItems = async (searchTerm: string, page: number): Promise<Item[]> => {
    await new Promise((r) => setTimeout(r, 300));
    const filtered = MOCK_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
};

export const mockGetItemsById = async (ids: string[]): Promise<Item[]> => {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_ITEMS.filter((item) => ids.includes(item.value));
};
