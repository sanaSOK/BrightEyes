import { test, expect } from '@playwright/test';

test.describe('Wholesale Cart & Checkout E2E Flow', () => {
  test('user can browse catalog, view product detail, add to cart, and place order', async ({ page }) => {
    // 1. Visit products catalog
    await page.goto('/products');

    // Verify catalog title
    await expect(page.locator('h1')).toContainText('B2B Optical Products Catalog');

    // 2. Click on the first product card
    const firstProductTitle = page.locator('h3').first();
    await expect(firstProductTitle).toBeVisible();
    await firstProductTitle.click();

    // 3. Verify product detail page loaded
    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();

    // 4. Click Add to Cart
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // 5. Navigate to Cart
    await page.goto('/cart');
    await expect(page.locator('h1')).toContainText('Wholesale Order Cart');

    // 6. Proceed to Checkout
    await page.getByRole('button', { name: /Proceed to B2B Checkout/i }).click();
    await expect(page).toHaveURL('/checkout');

    // 7. Place Order
    await page.getByRole('button', { name: /Confirm Purchase Order/i }).click();

    // 8. Expect confirmation message
    await expect(page.locator('h2')).toContainText('Wholesale Order Confirmed!');
  });
});
