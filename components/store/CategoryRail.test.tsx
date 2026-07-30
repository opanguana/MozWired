import { render, screen } from '@testing-library/react';

import { CategoryRail } from './CategoryRail';

describe('CategoryRail', () => {
  it('renders only categories represented by active inventory', () => {
    render(<CategoryRail />);

    expect(screen.getByRole('navigation', { name: 'Product categories' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.getByText('Computers')).toBeInTheDocument();
    expect(screen.getByText('Smartphones')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
    expect(screen.queryByText('Apple Gift Card')).not.toBeInTheDocument();
  });
});
