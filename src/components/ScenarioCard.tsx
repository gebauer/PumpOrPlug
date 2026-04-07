import type { ChargingScenario } from '../types'

interface Props {
  scenario: ChargingScenario
}

export function ScenarioCard({ scenario }: Props) {
  const statusColor = scenario.isBelow ? 'text-green-400' : 'text-red-400'
  const bgColor = scenario.isBelow ? 'bg-green-500/10 ring-green-500/30' : 'bg-red-500/10 ring-red-500/30'
  const icon = scenario.isBelow ? '✅' : '❌'

  return (
    <div className={`flex items-center justify-between rounded-xl px-4 py-3 ring-1 ${bgColor}`}>
      <div>
        <p className="text-sm font-semibold text-slate-200">{scenario.label}</p>
        <p className="text-xs text-slate-400 font-mono">{scenario.price_ct_kwh} ct/kWh</p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-mono font-semibold ${statusColor}`}>
          {icon} {scenario.cost_per_100km.toFixed(2)} €/100km
        </p>
        <p className={`text-xs font-mono ${scenario.savings_per_100km >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {scenario.savings_per_100km >= 0 ? '−' : '+'}
          {Math.abs(scenario.savings_per_100km).toFixed(2)} €
        </p>
      </div>
    </div>
  )
}
