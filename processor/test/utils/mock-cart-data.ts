import { Cart } from '@commercetools/connect-payments-sdk';

export const mockGetCartResult = {
  id: 'some-cart-id',
  shippingAddress: {
    id: '1',
    country: 'ES',
  },
  billingAddress: {
    id: '2',
    country: 'ES',
  },
  version: 1,
  totalPrice: {
    centAmount: 74600,
    currencyCode: 'EUR',
  },
  cartState: 'Active',
  lineItems: [{ id: '1' }],
  customLineItems: [{ id: '1' }],
} as Cart;
