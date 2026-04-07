import type { BreakevenResult, ChargingScenario, ElectricityContext } from '../types'

/**
 * Adjust EV consumption for AC charging losses.
 * E.g. 17.4 kWh/100km motor + 10% loss = 19.3 kWh/100km from the grid.
 */
export function applyChargingLoss(
  ev_consumption_kwh_per_100km: number,
  loss_percent: number,
): number {
  return ev_consumption_kwh_per_100km / (1 - loss_percent / 100)
}

/**
 * Calculate the fuel cost per 100km in EUR.
 */
export function fuelCostPer100km(
  consumption_l_per_100km: number,
  price_eur_per_liter: number,
): number {
  return consumption_l_per_100km * price_eur_per_liter
}

/**
 * Calculate the electricity cost per 100km in EUR.
 */
export function evCostPer100km(
  grid_consumption_kwh_per_100km: number,
  price_ct_per_kwh: number,
): number {
  return grid_consumption_kwh_per_100km * (price_ct_per_kwh / 100)
}

/**
 * Calculate the breakeven electricity price in ct/kWh.
 * Below this price, EV driving is cheaper than fuel.
 *
 * Formula: (fuel_l_100km × price_eur_l) / grid_kwh_100km × 100
 */
export function calculateBreakeven(
  grid_consumption_kwh_per_100km: number,
  fuel_consumption_l_per_100km: number,
  fuel_price_eur_per_liter: number,
): number {
  const fuel_cost = fuelCostPer100km(fuel_consumption_l_per_100km, fuel_price_eur_per_liter)
  return (fuel_cost / grid_consumption_kwh_per_100km) * 100
}

/**
 * Build the full breakeven result including scenario comparisons.
 */
export function calculateBreakevenResult(
  ev_consumption_kwh_per_100km: number,
  fuel_consumption_l_per_100km: number,
  fuel_price_eur_per_liter: number,
  electricityContext: ElectricityContext,
  charging_loss_percent = 10,
): BreakevenResult {
  const grid_consumption = applyChargingLoss(ev_consumption_kwh_per_100km, charging_loss_percent)

  const breakeven = calculateBreakeven(
    grid_consumption,
    fuel_consumption_l_per_100km,
    fuel_price_eur_per_liter,
  )

  const fuel_cost = fuelCostPer100km(fuel_consumption_l_per_100km, fuel_price_eur_per_liter)

  const scenarioInputs: Array<{ label: string; price: number | null }> = [
    { label: 'Hausstrom', price: electricityContext.home_price_ct_kwh },
    { label: 'Öff. AC-Laden', price: electricityContext.public_ac_price_ct_kwh },
    { label: 'Öff. DC-Laden', price: electricityContext.public_dc_price_ct_kwh },
  ]

  const scenarios: ChargingScenario[] = scenarioInputs
    .filter((s): s is { label: string; price: number } => s.price !== null)
    .map((s) => {
      const cost = evCostPer100km(grid_consumption, s.price)
      return {
        label: s.label,
        price_ct_kwh: s.price,
        isBelow: s.price < breakeven,
        cost_per_100km: cost,
        savings_per_100km: fuel_cost - cost,
      }
    })

  return {
    breakeven_ct_kwh: breakeven,
    fuel_cost_per_100km: fuel_cost,
    grid_consumption_kwh_per_100km: grid_consumption,
    scenarios,
  }
}

/**
 * Calculate annual costs for a given scenario.
 *
 * @param ev_share_percent  0–100: how many % of km are driven electrically
 */
export function calculateAnnualCost(
  annual_km: number,
  ev_share_percent: number,
  ev_cost_per_100km: number,
  fuel_cost_per_100km: number,
): { fuel_cost_annual: number; ev_cost_annual: number; savings_annual: number } {
  const ev_km = annual_km * (ev_share_percent / 100)
  const fuel_km = annual_km * (1 - ev_share_percent / 100)

  const ev_cost_annual = (ev_km / 100) * ev_cost_per_100km
  const fuel_cost_annual = (fuel_km / 100) * fuel_cost_per_100km

  // Baseline: all km on fuel
  const pure_fuel_annual = (annual_km / 100) * fuel_cost_per_100km
  const mixed_annual = ev_cost_annual + fuel_cost_annual
  const savings_annual = pure_fuel_annual - mixed_annual

  return { fuel_cost_annual, ev_cost_annual, savings_annual }
}
