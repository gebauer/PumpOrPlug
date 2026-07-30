export type FuelType = 'super_e5' | 'super_e10' | 'super_plus' | 'diesel'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  variant: string
  ev_consumption_kwh_per_100km: number
  battery_capacity_kwh: number
  electric_range_km: number
  fuel_consumption_l_per_100km: number
  fuel_type: FuelType
  source: string
  wltp: boolean
}

export interface FuelPrices {
  super_e5: number
  super_e10: number
  super_plus: number
  diesel: number
  source: string
  timestamp: string
  location?: {
    lat: number
    lng: number
    radius_km: number
  }
}

export interface ElectricityContext {
  home_price_ct_kwh: number | null
  public_ac_price_ct_kwh: number | null
  public_dc_price_ct_kwh: number | null
  source: string
}

export interface ChargingScenario {
  label: string
  price_ct_kwh: number
  isBelow: boolean
  cost_per_100km: number
  savings_per_100km: number
}

export interface BreakevenResult {
  breakeven_ct_kwh: number
  fuel_cost_per_100km: number
  /** EV consumption from the grid (after charging loss) used in all calculations */
  grid_consumption_kwh_per_100km: number
  scenarios: ChargingScenario[]
}

