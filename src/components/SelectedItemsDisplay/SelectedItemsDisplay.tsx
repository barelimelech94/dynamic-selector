import React from 'react';
import styles from './SelectedItemsDisplay.module.css';
import type { SelectedItemsDisplayProps } from '../../utils/types';

const SelectedItemsDisplay: React.FC<SelectedItemsDisplayProps> = ({ selectedItems, onRemove }) => {
    return (
        <div className={styles.selectedItemsDisplay}>
            {selectedItems.size === 0 ? (
                <p className={styles.noItemsMessage}>No items selected yet</p>
            ) : (
                Array.from(selectedItems.entries()).map(([value, name]) => (
                    <button
                        key={value}
                        className={styles.selectedItem}
                        onClick={() => onRemove({ value, name })}
                    >
                        {name} x
                    </button>
                ))
            )}
        </div>
    );
};

export default SelectedItemsDisplay;
