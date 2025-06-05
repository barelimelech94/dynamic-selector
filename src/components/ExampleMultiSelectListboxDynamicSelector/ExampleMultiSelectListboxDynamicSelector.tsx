import React from 'react';
import type { ExampleMultiSelectListboxDynamicSelectorProps } from '../../utils/types';
import useDynamicSelector from '../../hooks/useDynamicSelector';
import SearchBox from '../SearchBox/SearchBox';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import ResultsBox from '../ResultsBox/ResultsBox';
import styles from './ExampleMultiSelectListboxDynamicSelector.module.css';
import SelectedItemsDisplay from '../SelectedItemsDisplay/SelectedItemsDisplay';

const ExampleMultiSelectListboxDynamicSelector: React.FC<
    ExampleMultiSelectListboxDynamicSelectorProps
> = (props) => {
    const {
        searchTerm,
        handleSearchChange,
        handleShowMoreClick,
        combinedItems,
        isItemSelected,
        toggleSelection,
        selectedItems,
        loading,
        hasMore,
        error,
        debouncedSearchTerm,
    } = useDynamicSelector(props);

    // console.count('Main render count');
    return (
        <section className={styles.dynamicSelectorContainer}>
            <h1 className={styles.dynamicSelectorTitle}>Dynamic Selector</h1>
            <SelectedItemsDisplay selectedItems={selectedItems} onRemove={toggleSelection} />
            <SearchBox value={searchTerm} onChange={handleSearchChange} />
            {error && <div className={styles.errorMessage}>{error}</div>}

            <ResultsBox
                items={combinedItems}
                isItemSelected={isItemSelected}
                onItemClick={toggleSelection}
            />
            {loading ? (
                <LoadingIndicator />
            ) : (
                <button
                    className={styles.showMoreBtn}
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
