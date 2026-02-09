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

    /* NOTE: allTextContent() extracts text only once after DOM is attached, means DOM is visible in inspect
    but after that if we modify DOM, like write user name in <input>, allTextContent() is not able to
    capture it, we use <textarea> OR <input> .inputValue() method 
 
    Works only for:
    <input>
    <textarea>
    <select>
 
    await expect(input2.inputValue()).toBe(message); */

});