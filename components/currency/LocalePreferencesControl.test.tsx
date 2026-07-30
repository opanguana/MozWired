import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { CurrencyProvider } from './CurrencyProvider';
import { LocalePreferencesControl } from './LocalePreferencesControl';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
  };
});

describe('LocalePreferencesControl', () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => jest.restoreAllMocks());

  it('opens with focus inside and returns focus when cancelled', async () => {
    render(
      <CurrencyProvider hasSavedPreferences>
        <LocalePreferencesControl />
      </CurrencyProvider>
    );

    const trigger = screen.getByRole('button', {
      name: 'Language, country and currency settings',
    });
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('open');
    const [language] = within(dialog).getAllByRole('combobox');
    await waitFor(() => expect(language).toHaveFocus());

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(dialog).not.toHaveAttribute('open');
    expect(trigger).toHaveFocus();
  });

  it('stages changes, recommends a market currency, and applies only on confirmation', () => {
    render(
      <CurrencyProvider hasSavedPreferences>
        <LocalePreferencesControl />
      </CurrencyProvider>
    );

    const trigger = screen.getByRole('button', {
      name: 'Language, country and currency settings',
    });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    const [language, market] = within(dialog).getAllByRole('combobox');
    fireEvent.change(language, { target: { value: 'pt' } });
    fireEvent.change(market, { target: { value: 'ZA' } });

    expect(trigger).toHaveTextContent('EN');
    expect(trigger).toHaveTextContent('MZ');
    expect(trigger).toHaveTextContent('MZN');
    expect(screen.getByRole('button', { name: 'Use ZAR' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Apply preferences' }));

    expect(trigger).toHaveTextContent('PT');
    expect(trigger).toHaveTextContent('ZA');
    expect(trigger).toHaveTextContent('MZN');
    expect(screen.getByText(/Preferences applied: PT, ZA, MZN/)).toBeInTheDocument();
  });

  it('closes on Escape and backdrop interaction without applying staged changes', () => {
    render(
      <CurrencyProvider hasSavedPreferences>
        <LocalePreferencesControl />
      </CurrencyProvider>
    );

    const trigger = screen.getByRole('button', {
      name: 'Language, country and currency settings',
    });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    const currency = within(dialog).getAllByRole('combobox')[2];
    fireEvent.change(currency, { target: { value: 'EUR' } });
    fireEvent(dialog, new Event('cancel', { bubbles: false, cancelable: true }));
    expect(trigger).toHaveTextContent('MZN');

    fireEvent.click(trigger);
    fireEvent.click(dialog);
    expect(dialog).not.toHaveAttribute('open');
    expect(trigger).toHaveTextContent('MZN');
  });
});
