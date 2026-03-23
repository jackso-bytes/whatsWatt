export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        padding: 'var(--space-lg) var(--space-md)',
        textAlign: 'center',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <p>
        Data:{' '}
        <a
          href="https://carbonintensity.org.uk"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-brand-light)', textDecoration: 'none' }}
        >
          Carbon Intensity API
        </a>
        {' · '}
        <a
          href="https://octopus.energy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-brand-light)', textDecoration: 'none' }}
        >
          Octopus Energy
        </a>
        {'. '}
        <a
          href="https://open-meteo.com/en/docs/air-quality-api"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-brand-light)', textDecoration: 'none' }}
        >
          Open-Meteo Air Quality API
        </a>
      </p>
      <p style={{ marginTop: 4 }}>{"What's Watt"}</p>
    </footer>
  )
}
