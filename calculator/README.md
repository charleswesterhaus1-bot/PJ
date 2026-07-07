# Hangar & Harbor — Estimate Console

Internal pricing calculator for quoting automotive detailing jobs — current
launch stage is cars only (no yachts/aircraft yet). Not customer-facing.

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
2. **Vehicle Information** — Year/Make/Model/Color/Mileage/VIN/Plate, an
   **Interior Material** field (Leather / Leather & Alcantara / Alcantara /
   Other — an actual availability gate, not just a note: it's what decides
   whether Leather Conditioning is even offered), plus PPF/ceramic
   coating/matte paint/convertible top/carbon fiber flags (these don't
   change price, but drive "Technician Notes" shown on the estimate). Make +
   Model auto-classify the vehicle into a **Vehicle Class** — Sports Car /
   Supercar / Performance Truck / Hypercar (`src/utils/classifyVehicle.ts`)
   — every vehicle gets priced, there's no "unsupported" case. Vehicle Class
   doubles as the pricing dimension every service is keyed on and is always
   a dropdown-click away from override.
3. **Primary Service** — one of four services (Interior Detail, Exterior
   Detail, Full Detail, Paint Enhancement Detail), each with its exact
   "includes" checklist and the equipment used.
4. **Condition & Findings** — three plain dropdowns. Exterior Condition and
   Interior Condition each carry their own flat surcharge — one bucket
   covering all forms of contamination on that side of the vehicle (bugs,
   brake dust, road film, tar, tree sap, fallout, general soiling) rather
   than itemized charges. Paint Condition (only shown when Paint Enhancement
   Detail is selected) is a technician note only — it never changes price.
5. **Premium Upgrades** — only the upgrades valid for the selected service
   are shown; one already bundled into the package (e.g. Iron Removal / Clay
   Mitt Decontamination on Paint Enhancement Detail) is hidden rather than
   shown disabled, since it's redundant, not a choice. Leather Conditioning
   is additionally hidden unless Interior Material includes leather.
   Switching the service or the interior material automatically drops any
   selected upgrade that's no longer valid.
6. **Travel**, **Discount**, **Photo Documentation** (before/after/damage
   shots, compressed client-side and attached to the saved estimate).

The right-hand column shows the client-facing estimate — itemized pricing
with a "why" under every adjustment, labeled "Exotic Vehicle Handling &
Protection" for the classification line — plus a separate, staff-only
**Business Summary** (estimated labor hours, labor/material/travel cost,
gross profit, gross margin, revenue per labor hour, and a margin warning
below 45%). That panel is never part of print, PDF export, or the copied
estimate text; see "Print & PDF" below for how that separation is enforced
structurally, not just visually.

## Editing prices

Every number and word in the app — equipment, vehicle classes, condition
surcharges, service pricing/descriptions, add-ons, travel, discounts, and
labor/material assumptions — lives in one file:

```
src/config/pricingConfig.ts
```

Services are priced per vehicle class explicitly (`basePriceByClass: {
'sports-car', supercar, 'performance-truck', hypercar }`) rather than one
number × a multiplier, since real class pricing isn't a clean ratio across
every package — edit whichever class's number needs to change without
touching the others. The cheapest class (Sports Car) is the pricing baseline;
the "Exotic Vehicle Handling & Protection" line on the estimate is just the
delta between that baseline and the selected class's price for the chosen
service. A separate `multiplier` on each vehicle class scales labor hours and
material cost only (never price) to reflect the extra time/care a pricier
class actually takes. Edit any value and every screen updates automatically;
no pricing is hardcoded anywhere else in the app. Exterior/Interior/Paint
condition tiers and the vehicle classification rules (inside each
`vehicleTypes` entry) are similarly data-driven — add a tier or a new
recognized nameplate/keyword without touching any component code.

Premium Upgrades each carry an `availableForServiceIds` list — an upgrade is
hidden entirely (not just disabled) on any service where it's already
included, e.g. Iron Removal / Clay Mitt Decontamination on Paint Enhancement
Detail, which already bundles both. Leather Conditioning additionally sets
`requiresLeatherInterior: true`, gating it on `VehicleInfo.interiorMaterial`.

A note on the margin-warning threshold (`labor.marginWarningThreshold`,
45% by default): each service's `baseLaborHours` was calibrated so the
*undiscounted* baseline job clears that threshold with some headroom — the
warning is meant to catch a discount (or an unusually labor-heavy job)
eating into margin, not to fire on every normal job. If you change a
service's price or labor hours, it's worth sanity-checking the baseline
margin in the Business Summary still clears 45%.

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
