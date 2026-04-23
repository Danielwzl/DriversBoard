// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('localhost:3000/dashboard');

  await expect(page.locator('h1')).toHaveText('Campaign dashboard');
});
