import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import '@testing-library/jest-dom';

describe('Header', () => {
  it('renders the MozWired brand', () => {
    render(<Header darkMode={false} setDarkMode={() => {}} />);
    expect(screen.getByText('MozWired')).toBeInTheDocument();
  });

  it('toggles dark mode on button click', () => {
    const setDarkMode = jest.fn();
    render(<Header darkMode={false} setDarkMode={setDarkMode} />);
    fireEvent.click(screen.getByRole('button', { name: /Switch to dark mode/i }));
    expect(setDarkMode).toHaveBeenCalled();
  });
});
