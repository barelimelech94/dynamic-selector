import React from 'react';
import ItemButton from '../ItemButton/ItemButton';
import type { ResultsBoxProps } from '../../utils/types';
import styles from './ResultsBox.module.css';

const ResultsBox: React.FC<ResultsBoxProps> = React.memo(
    ({ items, isItemSelected, onItemClick }) => {
        // console.count('ResultsBox render count');
        return (
            <div className={styles.resultsBox}>
                {items.map((item) => (
                    <div key={item.value} className={styles.itemContainer}>
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
