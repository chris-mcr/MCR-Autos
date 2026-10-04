import { test, expect } from '@playwright/test';

test('cart persists through the API', async ({ request }) => {
  const userId = `e2e-${Date.now()}`;
  const item = { id: 'p1', title: 'Brake Pads', price: 10, category: 'Brakes', image: '', quantity: 1 };
  const post = (action: string, data?: unknown) =>
    request.post('/api/cart', { data: { action, data, userId } });

  await post('addItem', item);
  await post('addItem', item);

  const cart = await (await request.get(`/api/cart?userId=${userId}`)).json();
  expect(cart).toHaveLength(1);
  expect(cart[0].quantity).toBe(2);

  await post('clearCart');
  expect(await (await request.get(`/api/cart?userId=${userId}`)).json()).toEqual([]);
});
