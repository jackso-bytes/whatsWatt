# PRD — What's Watt

## Context

**What's Watt** is a single-page React app that lets UK residents look up real-time electricity insights for their postcode. The core value proposition is answering the question "how green — and how cheap — is my electricity right now?" in one glance.

The prototype (`electricity-dashboard-mockup.html`) is the design source of truth: Ocean Depths dark theme, Plus Jakarta Sans, teal/green palette, card-based layout, responsive (mobile-first → desktop 2-column grid).

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (design tokens mapped to CSS variables) |
| UI primitives | Radix UI — `@radix-ui/react-primitive` for Input, Button, and any interactive elements |
| Testing: unit/component | Vitest + React Testing Library |
| Testing: E2E | Playwright |
| Persistence | `localStorage` (last searched postcode) |
| State | React `useState` / `useReducer` — no external store |

---

## External APIs

### 1. Carbon Intensity API — `https://api.carbonintensity.org.uk`

**Endpoints used:**

| Data | Endpoint |
|---|---|
| Regional intensity + generation mix | `GET /regional/postcode/{postcode}` |

Returns `intensity.actual` (gCO₂/kWh) and `generationmix[]` (array of `{ fuel, perc }`) for the postcode's DNO region.

**Intensity banding logic (hardcoded thresholds):**

| Band | Range (gCO₂/kWh) | Colour token |
|---|---|---|
| Low | 0–100 | `--color-intensity-low` |
| Moderate | 100–200 | `--color-intensity-moderate` |
| High | 200+ | `--color-intensity-high` |

### 2. Octopus Energy API — `https://api.octopus.energy`

**Endpoints used:**

| Data | Endpoint |
|---|---|
| Grid Supply Point (region) | `GET /v1/industry/grid-supply-points/?postcode={postcode}` |
| Standard unit rate for region | `GET /v1/products/VAR-22-11-01/electricity-tariffs/E-1R-VAR-22-11-01-{gsp}/standard-unit-rates/?page_size=1` |

The GSP identifier (e.g. `_P` for East England) is derived from the grid-supply-points response. The tariff code uses Octopus's standard Flexible Octopus product `VAR-22-11-01`.

No auth required for both endpoints.

### 3. Open-Meteo Air Quality API — `https://air-quality-api.open-meteo.com`

**Endpoints used:**

| Data | Endpoint |
|---|---|
| AQI + pollutants | `GET /v1/air-quality?latitude={lat}&longitude={lon}&current=european_aqi,pm2_5,nitrogen_dioxide,ozone` |

Requires lat/lon, not postcode. Resolved via:

`GET https://api.postcodes.io/postcodes/{postcode}` → `result.latitude`, `result.longitude`

(postcodes.io is free, no auth, no rate limits)

**AQI banding (European scale 1–5):**

| Value | Label | Colour token |
|---|---|---|
| 1 | Good | `--color-aqi-good` |
| 2 | Fair | `--color-aqi-fair` |
| 3 | Moderate | `--color-aqi-moderate` |
| 4 | Poor | `--color-aqi-poor` |
| 5 | Very Poor | `--color-aqi-very-poor` |

---

## Static Data: LCOE Constants

Source: DESNZ *Electricity Generation Costs 2025* (January 2026)

```ts
// src/data/lcoe.ts
export const LCOE: Record<string, { label: string; low: number; high?: number; colour: string }> = {
  solar:   { label: 'Solar',   low: 60,        colour: '#f0a500' },
  wind:    { label: 'Wind',    low: 83,        colour: '#3aad63' },
  gas:     { label: 'Gas',     low: 105,       colour: '#8899aa' },
  nuclear: { label: 'Nuclear', low: 95, high: 125, colour: '#a97fd4' },
  biomass: { label: 'Biomass', low: 138,       colour: '#5bc9a8' },
  hydro:   { label: 'Hydro',   low: 0,         colour: '#2f9960' },   // no published figure
  imports: { label: 'Imports', low: 0,         colour: '#6a7fa0' },   // no published figure
};
```

Wind figure is a capacity-weighted average: onshore £58, fixed offshore £105, floating £155 (weighted by 2024 installed capacity).

---

## UI Specification

### Pages / Routes

Single page, no routing. Two view states:

1. **Landing** — hero + postcode input only (no results shown)
2. **Results** — hero + full dashboard below the input

### Components

```
src/
  components/
    Navbar.tsx
    Hero.tsx                  ← postcode form, manages input + submit
    results/
      RegionHeader.tsx        ← "NR1 4AA · East England · GSP Region P"
      CarbonIntensityCard.tsx ← hero number, badge, scale bar, timestamp
      GenerationMixCard.tsx   ← donut SVG + legend with LCOE column
      AirQualityCard.tsx      ← AQI number, 5-step bar, pollutant tiles
      UnitRateCard.tsx        ← p/kWh, tariff badge
      CostBreakdownCard.tsx   ← horizontal bar chart, insight callout, methodology accordion
    Footer.tsx
  hooks/
    usePostcodeData.ts        ← orchestrates all 4 fetches in parallel, returns unified state
  services/
    carbonIntensity.ts
    octopus.ts
    airQuality.ts
    geocoding.ts              ← postcodes.io lookup
  data/
    lcoe.ts                   ← static LCOE constants
  utils/
    intensityBand.ts          ← (value: number) => 'low' | 'moderate' | 'high'
    aqiBand.ts                ← (value: number) => AqiLevel
    lcoeWeightedAvg.ts        ← (generationMix, lcoeMap) => number
    formatPostcode.ts         ← normalise + validate UK postcode format
  styles/
    tokens.css                ← CSS custom properties from prototype (consumed by Tailwind theme)
    global.css
```

