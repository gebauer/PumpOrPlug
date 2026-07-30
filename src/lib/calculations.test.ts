import { describe, it, expect } from 'vitest'
import {
  applyChargingLoss,
  fuelCostPer100km,
  evCostPer100km,
  calculateBreakeven,
  calculateBreakevenResult,
  calculateAnnualCost,
} from './calculations'

describe('applyChargingLoss', () => {
  it('0% loss returns unchanged consumption', () => {
    expect(applyChargingLoss(17.4, 0)).toBeCloseTo(17.4, 3)
  })

  it('10% loss increases grid consumption', () => {
    // 17.4 / 0.9 ≈ 19.33
    expect(applyChargingLoss(17.4, 10)).toBeCloseTo(19.33, 1)
  })

  it('higher loss → higher grid consumption', () => {
    expect(applyChargingLoss(17.4, 20)).toBeGreaterThan(applyChargingLoss(17.4, 10))
  })
})

describe('fuelCostPer100km', () => {
  it('calculates correctly', () => {
    expect(fuelCostPer100km(6.4, 1.72)).toBeCloseTo(11.008, 3)
  })
})

describe('evCostPer100km', () => {
  it('calculates correctly', () => {
    // 17.4 kWh × 32 ct = 556.8 ct = 5.568 EUR
    expect(evCostPer100km(17.4, 32)).toBeCloseTo(5.568, 3)
  })
})

describe('calculateBreakeven', () => {
  it('Golf GTE example without loss: 6.4 L, 1.72 EUR, 17.4 kWh → ~63.3 ct/kWh', () => {
    expect(calculateBreakeven(17.4, 6.4, 1.72)).toBeCloseTo(63.26, 1)
  })

  it('charging loss lowers breakeven (grid needs more kWh → each kWh must be cheaper)', () => {
    const noLoss = calculateBreakeven(17.4, 6.4, 1.72)
    const withLoss = calculateBreakeven(applyChargingLoss(17.4, 10), 6.4, 1.72)
    expect(withLoss).toBeLessThan(noLoss)
  })

  it('higher fuel price raises breakeven', () => {
    expect(calculateBreakeven(17.4, 6.4, 2.00)).toBeGreaterThan(calculateBreakeven(17.4, 6.4, 1.50))
  })
})

describe('calculateBreakevenResult', () => {
  it('marks scenarios correctly as below/above breakeven', () => {
    const result = calculateBreakevenResult(17.4, 6.4, 1.72, {
      home_price_ct_kwh: 32,
      public_ac_price_ct_kwh: 45,
      public_dc_price_ct_kwh: 79,
      source: 'test',
    }, 0)

    expect(result.breakeven_ct_kwh).toBeCloseTo(63.26, 1)
    expect(result.scenarios).toHaveLength(3)

    expect(result.scenarios.find((s) => s.label === 'Hausstrom')!.isBelow).toBe(true)
    expect(result.scenarios.find((s) => s.label === 'Öff. DC-Laden')!.isBelow).toBe(false)
  })

  it('exposes grid_consumption_kwh_per_100km', () => {
    const result = calculateBreakevenResult(17.4, 6.4, 1.72, {
      home_price_ct_kwh: 32, public_ac_price_ct_kwh: null, public_dc_price_ct_kwh: null, source: 'test',
    }, 10)
    expect(result.grid_consumption_kwh_per_100km).toBeCloseTo(19.33, 1)
  })

  it('skips null electricity scenarios', () => {
    const result = calculateBreakevenResult(17.4, 6.4, 1.72, {
      home_price_ct_kwh: 32,
      public_ac_price_ct_kwh: null,
      public_dc_price_ct_kwh: null,
      source: 'test',
    })
    expect(result.scenarios).toHaveLength(1)
  })
})

describe('savings sign convention', () => {
  it('savings_per_100km is positive when electricity is cheaper than fuel', () => {
    const result = calculateBreakevenResult(17.4, 6.4, 1.72, {
      home_price_ct_kwh: 32, public_ac_price_ct_kwh: null, public_dc_price_ct_kwh: null, source: 'test',
    }, 0)
    const home = result.scenarios[0]
    expect(home.cost_per_100km).toBeLessThan(result.fuel_cost_per_100km)
    expect(home.savings_per_100km).toBeGreaterThan(0)
  })

  it('savings_per_100km is negative when electricity is more expensive', () => {
    const result = calculateBreakevenResult(17.4, 6.4, 1.72, {
      home_price_ct_kwh: 90, public_ac_price_ct_kwh: null, public_dc_price_ct_kwh: null, source: 'test',
    }, 0)
    expect(result.scenarios[0].savings_per_100km).toBeLessThan(0)
  })

  it('scenario cost and savings are consistent with the fuel cost', () => {
    const result = calculateBreakevenResult(17.4, 6.4, 1.72, {
      home_price_ct_kwh: 32, public_ac_price_ct_kwh: 45, public_dc_price_ct_kwh: 79, source: 'test',
    }, 10)
    for (const s of result.scenarios) {
      expect(s.savings_per_100km).toBeCloseTo(result.fuel_cost_per_100km - s.cost_per_100km, 6)
    }
  })

  it('a scenario priced exactly at breakeven costs the same as fuel', () => {
    const result = calculateBreakevenResult(17.4, 6.4, 1.72, {
      home_price_ct_kwh: null, public_ac_price_ct_kwh: null, public_dc_price_ct_kwh: null, source: 'test',
    }, 10)
    const atBreakeven = evCostPer100km(
      result.grid_consumption_kwh_per_100km,
      result.breakeven_ct_kwh,
    )
    expect(atBreakeven).toBeCloseTo(result.fuel_cost_per_100km, 6)
  })
})

describe('calculateAnnualCost', () => {
  it('100% EV share means only EV costs', () => {
    const r = calculateAnnualCost(15000, 100, 5.57, 11.0)
    expect(r.fuel_cost_annual).toBeCloseTo(0, 1)
    expect(r.ev_cost_annual).toBeCloseTo((15000 / 100) * 5.57, 1)
  })

  it('0% EV share means only fuel costs', () => {
    const r = calculateAnnualCost(15000, 0, 5.57, 11.0)
    expect(r.ev_cost_annual).toBeCloseTo(0, 1)
    expect(r.savings_annual).toBeCloseTo(0, 1)
  })

  it('50/50 split yields positive savings when EV is cheaper', () => {
    const r = calculateAnnualCost(15000, 50, 5.57, 11.0)
    expect(r.savings_annual).toBeGreaterThan(0)
  })

  it('negative savings when EV is more expensive', () => {
    const r = calculateAnnualCost(15000, 50, 12.0, 11.0)
    expect(r.savings_annual).toBeLessThan(0)
  })

  it('savings equal the per-km cost delta over the electric share', () => {
    const r = calculateAnnualCost(20000, 60, 5.0, 11.0)
    // 60 % of 20 000 km = 12 000 km driven electrically, saving 6 EUR per 100 km
    expect(r.savings_annual).toBeCloseTo((12000 / 100) * (11.0 - 5.0), 6)
  })
})
