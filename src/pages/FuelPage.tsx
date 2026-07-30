import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useStore } from '../store'
import { useFuelPrice } from '../hooks/useFuelPrice'
import { DEFAULT_FUEL_PRICES } from '../data/default-prices'

const FUEL_LABEL: Record<string, string> = {
  super_e5: 'Super E5',
  super_e10: 'Super E10',
  super_plus: 'Super Plus',
  diesel: 'Diesel',
}

export function FuelPage() {
  const navigate = useNavigate()
  const { fuelPriceEurPerLiter, setFuelPriceEurPerLiter, selectedVehicle, tankerkoenigApiKey } = useStore()

  const fuelType = selectedVehicle?.fuel_type ?? 'super_e10'
  const label = FUEL_LABEL[fuelType]
  const defaultPrice = DEFAULT_FUEL_PRICES[fuelType as keyof typeof DEFAULT_FUEL_PRICES] as number

  const { status, fetchPrice } = useFuelPrice(tankerkoenigApiKey, fuelType)

  // Auto-fill price when API returns a result
  useEffect(() => {
    if (status.state === 'success') {
      setFuelPriceEurPerLiter(parseFloat(status.price.toFixed(3)))
    }
  }, [status, setFuelPriceEurPerLiter])

  const isLoading = status.state === 'locating' || status.state === 'fetching'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Kraftstoffpreis</h1>
        <p className="mt-1 text-sm text-slate-400">
          Gib den aktuellen {label}-Preis ein.
        </p>
      </div>

      {/* Price input */}
      <div className="rounded-xl bg-slate-800 p-5 ring-1 ring-slate-700 space-y-3">
        <Input
          label={`${label} Preis`}
          type="number"
          step="0.001"
          min="0.5"
          max="4"
          unit="EUR/L"
          placeholder={String(defaultPrice)}
          value={fuelPriceEurPerLiter ?? ''}
          onChange={(e) =>
            setFuelPriceEurPerLiter(e.target.value === '' ? null : Number(e.target.value))
          }
          autoFocus
        />

        {/* Stale cache indicator */}
        {status.state === 'success' && status.isStale && (
          <p className="text-xs text-amber-400">
            ⚠️ Offline – letzter bekannter Preis vom{' '}
            {new Date(status.timestamp).toLocaleString('de-DE', {
              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        )}

        {/* Fresh API result */}
        {status.state === 'success' && !status.isStale && (
          <p className="text-xs text-green-400">
            📍 Ø der {status.stationCount} günstigsten Tankstellen im Umkreis · Stand{' '}
            {new Date(status.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}

        {/* Error */}
        {status.state === 'error' && (
          <p className="text-xs text-red-400">{status.message}</p>
        )}

        {/* Loading states */}
        {status.state === 'locating' && (
          <p className="text-xs text-slate-400 animate-pulse">📍 Standort wird ermittelt …</p>
        )}
        {status.state === 'fetching' && (
          <p className="text-xs text-slate-400 animate-pulse">⛽ Preise werden geladen …</p>
        )}
      </div>

      {/* Geo fetch button */}
      <Button
        variant="secondary"
        fullWidth
        onClick={fetchPrice}
        disabled={isLoading}
      >
        {isLoading ? '…' : tankerkoenigApiKey ? '📍 Preis in meiner Nähe laden' : '📍 Standort nutzen (API-Key nötig)'}
      </Button>

      {!tankerkoenigApiKey && (
        <p className="text-center text-xs text-slate-500">
          Kein API-Key?{' '}
          <button
            className="text-green-400 underline underline-offset-2"
            onClick={() => navigate('/settings')}
          >
            Einstellungen →
          </button>
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate('/')}>
          ← Zurück
        </Button>
        <Button
          fullWidth
          disabled={fuelPriceEurPerLiter === null}
          onClick={() => navigate('/result')}
        >
          Berechnen
        </Button>
      </div>
    </div>
  )
}
