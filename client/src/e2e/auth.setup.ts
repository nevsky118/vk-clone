// auth.setup.ts
import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('Authenticate', async ({ page }) => {
	// Perform authentication steps. Replace these actions with your own.
	await page.goto('http://158.160.104.137/');
	await page.getByLabel('Электронная почта').fill('mark@test.com');
	await page.getByLabel('Пароль').fill('12345678');
	await page.getByRole('button', { name: 'Войти' }).click();
	// Wait until the page receives the cookies.
	//
	// Sometimes login flow sets cookies in the process of several redirects.
	// Wait for the final URL to ensure that the cookies are actually set.
	await page.waitForURL('http://158.160.104.137/');
	// Alternatively, you can wait until the page reaches a state where all cookies are set.
	await expect(page.getByRole('link', { name: 'Моя страница' })).toBeVisible();

	// End of authentication steps.

	await page.context().storageState({ path: authFile });
});
