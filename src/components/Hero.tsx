import { useState } from 'react'
import { Primitive } from '@radix-ui/react-primitive'
import { formatPostcode } from '../utils/format-postcode'

interface HeroProperties {
  onSubmit: (postcode: string) => void
}

const ARROW_ICON = (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-3.5 h-3.5 flex-shrink-0">
    <path d="M7 2 L12 7 L7 12 M2 7 L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function PostcodeForm({ onSubmit }: Readonly<HeroProperties>) {
  const [value, setValue] = useState(() => localStorage.getItem('whats-watt:postcode') ?? '')
  const [error, setError] = useState<string | undefined>()

  return (
    <form
      role="search"
      aria-label="Postcode lookup"
      noValidate
      onSubmit={(event_) => {
        event_.preventDefault()
        const formatted = formatPostcode(value)
        if (!formatted) { setError('Please enter a valid UK postcode'); return }
        setError(undefined)
        onSubmit(formatted)
      }}
    >
      <div className="flex gap-2 bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-input)] p-2 max-w-[420px] mx-auto focus-within:border-[var(--color-brand)]" role="group" aria-label="Enter postcode">
        <label htmlFor="postcode-input" className="sr-only">UK postcode</label>
        <Primitive.input
          id="postcode-input"
          className="flex-1 bg-transparent border-none outline-none text-lg font-semibold text-[var(--color-text-primary)] uppercase tracking-widest px-2 py-2 min-w-0"
          type="text"
          value={value}
          onChange={(event_) => { setValue(event_.target.value); setError(undefined) }}
          placeholder="e.g. SW1A 1AA"
          maxLength={8}
          aria-label="UK postcode"
          autoComplete="postal-code"
          spellCheck={false}
        />
        <Primitive.button type="submit" className="flex-shrink-0 bg-[#3aad63] text-white rounded-[var(--radius-button)] text-sm font-semibold px-4 py-2 hover:bg-[#52c278] flex items-center gap-1 whitespace-nowrap cursor-pointer" aria-label="Look up electricity data for this postcode">
          {ARROW_ICON}
          Look up
        </Primitive.button>
      </div>
      {error && <p role="alert" aria-live="polite" className="mt-2 text-sm text-[var(--color-intensity-high)]">{error}</p>}
    </form>
  )
}

export function Hero({ onSubmit }: Readonly<HeroProperties>) {
  return (
    <section className="py-10 pb-6 text-center" aria-labelledby="hero-headline">
      <div className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-light)] uppercase tracking-widest mb-4" aria-hidden="true">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-light)] animate-pulse" />
        Live UK grid data
      </div>
      <h1 id="hero-headline" className="font-extrabold text-[clamp(2.5rem,9vw,4.5rem)] leading-tight tracking-tight text-[var(--color-text-primary)] mb-2">
        How <span className="text-[var(--color-brand-light)]">green</span> is<br />your electricity?
      </h1>
      <p className="text-base font-light text-[var(--color-text-secondary)] leading-relaxed max-w-[380px] mx-auto mb-10">
        Enter your postcode. See the carbon intensity, generation mix, and unit cost for your region — right now.
      </p>
      <PostcodeForm onSubmit={onSubmit} />
    </section>
  )
}
