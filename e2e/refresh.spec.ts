import { test, expect, type Page } from '@playwright/test'

const CI_BODY = JSON.stringify({
  data: [{
    regionid: 10,
    dnoregion: 'East England',
    shortname: 'East England',
    postcode: 'NR1',
    intensity: { forecast: 142, actual: 142, index: 'moderate' },
    generationmix: [
      { fuel: 'gas', perc: 40 }, { fuel: 'wind', perc: 30 },
      { fuel: 'solar', perc: 15 }, { fuel: 'nuclear', perc: 10 },
      { fuel: 'hydro', perc: 3 }, { fuel: 'imports', perc: 2 },
    ],
  }],
})

function jsonResponse(body: string) {
  return { status: 200, contentType: 'application/json', body }
}

async function mockAllRoutes(page: Page): Promise<void> {
  await page.route('**/regional/postcode/**', (r) => r.fulfill(jsonResponse(CI_BODY)))
  await page.route('**/grid-supply-points/**', (r) =>
    r.fulfill(jsonResponse(JSON.stringify({ results: [{ group_id: '_P' }] }))))
  await page.route('**/standard-unit-rates/**', (r) =>
    r.fulfill(jsonResponse(JSON.stringify({ results: [{ value_inc_vat: 24.5 }] }))))
  await page.route('**/postcodes/**', (r) =>
    r.fulfill(jsonResponse(JSON.stringify({ result: { latitude: 52.628, longitude: 1.298 } }))))
  await page.route('**/air-quality**', (r) =>
    r.fulfill(jsonResponse(JSON.stringify({
      current: { european_aqi: 2, pm2_5: 5.2, nitrogen_dioxide: 10.3, ozone: 65.1 },
    }))))
}

test('refresh: clicking refresh re-fires all network requests', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { localStorage.removeItem('whats-watt:postcode') })

  await mockAllRoutes(page)

  await page.getByLabel('UK postcode').fill('NR1 4AA')
  await page.getByRole('button', { name: /get electricity data/i }).click()

  // Wait for results to appear
  await expect(page.getByTestId('carbon-intensity-card')).toBeVisible({ timeout: 10_000 })

  // Override CI route to count re-calls after refresh
  let ciCallCount = 0
  await page.route('**/regional/postcode/**', (r) => {
    ciCallCount++
    return r.fulfill({ status: 200, contentType: 'application/json', body: CI_BODY })
  })

  // Click the refresh button
  await page.getByRole('button', { name: /refresh data/i }).click()

  // Verify CI request was re-fired
  await expect.poll(() => ciCallCount, { timeout: 10_000 }).toBeGreaterThan(0)

  // Cards should still be visible after refresh
  await expect(page.getByTestId('carbon-intensity-card')).toBeVisible({ timeout: 10_000 })
})
