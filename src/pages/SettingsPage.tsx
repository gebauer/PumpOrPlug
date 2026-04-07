import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Slider } from '../components/ui/Slider'
import { useStore } from '../store'

export function SettingsPage() {
  const navigate = useNavigate()
  const {
    tankerkoenigApiKey, setTankerkoenigApiKey,
    electricityContext, setElectricityContext,
    chargingLossPercent, setChargingLossPercent,
  } = useStore()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Einstellungen</h1>
        <p className="mt-1 text-sm text-slate-400">API-Key und Strompreise konfigurieren.</p>
      </div>

      {/* Tankerkönig */}
      <div className="rounded-xl bg-slate-800 p-5 ring-1 ring-slate-700 space-y-3">
        <div>
          <p className="font-semibold text-slate-200">Tankerkönig API-Key</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Für automatische Kraftstoffpreise in deiner Nähe.{' '}
            <span className="text-slate-500">Key wird nur lokal gespeichert.</span>
          </p>
        </div>
        <Input
          type="password"
          placeholder="Dein API-Key"
          value={tankerkoenigApiKey ?? ''}
          onChange={(e) => setTankerkoenigApiKey(e.target.value === '' ? null : e.target.value)}
        />
        <div className={`flex items-center gap-2 text-xs ${tankerkoenigApiKey ? 'text-green-400' : 'text-slate-500'}`}>
          <span>{tankerkoenigApiKey ? '✅ Key gespeichert' : '○ Kein Key – manueller Preiseingabe'}</span>
        </div>
        <p className="text-xs text-slate-500">
          Kostenlosen Key beantragen:{' '}
          <span className="text-slate-400">creativecommons.tankerkoenig.de</span>
        </p>
      </div>

      {/* Charging loss */}
      <div className="rounded-xl bg-slate-800 p-5 ring-1 ring-slate-700 space-y-3">
        <div>
          <p className="font-semibold text-slate-200">Ladeverlust</p>
          <p className="text-xs text-slate-400 mt-0.5">
            AC-Laden typisch 10–15 %. Erhöht den effektiven Netzverbrauch in der Berechnung.
          </p>
        </div>
        <Slider
          label="Ladeverlust"
          min={0}
          max={20}
          step={1}
          value={chargingLossPercent}
          onChange={setChargingLossPercent}
          formatValue={(v) => `${v} %`}
        />
      </div>

      {/* Electricity prices */}
      <div className="rounded-xl bg-slate-800 p-5 ring-1 ring-slate-700 space-y-3">
        <p className="font-semibold text-slate-200">Strompreise</p>
        <Input
          label="Hausstrom"
          type="number"
          step="0.1"
          min="1"
          max="200"
          unit="ct/kWh"
          value={electricityContext.home_price_ct_kwh ?? ''}
          onChange={(e) =>
            setElectricityContext({
              ...electricityContext,
              home_price_ct_kwh: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />
        <Input
          label="Öffentlich AC-Laden"
          type="number"
          step="0.1"
          min="1"
          max="200"
          unit="ct/kWh"
          value={electricityContext.public_ac_price_ct_kwh ?? ''}
          onChange={(e) =>
            setElectricityContext({
              ...electricityContext,
              public_ac_price_ct_kwh: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />
        <Input
          label="Öffentlich DC-Laden"
          type="number"
          step="0.1"
          min="1"
          max="200"
          unit="ct/kWh"
          value={electricityContext.public_dc_price_ct_kwh ?? ''}
          onChange={(e) =>
            setElectricityContext({
              ...electricityContext,
              public_dc_price_ct_kwh: e.target.value === '' ? null : Number(e.target.value),
            })
          }
        />
      </div>

      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Zurück
      </Button>
    </div>
  )
}
