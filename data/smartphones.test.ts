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

  it('preserves supplied variant pricing', () => {
    const galaxyA36 = buildSmartphoneCards('Samsung').find(({ title }) => title === 'Galaxy A36');
    const iphone15ProMax = buildSmartphoneCards('Apple').find(
      ({ title }) => title === 'iPhone 15 Pro Max'
    );

    expect(galaxyA36?.price).toBe('From 20,300 MZN');
    expect(iphone15ProMax?.price).toBe('59,500 MZN');
  });

  it('presents specifications through the established card hierarchy', () => {
    const galaxyA05s = buildSmartphoneCards('Samsung').find(({ title }) => title === 'Galaxy A05s');
    const galaxyA06 = buildSmartphoneCards('Samsung').find(({ title }) => title === 'Galaxy A06');

    expect(galaxyA05s).toMatchObject({
      eyebrow: 'Reliable everyday performance',
      description:
        'A practical Samsung 4G smartphone with 128GB of storage and 4GB of RAM for everyday use.',
      price: '10,550 MZN',
    });
    expect(galaxyA06).toMatchObject({
      eyebrow: 'Made for the essentials',
      description:
        'A practical Samsung 4G smartphone available with 64GB or 128GB of storage and 4GB of RAM for everyday use.',
      price: 'From 7,000 MZN',
    });
    expect(galaxyA06?.description).not.toContain('•');
  });
});
