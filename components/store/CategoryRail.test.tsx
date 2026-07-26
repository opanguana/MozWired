import { render, screen } from '@testing-library/react';

import { CategoryRail } from './CategoryRail';

describe('CategoryRail', () => {
  it('renders every supplied product category image', () => {
    render(<CategoryRail />);

    expect(screen.getByRole('navigation', { name: 'Product categories' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(11);
    expect(screen.getByText('Mac')).toBeInTheDocument();
    expect(screen.getByText('Apple Gift Card')).toBeInTheDocument();
    expect(document.querySelectorAll('img')).toHaveLength(11);
  });
});
