# PumpOrPlug — project context

A fully client-side breakeven calculator for plug-in hybrids: at which electricity price
does driving electric become cheaper than driving on petrol? Part of the **xcience tools**
family (see [tools/index.html](../tools/index.html), alongside GridWright, Déjà Vu, Veem).

React 18 + TypeScript + Vite + Tailwind v4 + zustand, shipped as an installable PWA.
UI language is German; code, comments, and docs are English.

---

## Hard constraints

- **100 % client-side.** The only network call at runtime is the optional Tankerkönig
  fuel-price lookup, made directly from the browser with a user-supplied key. No backend,
  no analytics, no tracking.
- **Bring your own key.** The Tankerkönig API key lives in localStorage only. Never commit
  a key, never proxy it through a server we operate, never log it.
- **The calculation layer is UI-agnostic.** `src/lib/calculations.ts` is pure functions
  with no React and no DOM. All of it is unit-tested in `calculations.test.ts`. Any change
  to a formula needs a test that pins the new behaviour.
- **Node 20+.** The system `node` on this machine is an old v16 bundled with CCP4 and will
  fail the install. Use `export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"` first.

---

## Domain primer (so the maths doesn't drift)

A PHEV has two consumption figures. The one that matters for this comparison is the
**charge-sustaining** fuel consumption — what the car burns on petrol with an empty
battery — *not* the WLTP combined figure, which blends in electric driving and lands
around 1 L/100 km. If a vehicle entry ever shows a fuel figure near 1–2 L/100 km, it is
the wrong number.

Charging losses mean the grid supplies more energy than the motor consumes, so the grid
figure is `ev / (1 − loss)`, not `ev × (1 + loss)`. Higher loss means more kWh bought per
100 km, which *lowers* the breakeven price — each kWh has to be cheaper to still win.

Breakeven is `fuel_cost_per_100km / grid_kWh_per_100km × 100`, in ct/kWh.

`battery_capacity_kwh / electric_range_km` will often disagree with the stated
`ev_consumption_kwh_per_100km` because manufacturers quote gross capacity while the
consumption figure reflects usable energy. The stated consumption is authoritative; do not
"fix" the data to make the two agree.

---

## Conventions

- **Savings sign.** `savings_per_100km` and `savings_annual` are positive when electric is
  cheaper. Display them with explicit wording ("gespart" / "teurer") rather than a bare
  `+`/`−`, which readers interpret inconsistently.
- **Units in identifiers.** Every consumption, price, and cost variable carries its unit in
  the name (`_ct_kwh`, `_eur_per_liter`, `_l_per_100km`). Keep this — mixing ct and EUR
  silently is the easiest bug to introduce here.
- **Store shape.** `src/store.ts` is the single zustand store, persisted whole to
  localStorage under `pumporplug-storage`. Derived values are selectors on the store
  (`selectEffectiveEvConsumption`), not duplicated state.
- **Types live in `src/types/index.ts`** and are only added when used. Don't leave
  speculative interfaces behind.

## Brand and icons

The mark is a wall socket (nested rounded squares) enclosing a fuel droplet, whose two
blue dots read simultaneously as plug prongs — pump *and* plug in one glyph.

| Token | Value | Use |
| --- | --- | --- |
| Cream | `#F2F1EC` | Icon background, PWA splash |
| Ink | `#14161A` | Outlines |
| Blue | `#1157C7` | Accent dots, `theme_color` |

`public/` holds the full set, all generated from the same geometry — do not hand-edit one
without regenerating the rest:

- `favicon.svg` — simplified single-square version, for small sizes. Also used as the
  in-app header mark and as the tools-hub card icon.
- `icon.svg` — full double-square version, the canonical artwork.
- `icon-maskable.svg` — same, inset to 80 % for Android's safe zone; edge-to-edge fill,
  no rounded corners (the launcher applies its own mask).
- `icon-monochrome.svg` — flat black on transparent, for the manifest's `monochrome`
  purpose. Must stay single-colour.
- PNG raster set: `favicon-16/32`, `apple-touch-icon`, `icon-192`, `icon-512`,
  `icon-512-maskable`.

There is no SVG rasteriser installed on this machine, so the PNGs cannot be regenerated
here — they are produced externally and committed.

Note the app UI still uses a dark slate shell with a green (`#22c55e`) accent, which
predates this mark and does not match it. The manifest and `theme-color` follow the brand;
the in-app accent is the open question.

## Ecosystem integration

- Deployed at `pumporplug.xcience.net`, linked from the tools hub card in
  [tools/index.html](../tools/index.html) via `tools/pumporplug.svg` (a copy of
  `public/favicon.svg` — keep the two in sync).
- Unlike its siblings (GridWright, Déjà Vu, Veem), which use the shared
  `#1976D2 → #26A69A → #8BC34A` gradient line-art on transparent, PumpOrPlug has its own
  filled cream tile. This is deliberate; don't "correct" it back to the gradient.
- Ships the same Docker + nginx SPA pattern as its siblings; port via `${PORT:-8080}`.
