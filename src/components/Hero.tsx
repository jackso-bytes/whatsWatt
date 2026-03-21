import { useState, useId } from 'react'
import { Primitive } from '@radix-ui/react-primitive'
import { formatPostcode } from '../utils/format-postcode'

const LS_KEY = 'whats-watt:postcode'

interface HeroProperties {
  onSubmit: (postcode: string) => void
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 14, height: 14, flexShrink: 0 }}>
      <path d="M7 2 L12 7 L7 12 M2 7 L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface PostcodeFormProperties {
  onSubmit: (postcode: string) => void
}

function PostcodeForm({ onSubmit }: PostcodeFormProperties) {
  const [value, setValue] = useState(() => localStorage.getItem(LS_KEY) ?? '')
  const [error, setError] = useState<string | undefined>()
  const errorId = useId()

  function handleSubmit(event_: React.FormEvent) {
    event_.preventDefault()
    const normalised = formatPostcode(value)
    if (!normalised) {
      setError('Enter a valid UK postcode, e.g. SW1A 1AA')
      return
    }
    setError(undefined)
    onSubmit(normalised)
  }

  return (
    <form role="search" aria-label="Postcode lookup" onSubmit={handleSubmit}>
      <div role="group" aria-label="Enter postcode" style={{ display: 'flex', gap: 'var(--space-sm)', background: 'var(--color-surface)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius-input)', padding: 'var(--space-sm)', maxWidth: 420, margin: '0 auto' }}>
        <label htmlFor="postcode-input" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>UK postcode</label>
        <Primitive.input
          id="postcode-input"
          type="text"
          value={value}
          onChange={(event_) => setValue(event_.target.value)}
          placeholder="e.g. SW1A 1AA"
          maxLength={8}
          autoComplete="postal-code"
          spellCheck={false}
          aria-label="UK postcode"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: 'var(--space-sm)', minWidth: 0 }}
        />
        <Primitive.button type="submit" aria-label="Look up electricity data for this postcode" style={{ flexShrink: 0, background: '#3aad63', color: '#fff', border: 'none', borderRadius: 'var(--radius-button)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, padding: 'var(--space-sm) var(--space-md)', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <ArrowIcon />
          Look up
        </Primitive.button>
      </div>
      {error && <p id={errorId} role="alert" style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--text-sm)', color: 'var(--color-intensity-high)' }}>{error}</p>}
    </form>
  )
}

export function Hero({ onSubmit }: HeroProperties) {
  return (
    <section style={{ padding: 'var(--space-xl) 0 var(--space-lg)', textAlign: 'center' }} aria-labelledby="hero-headline">
      <div aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-brand-light)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-md)' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-brand-light)', display: 'inline-block' }} />
        Live UK grid data
      </div>
      <h1 id="hero-headline" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.5rem, 9vw, 4.5rem)', lineHeight: 1.05, color: 'var(--color-text-primary)', letterSpacing: '-0.025em', marginBottom: 'var(--space-sm)' }}>
        How <span style={{ color: 'var(--color-brand-light)' }}>green</span> is<br />your electricity?
      </h1>
      <p style={{ fontSize: 'var(--text-base)', fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.65, maxWidth: 380, margin: '0 auto var(--space-xl)' }}>
        Enter your postcode. See the carbon intensity, generation mix, and unit cost for your region — right now.
      </p>
      <PostcodeForm onSubmit={onSubmit} />
    </section>
  )
}
