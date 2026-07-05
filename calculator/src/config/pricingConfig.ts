// ═══════════════════════════════════════════════════════════════════════
// HANGAR & HARBOR — MASTER PRICING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════
//
// This is the ONLY file you should need to edit to change pricing, labor
// estimates, multipliers, equipment, or discounts anywhere in the app.
// Every screen reads from this file — nothing is hardcoded elsewhere.
//
// Automotive only, current launch stage. Every service/add-on below uses
// only equipment we actually own today (see `equipment`) — no ceramic
// coatings, no deep carpet extraction, nothing that needs gear we don't
// have yet. `future.yachts`/`future.aircraft` and the `features` flags are
// scaffolding for later — leave them disabled.
//
// Services are priced explicitly per vehicle size (Small/Medium/Large)
// rather than one base price × a multiplier — real size pricing isn't a
// clean ratio across every package, so each service carries its own
// `basePriceBySize` table. `chemicalCost` and the labor rate are
// internal-only figures used to compute the staff-facing profitability
// panel; they never appear on a client-facing estimate.
// ═══════════════════════════════════════════════════════════════════════

import type { PricingConfig } from '../types'

export const pricingConfig: PricingConfig = {
  company: {
    name: 'Hangar & Harbor',
    tagline: 'Premium Automotive Detailing — Estimate Console',
  },

  // ─────────────────────────────────────────────────────────────────────
  // EQUIPMENT — what we actually own today. This is the ground truth for
  // which services we can responsibly offer; see `equipmentUsed` on each
  // service/add-on below. A DI water system may be added soon but isn't
  // required for anything here yet.
  // ─────────────────────────────────────────────────────────────────────
  equipment: [
    {
      category: 'Pressure Washing',
      items: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Two-Bucket Wash System'],
    },
    {
      category: 'Wash Equipment',
      items: ['Premium Wash Mitts', 'Microfiber Towels', 'Chemical Guys Mr. Pink Soap'],
    },
    {
      category: 'Decontamination',
      items: ["Meguiar's Ultimate Iron Remover", 'Nanoskin AutoScrub Clay Mitt'],
    },
    {
      category: 'Machines & Polishing',
      items: ["Griot's Garage G9 Random Orbital Polisher", '3D One Compound/Polish', 'Lake Country Foam Pads'],
    },
    {
      category: 'Wheel & Glass Care',
      items: ['Wheel Cleaner', 'Tire Dressing', 'Glass Cleaner'],
    },
    {
      category: 'Interior Care',
      items: ['Interior Cleaners & Protectants', 'Leather Cleaner/Conditioner'],
    },
    {
      category: 'Engine Bay',
      items: ['Basic Engine Bay Cleaning Supplies'],
    },
  ],

  // A vehicle at or beyond this age classifies as Classic/Collector unless
  // its make/model already matches a higher-priority tier (see
  // utils/classifyVehicle.ts).
  classicVehicleAgeYears: 25,

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE CLASSIFICATION — Standard / Luxury / Performance / Supercar /
  // Classic. `classification` drives auto-detection from Make/Model/Year;
  // modelKeywords are checked first (across all tiers) and win over
  // `makes`, so e.g. a Porsche GT3 classifies Supercar even though
  // "Porsche" alone defaults to Luxury. `factors` are the plain-language
  // reasons printed on the estimate under "Exotic Vehicle Handling &
  // Protection".
  // ─────────────────────────────────────────────────────────────────────
  vehicleTypes: [
    {
      id: 'standard',
      label: 'Standard',
      multiplier: 1.0,
      description: 'Everyday sedans, hatchbacks, and mainstream vehicles',
      factors: ['Our baseline tier — no handling surcharge applied'],
      classification: {
        makes: ['toyota', 'honda', 'nissan', 'ford', 'chevrolet', 'hyundai', 'kia', 'mazda', 'subaru', 'volkswagen', 'vw', 'chrysler', 'dodge', 'jeep', 'ram', 'gmc', 'buick', 'mitsubishi', 'fiat', 'mini', 'smart'],
        modelKeywords: [],
      },
    },
    {
      id: 'luxury',
      label: 'Luxury',
      multiplier: 1.12,
      description: 'Luxury sedans, SUVs, and premium daily drivers',
      factors: ['Premium interior materials, additional trim, and larger touchpoints require careful handling'],
      classification: {
        makes: ['mercedes-benz', 'mercedes', 'bmw', 'audi', 'lexus', 'genesis', 'cadillac', 'land rover', 'range rover', 'jaguar', 'volvo', 'infiniti', 'porsche', 'maserati', 'aston martin', 'bentley', 'rolls-royce', 'acura'],
        modelKeywords: ['urus', 'purosangue', 'cullinan', 'bentayga', 'levante', 'ghibli', 'quattroporte', 'dbx'],
      },
    },
    {
      id: 'performance',
      label: 'Performance',
      multiplier: 1.18,
      description: 'Performance coupes, sport sedans, and enthusiast vehicles',
      factors: ['Performance wheel and brake designs, lowered stance, and aggressive aero need dedicated attention'],
      classification: {
        makes: [],
        modelKeywords: [
          'corvette', 'mustang gt', 'shelby', 'camaro ss', 'camaro zl1', 'hellcat', 'trackhawk', 'trx', 'raptor',
          'wrx', 'sti', 'type r', 'type-r', 'gr86', 'brz', 'gti', 'golf r', 'm2', 'm3', 'm4', 'm5', 'm8',
          'rs3', 'rs5', 'rs6', 'rs7', 'rsq8', 'amg', 'type s', 'type-s',
        ],
      },
    },
    {
      id: 'supercar',
      label: 'Supercar',
      multiplier: 1.4,
      description: 'Exotic supercars and hypercars',
      factors: [
        'Additional care required for low-clearance bodywork, delicate finishes, complex aero, carbon fiber, premium wheels, and high-value vehicle handling.',
      ],
      classification: {
        makes: ['ferrari', 'lamborghini', 'mclaren', 'bugatti', 'koenigsegg', 'pagani', 'rimac', 'czinger', 'lotus'],
        modelKeywords: [
          'laferrari', 'senna', 'p1', 'chiron', 'divo', 'valkyrie', '918 spyder', 'carrera gt', 'veneno', 'sian',
          'reventon', 'centodieci', 'mc20', 'gt3', 'gt2', 'turbo s', '911 gt', 'z06', 'zr1', 'gt-r', 'gtr',
          'amg gt', 'nsx', 'r8',
        ],
      },
    },
    {
      id: 'classic',
      label: 'Classic / Collector',
      multiplier: 1.3,
      description: 'Classic and collector vehicles',
      factors: ['Aged paint, trim, and materials require gentler products and extra handling care for collector value'],
      classification: {
        makes: [],
        modelKeywords: [],
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE SIZE — Small/Medium/Large. Pricing per size lives directly on
  // each service (`basePriceBySize`); the multiplier here only scales
  // labor hours and chemical cost, since those genuinely track with size.
  // ─────────────────────────────────────────────────────────────────────
  vehicleSizes: [
    { id: 'small', label: 'Small / Coupe', multiplier: 0.9, factors: ['Reduced surface area lowers wash and product time'] },
    { id: 'medium', label: 'Medium / Sedan / Sports Car', multiplier: 1.0, factors: [] },
    { id: 'large', label: 'Large / SUV / Truck', multiplier: 1.2, factors: ['Additional surface area and cabin volume extend labor time'] },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE CONDITION — auto-suggested from the inspection findings, but
  // always editable per job.
  // ─────────────────────────────────────────────────────────────────────
  conditions: [
    {
      id: 'excellent',
      label: 'Excellent',
      multiplier: 1.0,
      description: 'Minimal correction needed',
      factors: ['Presented in showroom-ready condition', 'No additional decontamination required'],
    },
    {
      id: 'light-dirt',
      label: 'Light Dirt',
      multiplier: 1.12,
      factors: ['Light surface dust and residue from regular driving', 'Standard wash chemistry sufficient'],
    },
    {
      id: 'moderate-dirt',
      label: 'Moderate Dirt',
      multiplier: 1.3,
      factors: ['Noticeable contamination requiring additional wash stages', 'Extra time for wheels, barrels, and trim'],
    },
    {
      id: 'heavy-contamination',
      label: 'Heavy Contamination',
      multiplier: 1.55,
      factors: ['Heavy road grime or extended time since last detail', 'Additional decontamination chemistry and labor required'],
    },
    {
      id: 'show-car-prep',
      label: 'Show Car Preparation',
      multiplier: 1.85,
      description: 'Concours-level finish',
      factors: ['Concours-level finish requested', 'Additional critical-eye inspection and correction pass', 'Extended labor for a flawless presentation'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // SERVICES — the primary package selected for the estimate.
  // ─────────────────────────────────────────────────────────────────────
  services: [
    {
      id: 'maintenance-wash',
      label: 'Premium Maintenance Wash',
      description:
        'Foam pre-soak, two-bucket hand wash, wheels and tires, exterior glass, and tire dressing, finished with a quick interior wipe-down/vacuum and a final inspection.',
      basePriceBySize: { small: 225, medium: 265, large: 325 },
      baseLaborHours: 1.25,
      chemicalCost: 22,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Two-Bucket Wash System', 'Premium Wash Mitts', 'Chemical Guys Mr. Pink Soap'],
    },
    {
      id: 'exterior-detail',
      label: 'Signature Exterior Detail',
      description:
        'Maintenance wash foundation plus a deep wheel clean, iron removal and clay mitt treatment as needed, bug/tar attention, exterior glass, and tire dressing. Paint sealant recommended to lock in the finish.',
      basePriceBySize: { small: 350, medium: 425, large: 525 },
      baseLaborHours: 2.0,
      chemicalCost: 42,
      equipmentUsed: ["Meguiar's Ultimate Iron Remover", 'Nanoskin AutoScrub Clay Mitt', 'Wheel Cleaner', 'Tire Dressing', 'Glass Cleaner'],
    },
    {
      id: 'interior-detail',
      label: 'Signature Interior Detail',
      description:
        'Full vacuum and wipe-down, leather and plastic cleaning, interior glass, vents and crevices, door jambs, and attention to light stains. Leather conditioning recommended for leather-equipped cabins.',
      basePriceBySize: { small: 275, medium: 350, large: 450 },
      baseLaborHours: 1.65,
      chemicalCost: 32,
      equipmentUsed: ['Interior Cleaners & Protectants', 'Leather Cleaner/Conditioner', 'Glass Cleaner'],
    },
    {
      id: 'full-detail',
      label: 'Signature Full Detail',
      description: 'Our Signature Exterior Detail and Signature Interior Detail combined — the complete Hangar & Harbor experience, inside and out.',
      basePriceBySize: { small: 575, medium: 700, large: 875 },
      baseLaborHours: 3.25,
      chemicalCost: 70,
      equipmentUsed: ['Two-Bucket Wash System', "Meguiar's Ultimate Iron Remover", 'Nanoskin AutoScrub Clay Mitt', 'Interior Cleaners & Protectants', 'Leather Cleaner/Conditioner'],
    },
    {
      id: 'paint-enhancement',
      label: 'Paint Enhancement Detail',
      description:
        "Wash and chemical/mechanical decontamination, followed by a one-step machine polish using the Griot's G9, 3D One compound, and Lake Country pads. Paint sealant included to protect the finish, with a final inspection.",
      basePriceBySize: { small: 650, medium: 800, large: 1000 },
      baseLaborHours: 3.75,
      chemicalCost: 95,
      equipmentUsed: ["Griot's Garage G9 Random Orbital Polisher", '3D One Compound/Polish', 'Lake Country Foam Pads', 'Nanoskin AutoScrub Clay Mitt'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // ADD-ONS — flat-priced extras layered on top of the primary service.
  // ─────────────────────────────────────────────────────────────────────
  addOns: [
    { id: 'engine-bay', label: 'Engine Bay Detail', price: 150, laborHours: 1.25, chemicalCost: 15, equipmentUsed: ['Basic Engine Bay Cleaning Supplies'] },
    {
      id: 'ext-decon-package',
      label: 'Exterior Decontamination Package',
      description: 'Includes iron removal and clay mitt treatment',
      price: 225,
      laborHours: 1.75,
      chemicalCost: 20,
      equipmentUsed: ["Meguiar's Ultimate Iron Remover", 'Nanoskin AutoScrub Clay Mitt'],
    },
    { id: 'iron-removal', label: 'Iron Removal Only', price: 110, laborHours: 0.75, chemicalCost: 12, equipmentUsed: ["Meguiar's Ultimate Iron Remover"] },
    { id: 'clay-decon', label: 'Clay Decontamination Only', price: 145, laborHours: 1, chemicalCost: 10, equipmentUsed: ['Nanoskin AutoScrub Clay Mitt'] },
    { id: 'leather-conditioning', label: 'Leather Conditioning', price: 125, laborHours: 0.75, chemicalCost: 10, equipmentUsed: ['Leather Cleaner/Conditioner'] },
    { id: 'pet-hair-removal', label: 'Pet Hair Removal', price: 155, laborHours: 1, chemicalCost: 6, equipmentUsed: ['Interior Cleaners & Protectants'] },
    { id: 'odor-treatment', label: 'Odor Treatment', price: 175, laborHours: 1, chemicalCost: 15, equipmentUsed: ['Interior Cleaners & Protectants'] },
    { id: 'glass-sealant', label: 'Glass Sealant', price: 110, laborHours: 0.5, chemicalCost: 9, equipmentUsed: ['Glass Cleaner'] },
    { id: 'interior-protectant', label: 'Interior Protectant', price: 135, laborHours: 0.75, chemicalCost: 10, equipmentUsed: ['Interior Cleaners & Protectants'] },
    { id: 'paint-sealant', label: 'Paint Sealant', price: 250, laborHours: 1.25, chemicalCost: 35, equipmentUsed: ['3D One Compound/Polish', 'Lake Country Foam Pads'] },
    { id: 'trim-restoration', label: 'Trim Restoration', price: 185, laborHours: 1, chemicalCost: 11, equipmentUsed: ['Interior Cleaners & Protectants'] },
    { id: 'headlight-restoration', label: 'Headlight Restoration', price: 125, laborHours: 1, chemicalCost: 10, equipmentUsed: ["Griot's Garage G9 Random Orbital Polisher", '3D One Compound/Polish'] },
    { id: 'wheel-sealant', label: 'Wheel Sealant', price: 175, laborHours: 1.25, chemicalCost: 18, equipmentUsed: ['Wheel Cleaner'] },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // TRAVEL — miles included at no charge, then a per-mile rate beyond that.
  // ─────────────────────────────────────────────────────────────────────
  travel: {
    freeMiles: 15,
    pricePerMile: 4.25,
  },

  // ─────────────────────────────────────────────────────────────────────
  // DISCOUNTS — percentage off the subtotal. "Custom %" uses the value
  // typed into the calculator rather than a fixed number here.
  // ─────────────────────────────────────────────────────────────────────
  discounts: [
    { id: 'military', label: 'Military', percentage: 0.1 },
    { id: 'repeatClient', label: 'Repeat Client', percentage: 0.05 },
    { id: 'referral', label: 'Referral', percentage: 0.05 },
    { id: 'portfolioVehicle', label: 'Portfolio Vehicle', percentage: 0.15, description: 'Client allows use of photos/video for marketing' },
    { id: 'custom', label: 'Custom %', percentage: 0 },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // LABOR — internal cost rates plus rules for suggested crew size,
  // appointment-length rounding, and the staff-only margin warning. Never
  // shown to clients.
  // ─────────────────────────────────────────────────────────────────────
  labor: {
    ratePerHour: 85,
    teamSizeThresholds: [
      { maxLaborHours: 4, teamSize: 1, label: 'Solo Detailer' },
      { maxLaborHours: 9, teamSize: 2, label: 'Two-Person Team' },
      { maxLaborHours: 16, teamSize: 3, label: 'Three-Person Team' },
      { maxLaborHours: Infinity, teamSize: 4, label: 'Full Crew (4+)' },
    ],
    appointmentRoundingHours: 0.25,
    travelCostPerMile: 0.67,
    marginWarningThreshold: 0.45,
  },

  // ─────────────────────────────────────────────────────────────────────
  // FUTURE EXPANSION — scaffolding only. Automotive-only for this launch
  // stage; both stay hidden until `enabled` is flipped to `true` and real
  // pricing is filled in.
  // ─────────────────────────────────────────────────────────────────────
  future: {
    yachts: {
      enabled: false,
      label: 'Luxury Yacht Detailing',
      services: [],
      addOns: [],
    },
    aircraft: {
      enabled: false,
      label: 'Private Aircraft Detailing',
      services: [],
      addOns: [],
    },
  },

  // ─────────────────────────────────────────────────────────────────────
  // FEATURE FLAGS — other modules on the roadmap. All off. Flip one on
  // and build its page/nav entry once that capability actually exists;
  // see Header.tsx's `NAV_ITEMS` for how new pages get wired in.
  // ─────────────────────────────────────────────────────────────────────
  features: {
    yachts: false,
    aircraft: false,
    ceramicCoatings: false,
    maintenanceMemberships: false,
    fleetAccounts: false,
    crm: false,
    scheduling: false,
    invoicing: false,
    payments: false,
    employeeAccounts: false,
    analytics: false,
  },
}
