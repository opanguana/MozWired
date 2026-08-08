import { buildProductWhatsAppMessage, buildWhatsAppUrl, WHATSAPP_URL_NUMBER } from './whatsapp';

describe('WhatsApp product enquiries', () => {
  it('uses the normalized number and encodes the complete product message', () => {
    const message = buildProductWhatsAppMessage({
      productName: 'Lenovo IdeaPad 1',
      displayedPrice: 'MZN 50,000',
      sku: 'IDEAPAD-15IRU7',
      configuration: '256GB · 16GB RAM · Intel Core i5',
      availability: 'In stock',
      productUrl: 'https://store.example/products/ideapad-1',
    });
    const url = new URL(buildWhatsAppUrl(message));

    expect(url.origin + url.pathname).toBe(`https://wa.me/${WHATSAPP_URL_NUMBER}`);
    expect(url.searchParams.get('text')).toBe(message);
    expect(message).toContain('SKU/Modelo: IDEAPAD-15IRU7');
    expect(message).toContain('Link: https://store.example/products/ideapad-1');
  });
});
