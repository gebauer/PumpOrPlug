import { useState } from 'react'
import { useVehicleSearch } from '../hooks/useVehicleSearch'
import { Input } from './ui/Input'
import type { Vehicle } from '../types'

interface Props {
  selected: Vehicle | null
  onSelect: (v: Vehicle) => void
}

export function VehicleSelector({ selected, onSelect }: Props) {
  const { query, setQuery, results } = useVehicleSearch()
  const [open, setOpen] = useState(false)

  function handleSelect(v: Vehicle) {
    onSelect(v)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative">
      {selected && !open ? (
        <button
          className="w-full rounded-xl bg-slate-800 p-4 text-left ring-1 ring-slate-700 hover:ring-green-500 transition-all"
          onClick={() => setOpen(true)}
        >
          <p className="text-xs uppercase tracking-wide text-slate-400">Ausgewähltes Fahrzeug</p>
          <p className="mt-1 font-semibold text-slate-100">
            {selected.make} {selected.model} {selected.year}
          </p>
          <p className="text-sm text-slate-400">{selected.variant}</p>
          <div className="mt-2 flex gap-4 text-xs text-slate-500">
            <span>⚡ {selected.ev_consumption_kwh_per_100km} kWh/100km</span>
            <span>⛽ {selected.fuel_consumption_l_per_100km} L/100km</span>
          </div>
        </button>
      ) : (
        <div>
          <Input
            label="Fahrzeug suchen"
            placeholder="z.B. Golf GTE, BMW 330e …"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            autoComplete="off"
          />
          {open && (
            <ul className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-xl bg-slate-800 ring-1 ring-slate-700 shadow-xl">
              {results.length === 0 && (
                <li className="px-4 py-3 text-sm text-slate-400">Kein Fahrzeug gefunden</li>
              )}
              {results.map((v) => (
                <li key={v.id}>
                  <button
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors"
                    onClick={() => handleSelect(v)}
                  >
                    <p className="text-sm font-semibold text-slate-100">
                      {v.make} {v.model} {v.year}
                    </p>
                    <p className="text-xs text-slate-400">{v.variant}</p>
                    <div className="mt-0.5 flex gap-3 text-xs text-slate-500">
                      <span>⚡ {v.ev_consumption_kwh_per_100km} kWh</span>
                      <span>⛽ {v.fuel_consumption_l_per_100km} L</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {selected && open && (
        <button
          className="mt-2 text-xs text-slate-500 hover:text-slate-300"
          onClick={() => setOpen(false)}
        >
          Abbrechen
        </button>
      )}
    </div>
  )
}
