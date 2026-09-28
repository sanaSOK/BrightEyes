import { test, expect } from '@playwright/test';

test.describe('Wholesale RFQ Submission E2E Flow', () => {
  test('user can submit custom RFQ request and view tracking reference', async ({ page }) => {
    // 1. Visit RFQ page directly
    await page.goto('/rfq');
    await expect(page.locator('h1')).toContainText('Request for Quote (RFQ) Dashboard');

    // 2. Click Create New RFQ Request button
    await page.getByRole('button', { name: /Create New RFQ Request/i }).click();

    // 3. Fill out RFQ modal form
    await page.getByPlaceholder('e.g. 14.50').fill('12.80');
    await page.getByPlaceholder('Mention custom logo laser engraving').fill('Please provide custom logo laser etching on temple inner side.');

    // 4. Submit RFQ
    await page.getByRole('button', { name: /Send Official Wholesale RFQ/i }).click();

    // 5. Expect success notification with reference number
    await expect(page.locator('h3')).toContainText('RFQ Submitted Successfully!');
  });
});
