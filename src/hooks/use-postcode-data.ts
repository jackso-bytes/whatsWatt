import { useReducer, useEffect } from 'react'
import { carbonIntensity } from '../services/carbon-intensity'
import { octopus } from '../services/octopus'
import { airQuality } from '../services/air-quality'
import { aqiBand, type AqiLevel } from '../utils/aqi-band'

export interface PostcodeDataState {
  status: 'idle' | 'loading' | 'success'
  region?: { name: string; gspId: string }
  intensity?: { actual: number; band: 'low' | 'moderate' | 'high'; updatedAt: string }
  generationMix?: Array<{ fuel: string; perc: number }>
  unitRate?: { value: number; tariff: string }
  aqi?: { index: number; level: AqiLevel; pm25: number; no2: number; o3: number }
  intensityError?: Error
  unitRateError?: Error
  aqiError?: Error
}

type Action =
  | { type: 'loading' }
  | { type: 'ci_ok'; intensity: Exclude<PostcodeDataState['intensity'], undefined>; generationMix: PostcodeDataState['generationMix']; region: { name: string; gspId: string } }
  | { type: 'ci_err'; error: Error }
  | { type: 'octopus_ok'; unitRate: PostcodeDataState['unitRate']; gspId: string }
  | { type: 'octopus_err'; error: Error }
  | { type: 'aqi_ok'; aqi: PostcodeDataState['aqi'] }
  | { type: 'aqi_err'; error: Error }
  | { type: 'success' }

interface FetchContext {
  postcode: string
  dispatch: (action: Action) => void
  ignore: { current: boolean }
}

const IDLE: PostcodeDataState = { status: 'idle' }

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

function extractGspId(tariff: string): string {
  const lastSegment = tariff.split('-').at(-1) ?? ''
  return `_${lastSegment}`
}

function reducer(state: PostcodeDataState, action: Action): PostcodeDataState {
  switch (action.type) {
    case 'loading': {
      return { status: 'loading' }
    }
    case 'ci_ok': {
      return {
        ...state,
        intensity: action.intensity,
        generationMix: action.generationMix,
        region: { name: action.region.name, gspId: state.region?.gspId ?? action.region.gspId },
      }
    }
    case 'ci_err': {
      return { ...state, intensityError: action.error }
    }
    case 'octopus_ok': {
      return {
        ...state,
        unitRate: action.unitRate,
        region: state.region
          ? { ...state.region, gspId: action.gspId }
          : { name: '', gspId: action.gspId },
      }
    }
    case 'octopus_err': {
      return { ...state, unitRateError: action.error }
    }
    case 'aqi_ok': {
      return { ...state, aqi: action.aqi }
    }
    case 'aqi_err': {
      return { ...state, aqiError: action.error }
    }
    case 'success': {
      return { ...state, status: 'success' }
    }
  }
}

function fetchCi({ postcode, dispatch, ignore }: FetchContext): Promise<void> {
  return carbonIntensity(postcode).then(
    (result) => {
      if (!ignore.current) {
        dispatch({
          type: 'ci_ok',
          intensity: { actual: result.actual, band: result.band, updatedAt: result.updatedAt },
          generationMix: result.generationMix,
          region: { name: result.regionName, gspId: '' },
        })
      }
    },
    (error: unknown) => {
      if (!ignore.current) dispatch({ type: 'ci_err', error: toError(error) })
    },
  )
}

function fetchOctopus({ postcode, dispatch, ignore }: FetchContext): Promise<void> {
  return octopus(postcode).then(
    (result) => {
      if (!ignore.current) {
        dispatch({ type: 'octopus_ok', unitRate: result, gspId: extractGspId(result.tariff) })
      }
    },
    (error: unknown) => {
      if (!ignore.current) dispatch({ type: 'octopus_err', error: toError(error) })
    },
  )
}

function fetchAq({ postcode, dispatch, ignore }: FetchContext): Promise<void> {
  return airQuality(postcode).then(
    (result) => {
      if (!ignore.current) {
        dispatch({
          type: 'aqi_ok',
          aqi: {
            index: result.european_aqi,
            level: aqiBand(result.european_aqi),
            pm25: result.pm2_5,
            no2: result.nitrogen_dioxide,
            o3: result.ozone,
          },
        })
      }
    },
    (error: unknown) => {
      if (!ignore.current) dispatch({ type: 'aqi_err', error: toError(error) })
    },
  )
}

export function usePostcodeData(postcode: string): PostcodeDataState {
  const [state, dispatch] = useReducer(reducer, IDLE)

  useEffect(() => {
    if (!postcode) return

    const ignore = { current: false }
    const context: FetchContext = { postcode, dispatch, ignore }

    dispatch({ type: 'loading' })

    void Promise.allSettled([fetchCi(context), fetchOctopus(context), fetchAq(context)]).then(() => {
      if (!ignore.current) {
        localStorage.setItem('whats-watt:postcode', postcode)
        dispatch({ type: 'success' })
      }
    })

    return () => {
      ignore.current = true
    }
  }, [postcode])

  if (!postcode) return IDLE
  return state
}
