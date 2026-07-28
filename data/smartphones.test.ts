import { buildSmartphoneCards, smartphoneInventory } from './smartphones';

describe('smartphone inventory', () => {
  it('contains every supplied SKU', () => {
    expect(smartphoneInventory).toHaveLength(36);
    expect(smartphoneInventory.filter(({ brand }) => brand === 'Samsung')).toHaveLength(23);
    expect(smartphoneInventory.filter(({ brand }) => brand === 'Apple')).toHaveLength(13);
  });

  it('groups variants into one card per model', () => {
    expect(buildSmartphoneCards('Samsung')).toHaveLength(12);
    expect(buildSmartphoneCards('Apple')).toHaveLength(11);
  });

  it('uses the shared gray surface for smartphone cards', () => {
    expect(buildSmartphoneCards('Samsung').every(({ accent }) => !accent)).toBe(true);
    expect(buildSmartphoneCards('Apple').every(({ accent }) => !accent)).toBe(true);
  });

  it('preserves supplied variant pricing', () => {
    const galaxyA36 = buildSmartphoneCards('Samsung').find(({ title }) => title === 'Galaxy A36');
    const iphone15ProMax = buildSmartphoneCards('Apple').find(
      ({ title }) => title === 'iPhone 15 Pro Max'
    );

    expect(galaxyA36?.price).toEqual({
      amount: { amountMinor: 2_030_000, currency: 'MZN' },
      label: 'from',
    });
    expect(iphone15ProMax?.price).toEqual({
      amount: { amountMinor: 5_950_000, currency: 'MZN' },
      label: 'exact',
    });
  });

  it('presents specifications through the established card hierarchy', () => {
    const galaxyA05s = buildSmartphoneCards('Samsung').find(({ title }) => title === 'Galaxy A05s');
    const galaxyA06 = buildSmartphoneCards('Samsung').find(({ title }) => title === 'Galaxy A06');

    expect(galaxyA05s).toMatchObject({
      eyebrow: 'Reliable everyday performance',
      description:
        'A practical Samsung 4G smartphone with 128GB of storage and 4GB of RAM for everyday use.',
      price: {
        amount: { amountMinor: 1_055_000, currency: 'MZN' },
        label: 'exact',
      },
    });
    expect(galaxyA06).toMatchObject({
      eyebrow: 'Made for the essentials',
      description:
        'A practical Samsung 4G smartphone available with 64GB or 128GB of storage and 4GB of RAM for everyday use.',
      price: {
        amount: { amountMinor: 700_000, currency: 'MZN' },
        label: 'from',
      },
    });
    expect(galaxyA06?.description).not.toContain('•');
  });
});
