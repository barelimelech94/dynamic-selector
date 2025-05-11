import React from 'react';
import ItemButton from '../ItemButton/ItemButton';
import type { ResultsBoxProps } from '../../utils/types';
import './ResultsBox.css';

const ResultsBox: React.FC<ResultsBoxProps> = ({ items, isItemSelected, onItemClick }) => (
    <div className="results-box">
        {items.map((item) => (
            <div key={item.value} className="item-container">
                <ItemButton
                    item={item}
                    selected={isItemSelected(item.value)}
                    onClick={() => onItemClick(item.value)}
                />
            </div>
        ))}
    </div>
);

export default ResultsBox;
