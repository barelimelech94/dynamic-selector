import React from 'react';
import type { SelectedItemsDisplayProps } from '../../utils/types';
import './SelectedItemsDisplay.css';

const SelectedItemsDisplay: React.FC<SelectedItemsDisplayProps> = ({ selectedItems, onRemove }) => {
    return (
        <div className="display-items-container">
            {selectedItems.map(
                (item) =>
                    item && (
                        <button
                            key={item.value}
                            className="selected-item"
                            onClick={() => onRemove(item.value)}
                        >
                            {item.name} &times;
                        </button>
                    )
            )}
        </div>
    );
};

export default SelectedItemsDisplay;
