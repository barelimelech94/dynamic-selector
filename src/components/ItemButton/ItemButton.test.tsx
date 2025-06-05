import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ItemButton from './ItemButton';
import { vi } from 'vitest';
import styles from './ItemButton.module.css';

describe('ItemButton', () => {
    const item = { value: '1', name: 'Test Item' };
    afterEach(() => {
        cleanup();
    });
    it('renders item name', () => {
        render(<ItemButton item={item} selected={false} onClick={() => {}} />);
        expect(screen.getByText('Test Item')).toBeInTheDocument();
    });
    it('shows checkmark when selected', () => {
        render(<ItemButton item={item} selected={true} onClick={() => {}} />);
        expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('shows plus sign when not selected', () => {
        render(<ItemButton item={item} selected={false} onClick={() => {}} />);
        expect(screen.getByText('+')).toBeInTheDocument();
    });
    it('calls onClick when clicked', () => {
        const onClick = vi.fn();
        render(<ItemButton item={item} selected={false} onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledWith(item);
    });
    it('applies selected class when selected is true', () => {
        render(<ItemButton item={item} selected={true} onClick={() => {}} />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass(styles.selected);
    });
});
