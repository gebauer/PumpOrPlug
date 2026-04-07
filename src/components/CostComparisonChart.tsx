import type { BreakevenResult } from '../types'

interface Props {
  result: BreakevenResult
}

export function CostComparisonChart({ result }: Props) {
  const allCosts = [
    result.fuel_cost_per_100km,
    ...result.scenarios.map((s) => s.cost_per_100km),
  ]
  const maxCost = Math.max(...allCosts) * 1.15

  const bars = [
    { label: 'Benzin', cost: result.fuel_cost_per_100km, color: 'bg-amber-500' },
    ...result.scenarios.map((s) => ({
      label: s.label,
      cost: s.cost_per_100km,
      color: s.isBelow ? 'bg-green-500' : 'bg-red-500',
    })),
  ]

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">Kosten pro 100 km</p>
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-xs text-slate-400 text-right">{bar.label}</span>
          <div className="flex-1 rounded-full bg-slate-800 h-5 overflow-hidden">
            <div
              className={`h-full rounded-full ${bar.color} transition-all duration-500`}
              style={{ width: `${(bar.cost / maxCost) * 100}%` }}
            />
          </div>
          <span className="w-16 shrink-0 text-right font-mono text-xs text-slate-300">
            {bar.cost.toFixed(2)} €
          </span>
        </div>
      ))}
    </div>
  )
}
