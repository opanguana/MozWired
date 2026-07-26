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

    expect(galaxyA36?.price).toBe('20,300 MZN – 22,800 MZN');
    expect(iphone15ProMax?.price).toBe('59,500 MZN');
  });
});
