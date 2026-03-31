import { test, expect } from '@playwright/test'

test('invalid postcode: ZZZZZ → inline error shown, no cards rendered', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('UK postcode').fill('ZZZZZ')
  await page.getByRole('button', { name: /get electricity data/i }).click()

  // Inline error alert should appear
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByRole('alert')).toContainText(/valid UK postcode/i)

  // No result cards should be rendered
  await expect(page.getByTestId('carbon-intensity-card')).toBeHidden()
  await expect(page.getByTestId('generation-mix-card')).toBeHidden()
  await expect(page.getByTestId('air-quality-card')).toBeHidden()
  await expect(page.getByTestId('unit-rate-card')).toBeHidden()
  await expect(page.getByTestId('cost-breakdown-card')).toBeHidden()
})
