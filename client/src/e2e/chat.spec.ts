import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Send chat message', async ({ page }) => {
	const message = faker.lorem.sentence(5);

	await page.goto('http://158.160.104.137/im');

	await page.getByRole('button', { name: 'Олег' }).click();

	await page.getByPlaceholder('Напишите сообщение...').click();
	await page.getByPlaceholder('Напишите сообщение...').fill(message);

	await page.locator('form').getByRole('button').click();

	await expect(page.getByText(message)).toBeVisible();
});
