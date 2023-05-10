import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// Use prepared auth state.
				storageState: 'playwright/.auth/user.json',
			},
			dependencies: ['setup'],
		},

		// {
		// 	name: 'firefox',
		// 	use: {
		// 		...devices['Desktop Firefox'],
		// 		// Use prepared auth state.
		// 		storageState: 'playwright/.auth/user.json',
		// 	},
		// 	dependencies: ['setup'],
		// },

		// {
		// 	name: 'webkit',
		// 	use: { ...devices['Desktop Safari'] },
		// },
	],
});
