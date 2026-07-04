// ═══════════════════════════════════════════════════════════════════════
// HANGAR & HARBOR — MASTER PRICING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════
//
// This is the ONLY file you should need to edit to change pricing, labor
// estimates, multipliers, equipment, or discounts anywhere in the app.
// Every screen reads from this file — nothing is hardcoded elsewhere.
//
// Pricing philosophy: base prices below are the "High-End Sports Car,
// Medium size, Excellent condition" price — our floor. Every other
// vehicle type, size, and condition multiplies up from there. We are a
// premium specialist, not a volume shop — these numbers assume healthy
// margin over labor + product cost, not a race to the bottom.
//
// `chemicalCost` and the labor rate are internal-only figures used to
// compute the staff-facing profitability panel. They never appear on a
// client-facing estimate.
//
// Multipliers work like this: 1.0 = no change, 1.25 = +25%, 0.9 = -10%.
//
// The `future` section holds pricing scaffolding for yachts and private
// aviation, and `features` flags other modules we've planned but not
// built (scheduling, invoicing, CRM, etc). All disabled — flip them on
// and wire up a page once that line of business actually exists.
// ═══════════════════════════════════════════════════════════════════════

import type { PricingConfig } from '../types'

export const pricingConfig: PricingConfig = {
  company: {
    name: 'Hangar & Harbor',
    tagline: 'Exotic & High-Performance Vehicle Detailing — Estimate Console',
  },

  // ─────────────────────────────────────────────────────────────────────
  // EQUIPMENT — what we actually own today. This is the ground truth for
  // which services we can responsibly offer; see `equipmentUsed` on each
  // service/add-on below.
  // ─────────────────────────────────────────────────────────────────────
  equipment: [
    {
      category: 'Pressure Washing',
      items: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Two-Bucket Wash System', 'Grit Guards'],
    },
    {
      category: 'Wash Equipment',
      items: ['Premium Wash Mitts', 'Clay Mitt (Nanoskin)', 'Drying Towels', 'Applicator Pads', 'Spray Bottles'],
    },
    {
      category: 'Wheel Equipment',
      items: ['Wheel Brushes', 'Tire Brushes', 'Lug Nut Brushes', 'Barrel Brushes'],
    },
    {
      category: 'Machines',
      items: ['Maxshine Dual Action Polisher'],
    },
    {
      category: 'Interior Equipment',
      items: ['Shop Vacuum', 'Steam Cleaner'],
    },
    {
      category: 'Products',
      items: [
        'P&S Xpress Interior Cleaner',
        'Brake Buster',
        'CarPro PERL',
        'Leather Honey',
        'Invisible Glass',
        'Plastic Cleaner',
        '3D One Compound/Polish',
        'Iron Remover',
        'Mr Pink Soap',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE TYPE — the class of exotic/performance vehicle being serviced.
  // `classification` drives auto-detection from Make/Model: modelKeywords
  // are checked first (across all tiers) and win over `makes`, so a
  // Porsche 918 Spyder classifies as a Hypercar even though Porsche
  // otherwise requires a specific nameplate match to classify at all.
  // `factors` are the plain-language reasons printed on the estimate.
  // ─────────────────────────────────────────────────────────────────────
  vehicleTypes: [
    {
      id: 'hypercar',
      label: 'Hypercar',
      multiplier: 1.6,
      description: 'Bugatti, Koenigsegg, Pagani, and other million-dollar limited-production machines',
      factors: [
        'Extremely low ground clearance requiring lift-assisted access',
        'Exposed carbon fiber and specialty finishes',
        'Limited parts and product-compatibility research required',
        'Highest handling liability and insurance exposure on site',
      ],
      classification: {
        makes: ['bugatti', 'koenigsegg', 'pagani', 'rimac', 'czinger'],
        modelKeywords: [
          'laferrari',
          'senna',
          'p1',
          'chiron',
          'divo',
          'valkyrie',
          '918 spyder',
          'carrera gt',
          'veneno',
          'sian',
          'reventon',
          'centodieci',
        ],
      },
    },
    {
      id: 'supercar',
      label: 'Supercar',
      multiplier: 1.4,
      description: 'Ferrari, Lamborghini, and McLaren — the benchmark of exotic performance',
      factors: [
        'Wide-body fitment and low front splitters demand careful product handling',
        'Complex aerodynamic surfaces and multiple air intakes',
        'Premium wheel and brake designs need dedicated detailing time',
      ],
      classification: {
        makes: ['ferrari', 'lamborghini', 'mclaren'],
        modelKeywords: [],
      },
    },
    {
      id: 'exotic',
      label: 'Exotic Car',
      multiplier: 1.25,
      description: 'Aston Martin, Bentley, Maserati, and other coach-built exotics',
      factors: [
        'Bespoke leather, veneer, and trim requiring specialized product knowledge',
        'Larger GT proportions increase surface area and wipe-down time',
        'Hand-finished coach-built details add handling care',
      ],
      classification: {
        makes: ['aston martin', 'bentley', 'maserati', 'lotus'],
        modelKeywords: ['mc20'],
      },
    },
    {
      id: 'sports',
      label: 'High-End Sports Car',
      multiplier: 1.0,
      description: 'Porsche GT cars, Audi R8, AMG GT, Corvette Z06/ZR1, and Nissan GT-R',
      factors: ['Our baseline specialization tier — full attention to detail, no complexity surcharge'],
      classification: {
        makes: [],
        modelKeywords: ['gt3', 'gt2', 'turbo s', '911 gt', 'corvette', 'z06', 'zr1', 'gt-r', 'gtr', 'r8', 'amg gt', 'nsx'],
      },
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE SIZE — scales labor/product needs relative to a mid-size car.
  // ─────────────────────────────────────────────────────────────────────
  vehicleSizes: [
    { id: 'small', label: 'Small', multiplier: 0.92, factors: ['Reduced surface area lowers wash and product time'] },
    { id: 'medium', label: 'Medium', multiplier: 1.0, factors: [] },
    { id: 'large', label: 'Large', multiplier: 1.18, factors: ['Additional surface area extends wash and drying time'] },
    {
      id: 'xl',
      label: 'Extra Large',
      multiplier: 1.35,
      factors: ['Significant surface area and cabin volume increase labor time'],
    },
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
  // SERVICES — the primary package selected for the estimate. Prices are
  // the High-End Sports Car / Medium / Excellent baseline described above.
  // ─────────────────────────────────────────────────────────────────────
  services: [
    {
      id: 'maintenance-wash',
      label: 'Premium Maintenance Wash',
      description: 'Two-bucket hand wash with foam pre-soak, wheels, tires, and a quick detail finish',
      basePrice: 265,
      baseLaborHours: 1.75,
      chemicalCost: 18,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Two-Bucket Wash System', 'Premium Wash Mitts', 'Mr Pink Soap'],
    },
    {
      id: 'exterior-detail',
      label: 'Premium Exterior Detail',
      description: 'Full exterior decontamination, hand wash, and a protective dressing pass',
      basePrice: 525,
      baseLaborHours: 3.5,
      chemicalCost: 35,
      equipmentUsed: ['Two-Bucket Wash System', 'Clay Mitt (Nanoskin)', 'CarPro PERL', 'Wheel Brushes', 'Barrel Brushes'],
    },
    {
      id: 'interior-detail',
      label: 'Premium Interior Detail',
      description: 'Full interior deep clean with leather, trim, and glass care',
      basePrice: 495,
      baseLaborHours: 3.5,
      chemicalCost: 32,
      equipmentUsed: ['Shop Vacuum', 'Steam Cleaner', 'P&S Xpress Interior Cleaner', 'Leather Honey', 'Invisible Glass'],
    },
    {
      id: 'signature-full-detail',
      label: 'Signature Full Detail',
      description: 'Our complete interior + exterior signature service — the definitive Hangar & Harbor experience',
      basePrice: 975,
      baseLaborHours: 7,
      chemicalCost: 60,
      equipmentUsed: [
        'Two-Bucket Wash System',
        'Clay Mitt (Nanoskin)',
        'CarPro PERL',
        'Shop Vacuum',
        'Steam Cleaner',
        'Leather Honey',
      ],
    },
    {
      id: 'paint-enhancement',
      label: 'Paint Enhancement (One-Step Polish)',
      description: 'Single-stage machine polish to remove light swirls and restore deep gloss',
      basePrice: 795,
      baseLaborHours: 5.5,
      chemicalCost: 55,
      equipmentUsed: ['Maxshine Dual Action Polisher', '3D One Compound/Polish', 'Applicator Pads'],
    },
    {
      id: 'paint-correction',
      label: 'Paint Correction',
      description: 'Multi-stage machine correction for swirl marks, scratches, and oxidation',
      basePrice: 1850,
      baseLaborHours: 14,
      chemicalCost: 95,
      equipmentUsed: ['Maxshine Dual Action Polisher', '3D One Compound/Polish', 'Clay Mitt (Nanoskin)', 'Applicator Pads'],
    },
    {
      id: 'engine-bay-detail',
      label: 'Engine Bay Detail',
      description: 'Degreased, dressed, and detailed engine bay presentation',
      basePrice: 245,
      baseLaborHours: 1.75,
      chemicalCost: 22,
      equipmentUsed: ['Brake Buster', 'Plastic Cleaner'],
    },
    {
      id: 'leather-treatment',
      label: 'Leather Treatment',
      description: 'Deep clean, condition, and protect every leather surface in the cabin',
      basePrice: 215,
      baseLaborHours: 1.5,
      chemicalCost: 20,
      equipmentUsed: ['Leather Honey', 'P&S Xpress Interior Cleaner'],
    },
    {
      id: 'headlight-restoration',
      label: 'Headlight Restoration',
      description: 'Machine-restored clarity with a UV-protective finish',
      basePrice: 185,
      baseLaborHours: 1.25,
      chemicalCost: 15,
      equipmentUsed: ['Maxshine Dual Action Polisher', '3D One Compound/Polish', 'Invisible Glass'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // ADD-ONS — flat-priced extras layered on top of the primary service.
  // ─────────────────────────────────────────────────────────────────────
  addOns: [
    { id: 'clay-bar', label: 'Clay Bar Decontamination', price: 145, laborHours: 1, chemicalCost: 12, equipmentUsed: ['Clay Mitt (Nanoskin)'] },
    { id: 'iron-removal', label: 'Iron Removal', price: 110, laborHours: 0.75, chemicalCost: 14, equipmentUsed: ['Iron Remover'] },
    { id: 'leather-conditioning', label: 'Leather Conditioning', price: 125, laborHours: 0.75, chemicalCost: 10, equipmentUsed: ['Leather Honey'] },
    { id: 'engine-bay', label: 'Engine Bay Detail', price: 195, laborHours: 1.25, chemicalCost: 18, equipmentUsed: ['Brake Buster', 'Plastic Cleaner'] },
    { id: 'pet-hair-removal', label: 'Pet Hair Removal', price: 155, laborHours: 1, chemicalCost: 6, equipmentUsed: ['Shop Vacuum'] },
    { id: 'odor-treatment', label: 'Odor Treatment', price: 175, laborHours: 1, chemicalCost: 15, equipmentUsed: ['Steam Cleaner'] },
    { id: 'steam-cleaning', label: 'Steam Cleaning', price: 195, laborHours: 1.5, chemicalCost: 8, equipmentUsed: ['Steam Cleaner'] },
    { id: 'headlight-restoration', label: 'Headlight Restoration', price: 175, laborHours: 1, chemicalCost: 12, equipmentUsed: ['Maxshine Dual Action Polisher', '3D One Compound/Polish'] },
    { id: 'glass-sealant', label: 'Glass Sealant', price: 110, laborHours: 0.5, chemicalCost: 9, equipmentUsed: ['Invisible Glass'] },
    { id: 'trim-restoration', label: 'Trim Restoration', price: 185, laborHours: 1, chemicalCost: 11, equipmentUsed: ['Plastic Cleaner'] },
    { id: 'interior-protectant', label: 'Interior Protectant', price: 135, laborHours: 0.75, chemicalCost: 10, equipmentUsed: ['P&S Xpress Interior Cleaner', 'Plastic Cleaner'] },
    { id: 'wheel-ceramic-coating', label: 'Wheel Ceramic Coating', price: 450, laborHours: 2.5, chemicalCost: 85, equipmentUsed: ['Wheel Brushes', 'Barrel Brushes', 'CarPro PERL'] },
    { id: 'paint-sealant', label: 'Paint Sealant', price: 325, laborHours: 1.5, chemicalCost: 45, equipmentUsed: ['Applicator Pads', 'CarPro PERL'] },
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
  // LABOR — internal cost rate plus rules for suggested crew size and
  // rounding of the estimated appointment length. Never shown to clients.
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
  },

  // ─────────────────────────────────────────────────────────────────────
  // FUTURE EXPANSION — scaffolding only. Both stay hidden from the app
  // until `enabled` is flipped to `true` and real pricing is filled in.
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
