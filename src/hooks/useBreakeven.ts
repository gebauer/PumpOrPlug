import { useMemo } from 'react'
import { calculateBreakevenResult } from '../lib/calculations'
import type { BreakevenResult, ElectricityContext } from '../types'

export function useBreakeven(
  ev_consumption_kwh_per_100km: number | null,
  fuel_consumption_l_per_100km: number | null,
  fuel_price_eur_per_liter: number | null,
  electricityContext: ElectricityContext,
  charging_loss_percent: number,
): BreakevenResult | null {
  return useMemo(() => {
    if (
      ev_consumption_kwh_per_100km === null ||
      fuel_consumption_l_per_100km === null ||
      fuel_price_eur_per_liter === null ||
      ev_consumption_kwh_per_100km <= 0 ||
      fuel_consumption_l_per_100km <= 0 ||
      fuel_price_eur_per_liter <= 0
    ) {
      return null
    }
    return calculateBreakevenResult(
      ev_consumption_kwh_per_100km,
      fuel_consumption_l_per_100km,
      fuel_price_eur_per_liter,
      electricityContext,
      charging_loss_percent,
    )
  }, [ev_consumption_kwh_per_100km, fuel_consumption_l_per_100km, fuel_price_eur_per_liter, electricityContext, charging_loss_percent])
}
