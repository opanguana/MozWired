import { fireEvent, render, screen } from '@testing-library/react';

import { Header } from './Header';

describe('Header', () => {
  it('renders the linked company logo and primary navigation', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: 'MozWired home' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get support' })).toBeInTheDocument();
    expect(
      screen.queryByRole('complementary', { name: 'Site announcement' })
    ).not.toBeInTheDocument();
  });

  it('provides accessible desktop mega-menu triggers and links', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: 'Networks' })).toHaveAttribute(
      'aria-haspopup',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Cloud' })).toHaveAttribute('aria-haspopup', 'true');
    expect(screen.getByRole('button', { name: 'Security' })).toHaveAttribute(
      'aria-haspopup',
      'true'
    );
    expect(screen.getByRole('link', { name: /Structured cabling/ })).toBeInTheDocument();
  });

  it('opens and closes the mobile navigation', () => {
    render(<Header />);

    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
  });
});
