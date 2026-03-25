import { test, expect, type Page } from '@playwright/test'

async function mockApiRoutes(page: Page): Promise<void> {
  await page.route('**/regional/postcode/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{
          shortname: 'East England',
          data: [{
            from: '2024-01-01T12:00Z',
            intensity: { actual: 150 },
            generationmix: [{ fuel: 'gas', perc: 50 }, { fuel: 'wind', perc: 50 }],
          }],
        }],
      }),
    }),
  )
  await page.route('**/grid-supply-points/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ results: [{ group_id: '_P' }] }),
    }),
  )
  await page.route('**/standard-unit-rates/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ results: [{ value_inc_vat: 24.5 }] }),
    }),
  )
  await page.route('**/postcodes/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: { latitude: 52.628, longitude: 1.298 } }),
    }),
  )
  await page.route('**/air-quality**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        current: { european_aqi: 2, pm2_5: 5.2, nitrogen_dioxide: 10.3, ozone: 65.1 },
      }),
    }),
  )
}

test('persistence: last postcode pre-filled after reload', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { localStorage.removeItem('whats-watt:postcode') })
  await mockApiRoutes(page)

  await page.getByLabel('UK postcode').fill('NR1 4AA')
  await page.getByRole('button', { name: /get electricity data/i }).click()

  // Wait for data to load — confirms allSettled resolved and localStorage was written
  await expect(page.getByTestId('carbon-intensity-card')).toBeVisible({ timeout: 10_000 })

  await page.reload()

  // Input should be pre-filled from localStorage
  await expect(page.getByLabel('UK postcode')).toHaveValue('NR1 4AA')
})
