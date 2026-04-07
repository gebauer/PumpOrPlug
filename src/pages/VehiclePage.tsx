import { useNavigate } from 'react-router-dom'
import { VehicleSelector } from '../components/VehicleSelector'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useStore, selectEffectiveEvConsumption, selectEffectiveFuelConsumption } from '../store'

export function VehiclePage() {
  const navigate = useNavigate()
  const {
    selectedVehicle,
    setSelectedVehicle,
    evConsumptionOverride,
    setEvConsumptionOverride,
    fuelConsumptionOverride,
    setFuelConsumptionOverride,
  } = useStore()

  const effectiveEv = useStore(selectEffectiveEvConsumption)
  const effectiveFuel = useStore(selectEffectiveFuelConsumption)
  const canContinue = effectiveEv !== null && effectiveFuel !== null

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dein Fahrzeug</h1>
        <p className="mt-1 text-sm text-slate-400">Wähle dein PHEV aus der Datenbank oder gib Verbräuche manuell ein.</p>
      </div>

      <VehicleSelector selected={selectedVehicle} onSelect={setSelectedVehicle} />

      {selectedVehicle && (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Werte anpassen (optional)</p>
          <Input
            label="Stromverbrauch"
            type="number"
            step="0.1"
            min="5"
            max="50"
            unit="kWh/100km"
            placeholder={String(selectedVehicle.ev_consumption_kwh_per_100km)}
            value={evConsumptionOverride ?? ''}
            onChange={(e) =>
              setEvConsumptionOverride(e.target.value === '' ? null : Number(e.target.value))
            }
          />
          <Input
            label="Benzinverbrauch"
            type="number"
            step="0.1"
            min="1"
            max="30"
            unit="L/100km"
            placeholder={String(selectedVehicle.fuel_consumption_l_per_100km)}
            value={fuelConsumptionOverride ?? ''}
            onChange={(e) =>
              setFuelConsumptionOverride(e.target.value === '' ? null : Number(e.target.value))
            }
          />
        </div>
      )}

      <div className="rounded-xl bg-slate-800/50 p-4 ring-1 ring-slate-700">
        <p className="text-xs uppercase tracking-wide text-slate-500 mb-3">Oder manuell eingeben</p>
        <div className="space-y-3">
          <Input
            label="Stromverbrauch"
            type="number"
            step="0.1"
            min="5"
            max="50"
            unit="kWh/100km"
            placeholder="17.4"
            value={selectedVehicle ? '' : (evConsumptionOverride ?? '')}
            disabled={!!selectedVehicle}
            onChange={(e) =>
              setEvConsumptionOverride(e.target.value === '' ? null : Number(e.target.value))
            }
          />
          <Input
            label="Benzinverbrauch"
            type="number"
            step="0.1"
            min="1"
            max="30"
            unit="L/100km"
            placeholder="6.4"
            value={selectedVehicle ? '' : (fuelConsumptionOverride ?? '')}
            disabled={!!selectedVehicle}
            onChange={(e) =>
              setFuelConsumptionOverride(e.target.value === '' ? null : Number(e.target.value))
            }
          />
        </div>
        {selectedVehicle && (
          <button
            className="mt-2 text-xs text-slate-500 hover:text-slate-300"
            onClick={() => setSelectedVehicle(null)}
          >
            Fahrzeug entfernen → manuell eingeben
          </button>
        )}
      </div>

      <Button fullWidth disabled={!canContinue} onClick={() => navigate('/fuel')}>
        Weiter →
      </Button>
    </div>
  )
}