### Data-fetching hook

`usePostcodeData(postcode: string)` fires when `postcode` is non-empty and valid.

Internally runs 3 fetches in parallel:
1. Carbon Intensity `/regional/postcode/{postcode}` (also derives DNO region name)
2. Octopus grid-supply-points → then unit-rate (sequential, 2 round trips)
3. postcodes.io → then Open-Meteo air quality (sequential, 2 round trips)

Returns:
```ts
{
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  region?: { postcode: string; name: string; gspId: string };
  intensity?: { actual: number; band: 'low' | 'moderate' | 'high'; updatedAt: string };
  generationMix?: Array<{ fuel: string; perc: number }>;
  unitRate?: { value: number; tariff: string };
  aqi?: { index: number; level: AqiLevel; pm25: number; no2: number; o3: number };
}
```

### Postcode persistence

On successful lookup: `localStorage.setItem('whats-watt:postcode', postcode)`.
On mount: read and pre-fill the input (but do not auto-submit).

### Loading state

While `status === 'loading'`, render skeleton placeholders for each card (same grid layout, pulsing background).

### Error state

If any single API fails, show that card in an error state with a retry option. The other cards remain visible. Network-level failures show a banner below the input.

---

## Desktop Layout (≥1024px)

2-column CSS grid (3fr 2fr) matching the prototype:

```
region-header  [full width]
env-heading    [full width]
intensity      [full width]
mix            air-quality
price-heading  [full width]
unit-rate      [full width]
cost-breakdown [full width]
refresh        [full width]
```

---

## Radix UI Usage

| Component | Radix primitive |
|---|---|
| Postcode text input | `@radix-ui/react-primitive` `<Primitive.input>` (or unstyled wrapper) |
| "Look up" submit button | `@radix-ui/react-primitive` `<Primitive.button>` |
| Refresh button | `@radix-ui/react-primitive` `<Primitive.button>` |
| Methodology disclosure (Cost Breakdown) | `@radix-ui/react-collapsible` |
| Any future tooltip on LCOE figures | `@radix-ui/react-tooltip` |

Radix handles keyboard interaction and ARIA attributes for all interactive elements; Tailwind provides the visual styles.

---

## Tailwind Setup Notes

- Use Tailwind v4's CSS-first config (`@import "tailwindcss"` in `global.css`)
- Map the prototype's Ocean Depths design tokens into the Tailwind theme via `@theme` block (colours, spacing, radii, font sizes)
- Retain CSS custom properties in `tokens.css` for any inline-style dynamic values (e.g. `--intensity-marker-left: 47%`) that Tailwind can't handle at build time

---

## Accessibility

- All interactive elements have `aria-label`
- Donut chart has `role="img"` with a descriptive `aria-label` listing all segments
- Scale bars are `aria-hidden` (decorative); screen-reader text conveys the value + band label
- Focus rings use `--color-brand-light` outline (already in prototype CSS)
- Colour is never the sole means of conveying information (badge text + numeric value always present)

---

## Testing Plan

### Unit tests (Vitest)

| File | What to test |
|---|---|
| `utils/intensityBand.ts` | boundary values: 0, 99, 100, 199, 200, 300 |
| `utils/aqiBand.ts` | each AQI level 1–5 |
| `utils/lcoeWeightedAvg.ts` | known mix (prototype data) → ~£97/MWh |
| `utils/formatPostcode.ts` | valid formats, invalid input, normalisation |
| `services/carbonIntensity.ts` | mock fetch, assert correct data extraction |
| `services/octopus.ts` | mock 2-step fetch, assert unit-rate value |
| `services/airQuality.ts` | mock geocoding + air quality fetch |

### Component tests (React Testing Library)

| Component | What to test |
|---|---|
| `Hero` | renders input, submit calls handler, invalid postcode shows error |
| `CarbonIntensityCard` | renders correct number, badge text, scale marker position |
| `GenerationMixCard` | all fuels rendered in legend, LCOE column present |
| `AirQualityCard` | AQI number, correct segment highlighted, pollutant values |
| `UnitRateCard` | displays rate + tariff badge |
| `CostBreakdownCard` | bars render, insight text present, methodology disclosure toggles |

### E2E / integration tests (Playwright)

| Scenario | Steps |
|---|---|
| Happy path | Load app → enter `NR1 4AA` → submit → all 5 cards visible with real data |
| Invalid postcode | Enter `ZZZZZ` → submit → inline error shown, no cards rendered |
| Last postcode restored | Submit valid postcode → reload page → input pre-filled with that postcode |
| API error recovery | Intercept carbon-intensity fetch, return 500 → intensity card shows error state, other cards still load |
| Refresh | Submit → click refresh → data re-fetched (network requests fired again) |

---

## Out of Scope (v1)

- Historical data / time-series charts
- Multiple saved postcodes
- Price comparison between tariffs
- Light mode toggle
- PWA / offline support
- About page content (link in navbar can be a placeholder `#`)
