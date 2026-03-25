import { test, expect, type Page } from '@playwright/test'

async function mockSuccessRoutes(page: Page): Promise<void> {
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

test('API error recovery: CI 500 → intensity+mix cards show error, others load', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { localStorage.removeItem('whats-watt:postcode') })

  // Intercept CI fetch with 500
  await page.route('**/regional/postcode/**', (route) =>
    route.fulfill({ status: 500 }),
  )
  await mockSuccessRoutes(page)

  await page.getByLabel('UK postcode').fill('NR1 4AA')
  await page.getByRole('button', { name: /get electricity data/i }).click()

  // CI and generation mix share the same fetch — both cards show error
  const carbonCard = page.getByTestId('carbon-intensity-card')
  const genMixCard = page.getByTestId('generation-mix-card')

  await expect(carbonCard).toBeVisible({ timeout: 10_000 })
  await expect(carbonCard.getByRole('alert')).toBeVisible()

  await expect(genMixCard).toBeVisible()
  await expect(genMixCard.getByRole('alert')).toBeVisible()

  // Price and AQI data still loads — no error alerts in those cards
  const unitRateCard = page.getByTestId('unit-rate-card')
  const aqiCard = page.getByTestId('air-quality-card')

  await expect(unitRateCard).toBeVisible({ timeout: 10_000 })
  await expect(unitRateCard.getByRole('alert')).toBeHidden()

  await expect(aqiCard).toBeVisible({ timeout: 10_000 })
  await expect(aqiCard.getByRole('alert')).toBeHidden()
})
