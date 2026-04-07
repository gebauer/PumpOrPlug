import { useState, useCallback } from 'react'
import { getCurrentPosition } from '../lib/geolocation'
import { fetchNearbyPrice } from '../lib/tankerkoenig'
import type { TankerFuelType } from '../lib/tankerkoenig'
import type { FuelType } from '../types'

type Status =
  | { state: 'idle' }
  | { state: 'locating' }
  | { state: 'fetching'; stationCount?: number }
  | { state: 'success'; price: number; stationCount: number; timestamp: string; isStale?: boolean }
  | { state: 'error'; message: string }

function toTankerType(fuelType: FuelType): TankerFuelType {
  switch (fuelType) {
    case 'super_e5': return 'e5'
    case 'super_e10': return 'e10'
    case 'super_plus': return 'e5'   // closest Tankerkönig equivalent
    case 'diesel': return 'diesel'
  }
}

const CACHE_KEY = 'pumporplug-fuel-price-cache'

interface CachedPrice {
  price: number
  stationCount: number
  timestamp: string
  fuelType: FuelType
}

function loadCache(fuelType: FuelType): CachedPrice | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as CachedPrice
    if (cached.fuelType !== fuelType) return null
    return cached
  } catch {
    return null
  }
}

function saveCache(data: CachedPrice) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function useFuelPrice(apiKey: string | null, fuelType: FuelType) {
  const [status, setStatus] = useState<Status>({ state: 'idle' })

  const fetchPrice = useCallback(async () => {
    if (!apiKey) {
      setStatus({ state: 'error', message: 'Kein API-Key hinterlegt. Bitte in Einstellungen eintragen.' })
      return
    }

    setStatus({ state: 'locating' })

    let coords
    try {
      coords = await getCurrentPosition()
    } catch {
      // Geolocation failed — try stale cache before giving up
      const cached = loadCache(fuelType)
      if (cached) {
        setStatus({ state: 'success', ...cached, isStale: true })
      } else {
        setStatus({ state: 'error', message: 'Standort konnte nicht ermittelt werden. Bitte Preis manuell eingeben.' })
      }
      return
    }

    setStatus({ state: 'fetching' })

    try {
      const result = await fetchNearbyPrice(apiKey, coords, toTankerType(fuelType))
      const cacheEntry: CachedPrice = { price: result.averagePrice, stationCount: result.stationCount, timestamp: result.timestamp, fuelType }
      saveCache(cacheEntry)
      setStatus({ state: 'success', price: result.averagePrice, stationCount: result.stationCount, timestamp: result.timestamp, isStale: false })
    } catch {
      // Network/API failed — serve stale cache if available
      const cached = loadCache(fuelType)
      if (cached) {
        setStatus({ state: 'success', ...cached, isStale: true })
      } else {
        setStatus({ state: 'error', message: 'Preise konnten nicht geladen werden. Bitte manuell eingeben.' })
      }
    }
  }, [apiKey, fuelType])

  return { status, fetchPrice }
}
