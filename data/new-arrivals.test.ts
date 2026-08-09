import { newArrivalCards, newArrivalSlugs } from './new-arrivals';

describe('new arrivals merchandising selection', () => {
  it('resolves every selected slug from real catalogue data', () => {
    expect(newArrivalCards).toHaveLength(newArrivalSlugs.length);
    expect(new Set(newArrivalSlugs).size).toBe(newArrivalSlugs.length);

    newArrivalCards.forEach((card, index) => {
      expect(card.href).toBe(`/products/${newArrivalSlugs[index]}`);
      expect(card.image).toMatch(/\/images\/products\/.+\/main\.png$/);
      expect(card.price).not.toBeNull();
    });
  });
});
