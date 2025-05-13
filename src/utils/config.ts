export const PAGE_SIZE = 10;
export const DEBOUNCE_DELAY = 200;
export const MOCK_ITEMS = Array.from({ length: 60 }, (_, i) => ({
    value: `${i + 1}`,
    name: `Item ${i + 1}`,
}));
