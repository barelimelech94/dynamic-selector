import React from 'react';
import './SearchBox.css';
import type { SearchBoxProps } from '../../utils/types';

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => (
    <input
        className="search-box"
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
    />
);

export default SearchBox;
