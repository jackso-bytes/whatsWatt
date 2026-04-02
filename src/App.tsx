import { useState } from 'react'
import { Primitive } from '@radix-ui/react-primitive'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { Skeleton } from './components/Skeleton'
import { NetworkBanner } from './components/NetworkBanner'
import { RegionHeader } from './components/results/RegionHeader'
import { CarbonIntensityCard } from './components/results/CarbonIntensityCard'
import { GenerationMixCard } from './components/results/GenerationMixCard'
import { AirQualityCard } from './components/results/AirQualityCard'
import { UnitRateCard } from './components/results/UnitRateCard'
import { CostBreakdownCard } from './components/results/CostBreakdownCard'
import { usePostcodeData } from './hooks/use-postcode-data'
import { LCOE } from './data/lcoe'

const REFRESH_ICON = (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-3 h-3">
    <path d="M10.5 6 A4.5 4.5 0 1 1 8.5 2.2 L10.5 2.2 M10.5 2.2 L10.5 4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function App() {
  const [postcode, setPostcode] = useState(() => localStorage.getItem('whats-watt:postcode') ?? '')
  const data = usePostcodeData(postcode)

  const allApiFailed = Boolean(data.intensityError && data.unitRateError && data.aqiError)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-md py-xl">
        <Hero onSubmit={setPostcode} />

        {postcode && allApiFailed && (
          <NetworkBanner onRetry={data.refetch} />
        )}

        {postcode && data.status === 'loading' && <Skeleton />}

        {postcode && data.status !== 'loading' && (
          <>
            <RegionHeader
              postcode={postcode}
              regionName={data.region?.name ?? ''}
              gspId={data.region?.gspId ?? ''}
            />

            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-[0.08em] mt-xl mb-md">
              Environmental data
            </h2>

            {(data.intensity || data.intensityError) && (
              <CarbonIntensityCard
                intensity={data.intensity ?? { actual: 0, band: 'low', updatedAt: '' }}
                error={data.intensityError}
                onRetry={data.refetch}
              />
            )}

            <div className="grid lg:grid-cols-[3fr_2fr] gap-md mt-md">
              {(data.generationMix || data.intensityError) && (
                <GenerationMixCard
                  mix={data.generationMix ?? []}
                  lcoe={LCOE}
                  error={data.intensityError}
                  onRetry={data.refetch}
                />
              )}
              {(data.aqi || data.aqiError) && (
                <AirQualityCard
                  aqi={data.aqi ?? { index: 0, level: 'good', pm25: 0, no2: 0, o3: 0 }}
                  error={data.aqiError}
                  onRetry={data.refetch}
                />
              )}
            </div>

            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-[0.08em] mt-xl mb-md">
              Price data
            </h2>

            {(data.unitRate || data.unitRateError) && (
              <UnitRateCard
                unitRate={data.unitRate ?? { value: 0, tariff: '' }}
                error={data.unitRateError}
                onRetry={data.refetch}
              />
            )}

            {data.generationMix && data.unitRate && (
              <CostBreakdownCard
                generationMix={data.generationMix}
                lcoe={LCOE}
                unitRate={data.unitRate.value}
              />
            )}

            <div className="flex items-center justify-center py-sm mt-md">
              <Primitive.button
                type="button"
                onClick={data.refetch}
                aria-label="Refresh data"
                className="flex items-center gap-xs text-[var(--text-xs)] font-medium text-[var(--color-text-disabled)] hover:text-[var(--color-brand-light)] cursor-pointer bg-transparent border-none transition-colors"
              >
                {REFRESH_ICON}
                Refresh
              </Primitive.button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
