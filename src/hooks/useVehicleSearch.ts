import { useMemo, useState } from 'react'
import vehicleDb from '../data/vehicles.json'
import type { Vehicle } from '../types'

const ALL_VEHICLES = vehicleDb.vehicles as Vehicle[]

export function useVehicleSearch() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 1) return ALL_VEHICLES
    return ALL_VEHICLES.filter((v) => {
      const haystack = `${v.make} ${v.model} ${v.variant} ${v.year}`.toLowerCase()
      return q.split(' ').every((word) => haystack.includes(word))
    })
  }, [query])

  return { query, setQuery, results, allVehicles: ALL_VEHICLES }
}
