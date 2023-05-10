import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Create post', async ({ page }) => {
	const postText = faker.lorem.sentence(5);

	await page.goto('http://158.160.104.137/feed');

	await page.getByRole('link', { name: 'Моя страница' }).click();

	await page.getByPlaceholder('Что у вас нового?').click();

	await page.getByPlaceholder('Что у вас нового?').fill(postText);

	await page.getByRole('button', { name: 'Опубликовать' }).click();

	await page.reload();

	await expect(page.getByText(postText)).toBeVisible();
});
