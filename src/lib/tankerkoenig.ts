import type { Coords } from './geolocation'

const BASE_URL = 'https://creativecommons.tankerkoenig.de/json'

export type TankerFuelType = 'e5' | 'e10' | 'diesel'

export interface TankerStation {
  id: string
  name: string
  brand: string
  dist: number
  price: number | false
}

export interface TankerListResponse {
  ok: boolean
  stations: TankerStation[]
}

/**
 * Fetch nearby station prices from the Tankerkönig API.
 * Returns the average price of the cheapest stations (up to `limit`).
 *
 * @throws {Error} when the API returns ok:false or the network fails
 */
export async function fetchNearbyPrice(
  apiKey: string,
  coords: Coords,
  fuelType: TankerFuelType,
  radiusKm = 5,
  limit = 5,
): Promise<{ averagePrice: number; stationCount: number; timestamp: string }> {
  const url = new URL(`${BASE_URL}/list.php`)
  url.searchParams.set('lat', String(coords.lat))
  url.searchParams.set('lng', String(coords.lng))
  url.searchParams.set('rad', String(radiusKm))
  url.searchParams.set('sort', 'price')
  url.searchParams.set('type', fuelType)
  url.searchParams.set('apikey', apiKey)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Tankerkönig HTTP ${res.status}`)

  const data = (await res.json()) as TankerListResponse
  if (!data.ok) throw new Error('Tankerkönig API returned ok:false')

  const priced = (data.stations.filter((s) => typeof s.price === 'number') as Array<
    TankerStation & { price: number }
  >)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit)

  if (priced.length === 0) throw new Error('Keine Preisdaten für diesen Bereich')

  const sum = priced.reduce((acc, s) => acc + s.price, 0)
  return {
    averagePrice: sum / priced.length,
    stationCount: priced.length,
    timestamp: new Date().toISOString(),
  }
}
