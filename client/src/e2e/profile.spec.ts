import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Change profile name', async ({ page }) => {
	const name = faker.name.firstName();

	await page.goto('http://158.160.104.137/edit');

	await page.getByLabel('Имя').fill(name);

	await page.getByRole('button', { name: 'Сохранить' }).click();

	await expect(page.getByText('Изменения сохранены')).toBeVisible();
});

test('Change profile status', async ({ page }) => {
	const about = faker.lorem.sentence(5);

	await page.goto('http://158.160.104.137/edit');

	await page.getByLabel('Краткая информация').fill(about);

	await page.getByRole('button', { name: 'Сохранить' }).click();

	await expect.soft(page.getByText('Изменения сохранены')).toBeVisible();

	await page.getByRole('link', { name: 'Моя страница' }).click();

	await expect(page.getByText(about)).toBeVisible();
});

test('Change profile city', async ({ page }) => {
	const city = faker.address.cityName();

	await page.goto('http://158.160.104.137/edit');

	await page.getByLabel('Родной город').fill(city);

	await page.getByRole('button', { name: 'Сохранить' }).click();

	await expect.soft(page.getByText('Изменения сохранены')).toBeVisible();

	await page.getByRole('link', { name: 'Моя страница' }).click();

	await expect(page.getByText(city)).toBeVisible();
});

test('Change profile university', async ({ page }) => {
	const university = faker.company.name();

	await page.goto('http://158.160.104.137/edit');

	await page.getByLabel('Университет').fill(university);

	await page.getByRole('button', { name: 'Сохранить' }).click();

	await expect.soft(page.getByText('Изменения сохранены')).toBeVisible();

	await page.getByRole('link', { name: 'Моя страница' }).click();

	await expect(page.getByText(university)).toBeVisible();
});
