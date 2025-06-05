import React from 'react';
import styles from './SearchBox.module.css';
import type { SearchBoxProps } from '../../utils/types';

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => (
    <input
        className={styles.searchBox}
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
    />
);

export default SearchBox;
