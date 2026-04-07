import type { ElectricityContext, FuelPrices } from '../types'

// BDEW Haushaltsstrompreis Ø 2024: ~32 ct/kWh
// Öffentliche Ladesäulen: Durchschnittswerte Anbieter 2024
export const DEFAULT_ELECTRICITY: ElectricityContext = {
  home_price_ct_kwh: 32,
  public_ac_price_ct_kwh: 45,
  public_dc_price_ct_kwh: 55,
  source: 'BDEW / Anbieterdurchschnitt 2024',
}

// MTS-K Bundesdurchschnitt Super E10, Stand ca. Q1 2025
export const DEFAULT_FUEL_PRICES: FuelPrices = {
  super_e5: 1.82,
  super_e10: 1.75,
  super_plus: 1.95,
  diesel: 1.68,
  source: 'Schätzwert – bitte aktuellen Preis eingeben',
  timestamp: new Date().toISOString(),
}
