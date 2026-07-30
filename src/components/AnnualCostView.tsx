import { useState } from 'react'
import { calculateAnnualCost } from '../lib/calculations'
import { Slider } from './ui/Slider'
import type { BreakevenResult } from '../types'

interface Props {
  result: BreakevenResult
}

const ANNUAL_KM_OPTIONS = [10000, 15000, 20000, 25000, 30000]

export function AnnualCostView({ result }: Props) {
  const [open, setOpen] = useState(false)
  const [annualKm, setAnnualKm] = useState(15000)
  const [evSharePercent, setEvSharePercent] = useState(60)

  const referenceScenario = result.scenarios.reduce<typeof result.scenarios[number] | undefined>(
    (cheapest, s) => (!cheapest || s.price_ct_kwh < cheapest.price_ct_kwh ? s : cheapest),
    undefined,
  )

  if (!referenceScenario) return null

  const annual = calculateAnnualCost(
    annualKm,
    evSharePercent,
    referenceScenario.cost_per_100km,
    result.fuel_cost_per_100km,
  )

  const savingsColor = annual.savings_annual >= 0 ? 'text-green-400' : 'text-red-400'
  const savingsSign = annual.savings_annual >= 0 ? '+' : '−'

  return (
    <div className="rounded-xl bg-slate-800/50 ring-1 ring-slate-700 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-slate-200">Jahreskosten</span>
        <span className="text-slate-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-5 border-t border-slate-700">
          {/* Annual km selector */}
          <div className="pt-4 space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">Jahresfahrleistung</p>
            <div className="flex gap-2 flex-wrap">
              {ANNUAL_KM_OPTIONS.map((km) => (
                <button
                  key={km}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    annualKm === km
                      ? 'bg-green-500 text-slate-900'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                  onClick={() => setAnnualKm(km)}
                >
                  {(km / 1000).toFixed(0)}k km
                </button>
              ))}
            </div>
          </div>

          {/* EV share slider */}
          <Slider
            label="Elektrisch gefahren"
            min={0}
            max={100}
            step={5}
            value={evSharePercent}
            onChange={setEvSharePercent}
            formatValue={(v) => `${v} %`}
          />

          {/* Reference scenario note */}
          <p className="text-xs text-slate-500">
            Referenz: {referenceScenario.label} ({referenceScenario.price_ct_kwh} ct/kWh)
          </p>

          {/* Results */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-slate-800 p-3">
              <p className="text-xs text-slate-400">Strom/Jahr</p>
              <p className="font-mono text-lg font-bold text-slate-100 mt-1">
                {annual.ev_cost_annual.toFixed(0)} €
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 p-3">
              <p className="text-xs text-slate-400">Benzin/Jahr</p>
              <p className="font-mono text-lg font-bold text-slate-100 mt-1">
                {annual.fuel_cost_annual.toFixed(0)} €
              </p>
            </div>
            <div className="rounded-xl bg-slate-800 p-3">
              <p className="text-xs text-slate-400">Ersparnis</p>
              <p className={`font-mono text-lg font-bold mt-1 ${savingsColor}`}>
                {savingsSign}{Math.abs(annual.savings_annual).toFixed(0)} €
              </p>
            </div>
          </div>

          <p className="text-xs text-center text-slate-500">
            Gegenüber {annualKm.toLocaleString('de-DE')} km rein mit Benzin
          </p>
        </div>
      )}
    </div>
  )
}
