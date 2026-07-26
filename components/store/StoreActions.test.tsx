import { render, screen } from '@testing-library/react';

import { StoreActions } from './StoreActions';

describe('StoreActions', () => {
  it.each([
    {
      primary: true,
      secondary: false,
      visible: ['Explore services'],
      hidden: ['Talk to a specialist'],
    },
    {
      primary: false,
      secondary: true,
      visible: ['Talk to a specialist'],
      hidden: ['Explore services'],
    },
    {
      primary: true,
      secondary: true,
      visible: ['Explore services', 'Talk to a specialist'],
      hidden: [],
    },
  ])('supports independent action visibility', ({ primary, secondary, visible, hidden }) => {
    render(<StoreActions showPrimaryAction={primary} showSecondaryAction={secondary} />);

    visible.forEach((label) =>
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    );
    hidden.forEach((label) =>
      expect(screen.queryByRole('link', { name: label })).not.toBeInTheDocument()
    );
  });

  it('renders no wrapper when both actions are disabled', () => {
    const { container } = render(
      <StoreActions showPrimaryAction={false} showSecondaryAction={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
