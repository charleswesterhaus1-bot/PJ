// ═══════════════════════════════════════════════════════════════════════
// VEHICLE INSPECTION CHECKLIST
// ═══════════════════════════════════════════════════════════════════════
// The questions asked during Step 3 (Vehicle Inspection). Each item is
// rated None / Light / Moderate / Heavy. This drives the recommendation
// engine (src/utils/recommendationEngine.ts) and the condition findings
// shown on the estimate — add or rename items here and both update
// automatically.
// ═══════════════════════════════════════════════════════════════════════

import type { InspectionConfig } from '../types'

export const inspectionConfig: InspectionConfig = {
  paint: [
    { id: 'swirls', label: 'Swirls' },
    { id: 'water-spots', label: 'Water Spots' },
    { id: 'bug-damage', label: 'Bug Damage' },
    { id: 'tar', label: 'Tar' },
    { id: 'tree-sap', label: 'Tree Sap' },
    { id: 'road-film', label: 'Road Film' },
    { id: 'oxidation', label: 'Oxidation' },
  ],
  wheels: [
    { id: 'brake-dust', label: 'Brake Dust / Iron Fallout' },
    { id: 'wheel-barrels', label: 'Wheel Barrel Contamination' },
    { id: 'tire-blooming', label: 'Tire Blooming' },
    { id: 'wheel-damage', label: 'Wheel Damage' },
  ],
  interior: [
    { id: 'leather', label: 'Leather Wear' },
    { id: 'alcantara', label: 'Alcantara Soiling' },
    { id: 'pet-hair', label: 'Pet Hair' },
    { id: 'smoke', label: 'Smoke Odor' },
    { id: 'sand', label: 'Sand' },
    { id: 'food', label: 'Food Residue' },
    { id: 'heavy-dirt', label: 'Heavy Dirt' },
    { id: 'stains', label: 'Stains' },
    { id: 'glass', label: 'Interior Glass Film' },
  ],
  engineBay: [{ id: 'engine-grime', label: 'Engine Bay Grime' }],
}

export function emptyInspectionState() {
  const zero = (items: { id: string }[]) => Object.fromEntries(items.map((i) => [i.id, 0])) as Record<string, 0>
  return {
    paint: zero(inspectionConfig.paint),
    wheels: zero(inspectionConfig.wheels),
    interior: zero(inspectionConfig.interior),
    engineBay: zero(inspectionConfig.engineBay),
  }
}
