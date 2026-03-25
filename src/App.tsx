import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { Skeleton } from './components/Skeleton'
import { RegionHeader } from './components/results/RegionHeader'
import { CarbonIntensityCard } from './components/results/CarbonIntensityCard'
import { GenerationMixCard } from './components/results/GenerationMixCard'
import { AirQualityCard } from './components/results/AirQualityCard'
import { UnitRateCard } from './components/results/UnitRateCard'
import { CostBreakdownCard } from './components/results/CostBreakdownCard'
import { usePostcodeData } from './hooks/use-postcode-data'
import { LCOE } from './data/lcoe'

export default function App() {
  const [postcode, setPostcode] = useState('')
  const data = usePostcodeData(postcode)

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-md py-xl">
        <Hero onSubmit={setPostcode} />

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

            {data.intensity && (
              <CarbonIntensityCard intensity={data.intensity} />
            )}

            <div className="grid lg:grid-cols-[3fr_2fr] gap-md mt-md">
              {data.generationMix && (
                <GenerationMixCard mix={data.generationMix} lcoe={LCOE} />
              )}
              {data.aqi && <AirQualityCard aqi={data.aqi} />}
            </div>

            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-[0.08em] mt-xl mb-md">
              Price data
            </h2>

            {data.unitRate && <UnitRateCard unitRate={data.unitRate} />}

            {data.generationMix && data.unitRate && (
              <CostBreakdownCard
                generationMix={data.generationMix}
                lcoe={LCOE}
                unitRate={data.unitRate.value}
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
