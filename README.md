# PumpOrPlug

Petrol or electricity for your plug-in hybrid?

PumpOrPlug computes the **breakeven electricity price** — the ct/kWh figure below which
driving on battery is cheaper than driving on fuel for your specific car. Enter (or pick)
your vehicle's two consumption figures, give it a fuel price, and it tells you which of
your charging options actually save money.

Everything runs in the browser. No backend, no accounts, no tracking. Installable as a PWA
and usable offline once loaded.

Part of [xcience tools](https://tools.xcience.net).

---

## The calculation

A plug-in hybrid has two consumption figures that matter:

- **Fuel consumption** in charge-sustaining mode (L/100 km) — what it burns once the
  battery is empty. This is *not* the headline WLTP combined figure, which mixes in
  electric driving and is optimistically low (often ~1 L/100 km).
- **Electric consumption** at the motor (kWh/100 km).

Charging is lossy, so the grid delivers more than the motor consumes:

```
grid_kWh_per_100km = ev_kWh_per_100km / (1 − loss / 100)
```

The default loss is 10 %, adjustable 0–20 % in settings. AC charging typically loses
10–15 % to the on-board charger, cable, and conditioning.

The breakeven price is where the two costs per 100 km are equal:

```
fuel_cost_per_100km  = fuel_L_per_100km × price_EUR_per_L
breakeven_ct_per_kWh = fuel_cost_per_100km / grid_kWh_per_100km × 100
```

Below that price, electric wins. The result page then compares your three configured
charging scenarios (home, public AC, public DC) against it and shows cost per 100 km and
savings for each, plus an annual projection for a chosen mileage and electric share.

**What is deliberately not modelled:** battery degradation, the extra weight a PHEV
carries, servicing differences, tariff base fees, blocking fees at public chargers, and
the purchase-price delta. This is an energy-cost comparison, not a total cost of
ownership calculation.

---

## Vehicle data

`src/data/vehicles.json` holds 20 German-market PHEVs with consumption figures sourced
from ADAC and manufacturer WLTP data. Where a manufacturer quotes gross battery capacity,
the implied consumption from `battery_capacity_kwh / electric_range_km` runs higher than
the stated `ev_consumption_kwh_per_100km` — the stated figure is the one used in all
calculations, and it is the correct one.

Any vehicle's figures can be overridden in the UI, and the whole database can be bypassed
by entering the two consumption values manually.

---

## Fuel prices

Prices can be typed in directly, or fetched from
[Tankerkönig](https://creativecommons.tankerkoenig.de/) using the browser's geolocation.
The app averages the **five cheapest** stations within a 5 km radius.

Tankerkönig requires a free API key. The app runs in "bring your own key" mode: the key
is entered in settings and stored only in the browser's localStorage — it never leaves the
device except in requests to Tankerkönig itself. Without a key, manual price entry works
fine and the rest of the app is unaffected.

The last successful lookup is cached, so an offline or failed request falls back to the
last known price with a staleness warning rather than an error.

---

## Development

Requires Node 20+ (the repo is built and tested against Node 24).

```bash
npm install
npm run dev      # vite dev server
npm test         # vitest — calculation unit tests
npm run build    # typecheck + production build to dist/
```

## Deployment

```bash
docker compose up -d --build
```

Serves the built SPA through nginx on `${PORT:-8080}`. The nginx config handles SPA route
fallback, keeps the service worker uncached, and caches hashed assets aggressively.
