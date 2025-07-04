import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ResultsBox from './ResultsBox';
import { vi } from 'vitest';
import styles from '../ItemButton/ItemButton.module.css';

describe('ResultsBox', () => {
    const items = [
        { value: '1', name: 'Item 1' },
        { value: '2', name: 'Item 2' },
    ];
    const isItemSelected = (id: string) => id === '1';
    afterEach(() => {
        cleanup();
    });
    it('renders all items', () => {
        render(<ResultsBox items={items} isItemSelected={isItemSelected} onItemClick={() => {}} />);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
    it('calls onItemClick when item is clicked', () => {
        const onItemClick = vi.fn();
        render(
            <ResultsBox items={items} isItemSelected={isItemSelected} onItemClick={onItemClick} />
        );
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(onItemClick).toHaveBeenCalled();
    });
    it('applies selected styles based on isItemSelected', () => {
        const isItemSelected = (id: string) => id === '1';
        render(<ResultsBox items={items} isItemSelected={isItemSelected} onItemClick={() => {}} />);
        const selectedButton = screen.getByText('Item 1');
        expect(selectedButton).toHaveClass(styles.itemButton, styles.selected);
    });
});
