import { test, expect } from '@playwright/test';

test('Handling inputs', async ({page}) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    expect(await page.title()).toBe('OrangeHRM');

    const loginHeader = page.getByText('Login').first();
    const usernameInput = page.locator('[name="username"]');
    const passwordInput = page.locator('[name="password"]');
    const loginButton = page.locator('button[type="submit"]');

    expect(await loginHeader).toBeVisible();
    expect(await usernameInput).toBeVisible();
    expect(await passwordInput).toBeVisible();

    await usernameInput.fill('Admin');                 // Way1: await page.locator().fill(message);
    await page.fill('[name="password"]', 'admin123'); // Way2: await page.fill(locator, 'message');

    await page.waitForTimeout(3000);

    await loginButton.click();
});