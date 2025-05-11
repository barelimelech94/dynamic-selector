export type Item = {
    value: string;
    name: string;
};

export type ExampleMultiSelectListboxDynamicSelectorProps = {
    searchItems: (searchTerm: string, page: number) => Promise<Item[]>;
    getItemsById: (ids: string[]) => Promise<Item[]>;
    initialSelectedIds?: string[];
};

export type SearchBoxProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ItemButtonProps = {
    item: Item;
    selected: boolean;
    onClick: (item: Item) => void;
};

export type ResultsBoxProps = {
    items: Item[];
    isItemSelected: (value: string) => boolean;
    onItemClick: (value: string) => void;
};
