import { render, screen, cleanup } from '@testing-library/react';
import LoadingIndicator from './LoadingIndicator';
import styles from './LoadingIndicator.module.css';

describe('LoadingIndicator', () => {
    afterEach(() => {
        cleanup();
    });
    it('renders spinner with status role', () => {
        render(<LoadingIndicator />);
        const spinner = screen.getByRole('status');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass(styles.spinner);
    });
});
