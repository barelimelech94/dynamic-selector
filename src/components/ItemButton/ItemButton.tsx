import React from 'react';
import './ItemButton.css';
import type { ItemButtonProps } from '../../utils/types';

const ItemButton: React.FC<ItemButtonProps> = React.memo(({ item, selected, onClick }) => (
    <button
        type="button"
        className={`item-button${selected ? ' selected' : ''}`}
        onClick={() => onClick(item)}
    >
        {item.name}
        <span className="item-button-icon">{selected ? '\u2713' : '+'}</span>
    </button>
));

export default ItemButton;
