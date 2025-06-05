import React from 'react';
import styles from './ItemButton.module.css';
import type { ItemButtonProps } from '../../utils/types';

const ItemButton: React.FC<ItemButtonProps> = React.memo(({ item, selected, onClick }) => {
    return (
        <button
            type="button"
            className={`${styles.itemButton}${selected ? ' ' + styles.selected : ''}`}
            onClick={() => onClick(item)}
        >
            {item.name}
            <span className={styles.itemButtonIcon}>{selected ? '\u2713' : '+'}</span>
        </button>
    );
});

export default ItemButton;
