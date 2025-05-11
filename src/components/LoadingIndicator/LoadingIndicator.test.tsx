import { render, screen, cleanup } from '@testing-library/react';
import LoadingIndicator from './LoadingIndicator';

describe('LoadingIndicator', () => {
    afterEach(() => {
        cleanup();
    });
    it('renders spinner with status role', () => {
        render(<LoadingIndicator />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
