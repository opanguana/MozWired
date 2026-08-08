export const WHATSAPP_DISPLAY_NUMBER = '+258 87 136 9815';
export const WHATSAPP_URL_NUMBER = '258871369815';

export type ProductWhatsAppEnquiry = {
  productName: string;
  displayedPrice: string;
  sku: string;
  configuration: string;
  availability: string;
  productUrl: string;
  quantity?: number;
};

export function buildProductWhatsAppMessage({
  productName,
  displayedPrice,
  sku,
  configuration,
  availability,
  productUrl,
  quantity,
}: ProductWhatsAppEnquiry) {
  return [
    'Olá! Gostaria de falar com um especialista sobre este produto:',
    '',
    `Produto: ${productName}`,
    `Preço: ${displayedPrice}`,
    `SKU/Modelo: ${sku}`,
    `Configuração: ${configuration}`,
    `Disponibilidade: ${availability}`,
    quantity ? `Quantidade: ${quantity}` : null,
    '',
    `Link: ${productUrl}`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_URL_NUMBER}?text=${encodeURIComponent(message)}`;
}
