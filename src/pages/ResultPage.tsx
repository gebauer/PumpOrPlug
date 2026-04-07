import { useNavigate } from 'react-router-dom'
import { useStore, selectEffectiveEvConsumption, selectEffectiveFuelConsumption } from '../store'
import { useBreakeven } from '../hooks/useBreakeven'
import { ScenarioCard } from '../components/ScenarioCard'
import { CostComparisonChart } from '../components/CostComparisonChart'
import { AnnualCostView } from '../components/AnnualCostView'
import { Button } from '../components/ui/Button'

export function ResultPage() {
  const navigate = useNavigate()
  const effectiveEv = useStore(selectEffectiveEvConsumption)
  const effectiveFuel = useStore(selectEffectiveFuelConsumption)
  const { fuelPriceEurPerLiter, electricityContext, selectedVehicle, chargingLossPercent } = useStore()

  const result = useBreakeven(effectiveEv, effectiveFuel, fuelPriceEurPerLiter, electricityContext, chargingLossPercent)

  if (!result) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-20">
        <p className="text-slate-400">Keine Daten – bitte zuerst Fahrzeug und Preis eingeben.</p>
        <Button onClick={() => navigate('/')}>Neu starten</Button>
      </div>
    )
  }

  const breakeven = result.breakeven_ct_kwh
  const allBelow = result.scenarios.every((s) => s.isBelow)
  const noneBelow = result.scenarios.every((s) => !s.isBelow)

  function handleShare() {
    const text =
      `PumpOrPlug: Mein Breakeven liegt bei ${breakeven.toFixed(1)} ct/kWh` +
      ` – darunter lohnt sich elektrisches Fahren! 🔌⚡\npumporplug.app`
    if (navigator.share) {
      navigator.share({ title: 'PumpOrPlug', text })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Ergebnis in die Zwischenablage kopiert.')
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Manuell eingegeben'}
          {chargingLossPercent > 0 && (
            <span className="ml-2 text-slate-600">· {chargingLossPercent} % Ladeverlust</span>
          )}
        </p>
        <h1 className="text-2xl font-bold text-slate-100 mt-1">Dein Breakeven</h1>
      </div>

      {/* Hero value */}
      <div className={`rounded-2xl p-6 text-center ring-1 ${
        allBelow
          ? 'bg-green-500/10 ring-green-500/30'
          : noneBelow
          ? 'bg-red-500/10 ring-red-500/30'
          : 'bg-slate-800 ring-slate-700'
      }`}>
        <p className="font-mono text-6xl font-bold text-slate-100">
          {breakeven.toFixed(1)}
        </p>
        <p className="mt-1 text-lg text-slate-300">ct/kWh</p>
        <p className="mt-3 text-sm text-slate-400 max-w-xs mx-auto">
          Unter diesem Strompreis ist elektrisches Fahren günstiger als Benzin.
        </p>
        <p className="mt-1 text-xs text-slate-600 font-mono">
          Netzverbrauch: {result.grid_consumption_kwh_per_100km.toFixed(1)} kWh/100km
        </p>
      </div>

      {/* Scenarios */}
      {result.scenarios.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">Ladepreisvergleich</p>
          {result.scenarios.map((s) => (
            <ScenarioCard key={s.label} scenario={s} />
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="rounded-xl bg-slate-800/50 p-4 ring-1 ring-slate-700">
        <CostComparisonChart result={result} />
      </div>

      {/* Annual cost */}
      <AnnualCostView result={result} />

      {/* Fuel cost reference */}
      <div className="text-sm text-slate-400 text-center">
        Benzin: {result.fuel_cost_per_100km.toFixed(2)} €/100km bei {fuelPriceEurPerLiter?.toFixed(3)} EUR/L
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate('/fuel')}>
          ← Zurück
        </Button>
        <Button variant="ghost" onClick={handleShare}>
          Teilen 📤
        </Button>
        <Button fullWidth onClick={() => navigate('/')}>
          Neu 🔄
        </Button>
      </div>
    </div>
  )
}
