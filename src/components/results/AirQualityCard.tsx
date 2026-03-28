import type { AqiLevel } from '../../utils/aqi-band';

interface AqiData {
  readonly index: number;
  readonly level: AqiLevel;
  readonly pm25: number;
  readonly no2: number;
  readonly o3: number;
}

interface Properties {
  readonly aqi?: AqiData
  readonly error?: Error
  readonly onRetry?: () => void
}

const LEVEL_ORDER: AqiLevel[] = [
  'good',
  'fair',
  'moderate',
  'poor',
  'very-poor',
];
type LevelLabel = 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor';

const getLevelLabels = (level: AqiLevel): LevelLabel => {
  switch (level) {
    case 'fair': {
      return 'Fair';
    }
    case 'moderate': {
      return 'Moderate';
    }
    case 'good': {
      return 'Good';
    }
    case 'poor': {
      return 'Poor';
    }
    case 'very-poor': {
      return 'Very Poor';
    }
  }
};

const INACTIVE_OPACITY = 0.35;

function levelToIndex(level: AqiLevel): number {
  return LEVEL_ORDER.indexOf(level) + 1;
}

interface PollutantProperties {
  name: string;
  value: number;
  ariaLabel: string;
}

function PollutantTile({
  name,
  value,
  ariaLabel,
}: Readonly<PollutantProperties>) {
  return (
    <li className='flex-1 min-w-[72px] bg-white/[0.04] border border-border rounded-button py-sm px-md'>
      <p className='text-xs font-semibold text-text-disabled uppercase tracking-[0.07em] mb-[3px]'>
        {name}
      </p>
      <p
        className='font-display text-lg font-bold text-text-primary tabular-nums tracking-[-0.02em]'
        aria-label={ariaLabel}
      >
        {value.toFixed(1)}
      </p>
      <span className='text-xs text-text-disabled font-normal block mt-[1px]'>
        µg/m³
      </span>
    </li>
  );
}

interface ScaleBarProperties {
  readonly activeIndex: number;
}

function ScaleBar({ activeIndex }: Readonly<ScaleBarProperties>) {
  return (
    <>
      <div
        className='flex gap-[3px] h-[6px] rounded-[3px] overflow-hidden mb-xs'
        aria-hidden='true'
      >
        {LEVEL_ORDER.map((lvl, segmentIndex) => (
          <div
            key={lvl}
            data-testid={`aqi-seg-${segmentIndex + 1}`}
            className='flex-1 rounded-[2px]'
            style={{
              background: `var(--color-aqi-${lvl})`,
              opacity: segmentIndex + 1 === activeIndex ? 1 : INACTIVE_OPACITY,
            }}
          />
        ))}
      </div>
      <div className='flex justify-between mb-md' aria-hidden='true'>
        <span className='text-xs text-text-disabled font-medium'>Good</span>
        <span className='text-xs text-text-disabled font-medium'>
          Very Poor
        </span>
      </div>
    </>
  );
}

interface ErrorFallbackProperties { readonly onRetry?: () => void }

function CardErrorFallback({ onRetry }: ErrorFallbackProperties) {
  return (
    <article className="rounded-card p-lg border border-border shadow-[0_2px_24px_rgba(0,0,0,0.32)]" style={{ background: 'var(--color-surface)' }} aria-labelledby="aqi-heading">
      <span id="aqi-heading" className="sr-only">Air Quality</span>
      <p role="alert" className="text-sm text-text-secondary">Something went wrong loading air quality data.</p>
      {onRetry && <button onClick={onRetry} className="text-xs text-brand-light underline self-start bg-transparent border-none cursor-pointer p-0">Retry</button>}
    </article>
  )
}

export function AirQualityCard({ aqi, error, onRetry }: Readonly<Properties>) {
  if (error) return <CardErrorFallback onRetry={onRetry} />
  if (!aqi) return
  const { level, pm25, no2, o3 } = aqi
  const displayIndex = levelToIndex(level)
  const label = LEVEL_LABELS[level]
  const colour = `var(--color-aqi-${level})`

function AqiHeader({ label, colour }: Readonly<AqiHeaderProperties>) {
  return (
    <article
      data-testid="air-quality-card"
      className="rounded-card p-lg border shadow-[0_2px_24px_rgba(0,0,0,0.32)]"
      style={{ background: `var(--color-aqi-${level}-bg)`, borderColor: `var(--color-aqi-${level}-border, var(--color-border))` }}
      aria-labelledby="aqi-heading"
    >
      <div className="flex items-center justify-between mb-md">
        <span className="text-base font-semibold text-text-primary" id="aqi-heading">Air Quality</span>
        <div
          role="img"
          aria-label={`Air quality: ${label}`}
          className="inline-flex items-center gap-[5px] px-3 py-1 rounded-pill text-white text-xs font-bold tracking-[0.06em] uppercase"
          style={{ background: colour }}
        >
          <span aria-hidden="true" className="w-[6px] h-[6px] rounded-full bg-white/60 inline-block" />
          {label}
        </div>
      </div>

      <div className="flex items-baseline gap-sm mb-md">
        <span
          aria-hidden='true'
          className='w-[6px] h-[6px] rounded-full bg-white/60 inline-block'
        />
        {label}
      </div>
    </div>
  );
}

interface AqiNumberProperties {
  readonly displayIndex: number;
  readonly colour: string;
}

function AqiNumber({ displayIndex, colour }: Readonly<AqiNumberProperties>) {
  return (
    <div className='flex items-baseline gap-sm mb-md'>
      <span
        className='font-display text-[3.5rem] font-extrabold leading-none tabular-nums tracking-[-0.04em]'
        style={{ color: colour }}
        aria-label={`European AQI ${displayIndex}`}
      >
        {displayIndex}
      </span>
      <span
        aria-hidden='true'
        className='text-lg font-semibold'
        style={{ color: colour }}
      >
        / 5
      </span>
    </div>
  );
}

export function AirQualityCard({ aqi }: Readonly<Properties>) {
  const { level, pm25, no2, o3 } = aqi;
  const displayIndex = levelToIndex(level);
  const label = getLevelLabels(level);
  const colour = `var(--color-aqi-${level})`;

  return (
    <article
      data-testid='air-quality-card'
      className='rounded-card p-lg border shadow-[0_2px_24px_rgba(0,0,0,0.32)]'
      style={{
        background: `var(--color-aqi-${level}-bg)`,
        borderColor: `var(--color-aqi-${level}-border, var(--color-border))`,
      }}
      aria-labelledby='aqi-heading'
    >
      <AqiHeader label={label} colour={colour} />
      <AqiNumber displayIndex={displayIndex} colour={colour} />
      <ScaleBar activeIndex={displayIndex} />
      <ul aria-label='Key pollutants' className='flex gap-md flex-wrap'>
        <PollutantTile
          name='PM2.5'
          value={pm25}
          ariaLabel={`${pm25.toFixed(1)} micrograms per cubic metre`}
        />
        <PollutantTile
          name='NO₂'
          value={no2}
          ariaLabel={`${no2.toFixed(1)} micrograms per cubic metre`}
        />
        <PollutantTile
          name='O₃'
          value={o3}
          ariaLabel={`${o3.toFixed(1)} micrograms per cubic metre`}
        />
      </ul>
    </article>
  );
}
