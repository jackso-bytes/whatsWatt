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
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
