import React from 'react';
import ItemButton from '../ItemButton/ItemButton';
import type { ResultsBoxProps } from '../../utils/types';
import './ResultsBox.css';

const ResultsBox: React.FC<ResultsBoxProps> = React.memo(
    ({ items, isItemSelected, onItemClick }) => {
        // console.count('ResultsBox render count');
        return (
            <div className="results-box">
                {items.map((item) => (
                    <div key={item.value} className="item-container">
                        <ItemButton
                            item={item}
                            selected={isItemSelected(item.value)}
                            onClick={() => onItemClick(item)}
                        />
                    </div>
                ))}
            </div>
        );
    }
);

export default ResultsBox;
