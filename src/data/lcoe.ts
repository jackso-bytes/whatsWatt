export const LCOE: Record<string, { label: string; low: number; high?: number; colour: string }> = {
  solar:   { label: 'Solar',   low: 60,                colour: '#f0a500' },
  wind:    { label: 'Wind',    low: 83,                colour: '#3aad63' },
  gas:     { label: 'Gas',     low: 105,               colour: '#8899aa' },
  nuclear: { label: 'Nuclear', low: 95,  high: 125,    colour: '#a97fd4' },
  biomass: { label: 'Biomass', low: 138,               colour: '#5bc9a8' },
  hydro:   { label: 'Hydro',   low: 0,                 colour: '#2f9960' },
  imports: { label: 'Imports', low: 0,                 colour: '#6a7fa0' },
}
