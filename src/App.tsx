import { useState } from 'react'
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

// eslint-disable-next-line max-lines-per-function
export default function App() {
  const [postcode, setPostcode] = useState('')
  const data = usePostcodeData(postcode)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-md py-xl">
        <Hero onSubmit={setPostcode} />

        {postcode && (
          <NetworkBanner
            intensityError={data.intensityError}
            unitRateError={data.unitRateError}
            aqiError={data.aqiError}
            onRetry={data.refetch}
          />
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

            <CarbonIntensityCard
              intensity={data.intensity}
              error={data.intensityError}
              onRetry={data.refetch}
            />

            <div className="grid lg:grid-cols-[3fr_2fr] gap-md mt-md">
              <GenerationMixCard
                mix={data.generationMix}
                lcoe={LCOE}
                error={data.intensityError}
                onRetry={data.refetch}
              />
              <AirQualityCard
                aqi={data.aqi}
                error={data.aqiError}
                onRetry={data.refetch}
              />
            </div>

            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-[0.08em] mt-xl mb-md">
              Price data
            </h2>

            <UnitRateCard
              unitRate={data.unitRate}
              error={data.unitRateError}
              onRetry={data.refetch}
            />

            {(data.generationMix ?? data.intensityError) && (data.unitRate ?? data.unitRateError) && (
              <CostBreakdownCard
                generationMix={data.generationMix ?? []}
                lcoe={LCOE}
                unitRate={data.unitRate?.value ?? 0}
              />
            )}

            <div className="flex items-center justify-center py-sm mt-md">
              <button
                type="button"
                aria-label="Refresh data"
                onClick={data.refetch}
                className="flex items-center gap-xs text-xs font-medium text-[var(--color-text-disabled)] hover:text-[var(--color-brand-light)] transition-colors duration-[var(--dur-fast)] cursor-pointer bg-transparent border-none"
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-3 h-3"
                >
                  <path
                    d="M10.5 6 A4.5 4.5 0 1 1 8.5 2.2 L10.5 2.2 M10.5 2.2 L10.5 4.2"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
