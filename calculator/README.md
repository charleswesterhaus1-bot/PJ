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

Prefer not to run a server at all? `npm run build:portable` produces a single
self-contained `dist-portable/index.html` (JS and CSS inlined) that opens
directly by double-clicking — no install, no server. Handy for sending to a
teammate, but the regular `npm run dev`/`build` workflow above is the one to
use day-to-day.

## How an estimate gets built

1. **Client Information** — search the saved client database by name, phone,
   or email; picking a match pre-fills their info and shows their previous
   vehicles/estimates. New clients save automatically the first time you
   save an estimate.
2. **Vehicle Information** — Year/Make/Model/Color/Mileage/VIN/Plate. Make +
   Model auto-classify the vehicle into Hypercar / Supercar / Exotic /
   High-End Sports Car (`src/utils/classifyVehicle.ts`); a nameplate outside
   our specialization (SUVs, sedans, daily drivers) shows a warning instead
   of guessing. Classification is always a dropdown-click away from override.
3. **Vehicle Inspection** — rate paint/wheel/interior/engine-bay findings
   None → Light → Moderate → Heavy. This is the input to
   `src/utils/recommendationEngine.ts`, which suggests a primary service, an
   overall condition tier, and specific add-ons (each with a plain-language
   reason), and flags anything outside detailing's scope (e.g. existing
   wheel damage) as a caution rather than a bogus recommendation.
4. **Service & Condition**, **Add-Ons** — the suggestions from Step 3 show up
   as a "Recommended" banner/badges here; accepting one is still an explicit
   click since it changes the price.
5. **Travel**, **Discount**, **Photo Documentation** (before/after/damage
   shots, compressed client-side and attached to the saved estimate).

The right-hand column shows the client-facing estimate — itemized pricing
with a "why" under every adjustment, pulled straight from the inspection
findings — plus a separate, staff-only **Profitability Panel** (labor hours,
crew size, labor/chemical cost, gross profit, margin). That panel is never
part of print, PDF export, or the copied estimate text; see "Print & PDF"
below for how that separation is enforced structurally, not just visually.

## Editing prices

Every number in the app — service prices, vehicle type/size/condition
multipliers, add-on pricing, travel rates, discount percentages, labor rate,
chemical costs, and team-size thresholds — lives in one file:

```
src/config/pricingConfig.ts
```

Edit values there and every screen updates automatically. No pricing is
hardcoded anywhere else in the app. The inspection checklist itself
(`src/config/inspectionConfig.ts`) and the vehicle classification rules
(inside each `vehicleTypes` entry in `pricingConfig.ts`) are similarly
data-driven — add a checklist item or a new recognized nameplate without
touching any component code.

## Print & PDF

`window.print()` output and the "Export PDF" button both render from a
completely separate, light-themed component (`PrintableEstimate.tsx`) that
never receives the profitability data in the first place — it's not just
hidden with CSS. The print version is portaled into `#print-root`, a sibling
of `#root` in `index.html`, specifically so it isn't nested inside the app's
animated components (a CSS `transform` on any ancestor creates a new
containing block, which silently breaks `position: fixed/absolute`
print-only overlays — portaling out of the tree avoids that class of bug
entirely). PDF export builds a native jsPDF document from the same data
rather than rasterizing the DOM, which is both more reliable and produces a
much smaller file.

## Adding yachts or private aviation later

`pricingConfig.ts` already has a `future.yachts` and `future.aircraft`
section (both `enabled: false`, both empty), plus a `features` flag object
for other planned modules (ceramic coatings, memberships, fleet accounts,
CRM, scheduling, invoicing, payments, employee accounts, analytics) — all
off. When you're ready to launch a vehicle domain:

1. Fill in `services` and `addOns` the same way the detailing ones are built.
2. Flip `enabled` to `true`.
3. Add a domain switcher to the calculator UI (a step at the top that picks
   Automotive / Marine / Aviation) and branch `services`/`addOns` off the
   selected domain instead of always reading `pricingConfig.services`.

The types, calculation engine, and storage layer already support arbitrary
service/add-on lists, so this is additive — no rebuild required. The header
nav (`Header.tsx`'s `NAV_ITEMS` array) is similarly data-driven for adding a
new top-level page (Scheduling, CRM, etc.) later.

## Data & storage

Saved estimates, the client database, and the running estimate-number
counter all live in the browser's `localStorage`, scoped to whoever is using
that browser/device. There is no backend. Photos are compressed client-side
before storage — see `src/utils/photo.ts` — since they're the fastest way to
run into the browser's storage quota.

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + Framer Motion + lucide-react.
PDF export uses `jspdf` directly (no DOM rasterization), lazy-loaded on first
use.
