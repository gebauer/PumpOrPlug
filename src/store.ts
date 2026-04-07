import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Vehicle, ElectricityContext } from './types'
import { DEFAULT_ELECTRICITY } from './data/default-prices'

interface StoreState {
  // Vehicle
  selectedVehicle: Vehicle | null
  evConsumptionOverride: number | null
  fuelConsumptionOverride: number | null
  setSelectedVehicle: (v: Vehicle | null) => void
  setEvConsumptionOverride: (v: number | null) => void
  setFuelConsumptionOverride: (v: number | null) => void

  // Fuel price
  fuelPriceEurPerLiter: number | null
  setFuelPriceEurPerLiter: (v: number | null) => void

  // Electricity
  electricityContext: ElectricityContext
  setElectricityContext: (v: ElectricityContext) => void

  // Settings
  tankerkoenigApiKey: string | null
  setTankerkoenigApiKey: (v: string | null) => void
  chargingLossPercent: number
  setChargingLossPercent: (v: number) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      selectedVehicle: null,
      evConsumptionOverride: null,
      fuelConsumptionOverride: null,
      setSelectedVehicle: (v) => set({ selectedVehicle: v }),
      setEvConsumptionOverride: (v) => set({ evConsumptionOverride: v }),
      setFuelConsumptionOverride: (v) => set({ fuelConsumptionOverride: v }),

      fuelPriceEurPerLiter: null,
      setFuelPriceEurPerLiter: (v) => set({ fuelPriceEurPerLiter: v }),

      electricityContext: DEFAULT_ELECTRICITY,
      setElectricityContext: (v) => set({ electricityContext: v }),

      tankerkoenigApiKey: null,
      setTankerkoenigApiKey: (v) => set({ tankerkoenigApiKey: v }),
      chargingLossPercent: 10,
      setChargingLossPercent: (v) => set({ chargingLossPercent: v }),
    }),
    {
      name: 'pumporplug-storage',
      // Don't persist the API key in a serialised form visible to devtools —
      // it already lives in localStorage via zustand/persist, which is fine,
      // but we keep it out of the serialised object for clarity.
    },
  ),
)

// Derived selectors
export const selectEffectiveEvConsumption = (s: StoreState) =>
  s.evConsumptionOverride ?? s.selectedVehicle?.ev_consumption_kwh_per_100km ?? null

export const selectEffectiveFuelConsumption = (s: StoreState) =>
  s.fuelConsumptionOverride ?? s.selectedVehicle?.fuel_consumption_l_per_100km ?? null
