import { test, expect } from '@playwright/test'

test('happy path: NR1 4AA → all 5 cards visible with real data', async ({ page }) => {
  await page.goto('/')

  // Enter postcode and submit
  await page.getByLabel('UK postcode').fill('NR1 4AA')
  await page.getByRole('button', { name: /get electricity data/i }).click()

  // Wait for all 5 cards to appear (real API calls — allow 30s)
  const carbonCard = page.getByTestId('carbon-intensity-card')
  const genMixCard = page.getByTestId('generation-mix-card')
  const aqiCard = page.getByTestId('air-quality-card')
  const unitRateCard = page.getByTestId('unit-rate-card')
  const costCard = page.getByTestId('cost-breakdown-card')

  await expect(carbonCard).toBeVisible({ timeout: 30_000 })
  await expect(genMixCard).toBeVisible({ timeout: 30_000 })
  await expect(aqiCard).toBeVisible({ timeout: 30_000 })
  await expect(unitRateCard).toBeVisible({ timeout: 30_000 })
  await expect(costCard).toBeVisible({ timeout: 30_000 })

  // Each card shows a numeric value
  await expect(carbonCard).toContainText(/\d/)
  await expect(genMixCard).toContainText(/\d/)
  await expect(aqiCard).toContainText(/\d/)
  await expect(unitRateCard).toContainText(/\d/)
  await expect(costCard).toContainText(/\d/)
})
