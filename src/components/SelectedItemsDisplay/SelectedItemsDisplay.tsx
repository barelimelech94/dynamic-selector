import React from 'react';
import './SelectedItemsDisplay.css';
import type { SelectedItemsDisplayProps } from '../../utils/types';

const SelectedItemsDisplay: React.FC<SelectedItemsDisplayProps> = ({ selectedItems, onRemove }) => {
    return (
        <div className="selected-items-display">
            {selectedItems.length === 0 ? (
                <p className="no-items-message">No items selected yet</p>
            ) : (
                selectedItems.map(
                    (item) =>
                        item && (
                            <button
                                key={item.value}
                                className="selected-item"
                                onClick={() => onRemove(item.value)}
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
