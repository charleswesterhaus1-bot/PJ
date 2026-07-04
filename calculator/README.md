# Hangar & Harbor — Estimate Console

Internal pricing calculator for quoting exotic and high-performance vehicle
detailing jobs. Not customer-facing.

## Running it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Editing prices

Every number in the app — service prices, vehicle type/size/condition
multipliers, add-on pricing, travel rates, discount percentages, labor rate,
and team-size thresholds — lives in one file:

```
src/config/pricingConfig.ts
```

Edit values there and every screen updates automatically. No pricing is
hardcoded anywhere else in the app.

## Adding yachts or private aviation later

`pricingConfig.ts` already has a `future.yachts` and `future.aircraft`
section (both `enabled: false`, both empty). When you're ready to launch
either line:

1. Fill in `services` and `addOns` the same way the detailing ones are built.
2. Flip `enabled` to `true`.
3. Add a vehicle-domain switcher to the calculator UI (a new step at the top
   that picks Automotive / Marine / Aviation) and branch `services`/`addOns`
   off the selected domain instead of always reading `pricingConfig.services`.

The types, calculation engine, and storage layer already support arbitrary
service/add-on lists, so this is additive — no rebuild required.

## Data & storage

Saved estimates and the running estimate-number counter live in the
browser's `localStorage`, scoped to whoever is using that browser/device.
There is no backend.

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion + lucide-react.
PDF export uses `jspdf` + `html2canvas`, lazy-loaded on first use.
