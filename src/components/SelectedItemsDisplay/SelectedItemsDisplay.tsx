import React from 'react';
import './SelectedItemsDisplay.css';
import type { Item, SelectedItemsDisplayProps } from '../../utils/types';

const SelectedItemsDisplay: React.FC<SelectedItemsDisplayProps> = ({ selectedItems, onRemove }) => {
    return (
        <div className="selected-items-display">
            {selectedItems.size === 0 ? (
                <p className="no-items-message">No items selected yet</p>
            ) : (
                Array.from(selectedItems, ([value, name]): Item => ({ value, name })).map(
                    (item) => (
                        <button
                            key={item.value}
                            className="selected-item"
                            onClick={() => onRemove(item)}
                        >
                            {item.name} x
                        </button>
                    )
                )
            )}
        </div>
    );
};

export default SelectedItemsDisplay;
