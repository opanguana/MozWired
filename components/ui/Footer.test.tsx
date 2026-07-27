import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the copyright notice', () => {
    render(<Footer />);
    expect(screen.getByText(/MozWired Inc. All rights reserved/i)).toBeInTheDocument();
  });

  it('renders Privacy Policy link', () => {
    render(<Footer />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('renders Mozambique location', () => {
    render(<Footer />);
    expect(screen.getByText('Mozambique')).toBeInTheDocument();
  });

  it('uses the permanent dark footer treatment', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo', { name: 'Site footer' })).toHaveClass('bg-[#08090a]');
    expect(screen.getByRole('navigation', { name: 'Legal' })).toBeInTheDocument();
  });
});
