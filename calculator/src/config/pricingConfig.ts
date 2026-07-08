// ═══════════════════════════════════════════════════════════════════════
// HANGAR & HARBOR — CENTRALIZED PRICING CONFIG
// ═══════════════════════════════════════════════════════════════════════
// Every number and word the calculator uses — equipment, vehicle classes,
// condition surcharges, service pricing/descriptions, add-ons, travel,
// discounts, and labor/material assumptions — lives in this one file.
// Change a value here and every screen (form, live estimate, print, PDF,
// copy text, staff-only Business Summary) updates automatically.
// ═══════════════════════════════════════════════════════════════════════

import type { PricingConfig } from '../types'

export const pricingConfig: PricingConfig = {
  company: {
    name: 'Hangar & Harbor',
    tagline: 'Exotic & Performance Vehicle Care — Estimate Console',
  },

  equipment: [
    { category: 'Pressure Washing', items: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon'] },
    {
      category: 'Wash Equipment',
      items: ['Chemical Guys Mr. Pink', '2 Five-Gallon Buckets', 'Grit Guards', 'Premium Wash Mitts', 'Premium Drying Towels', 'Microfiber Towels', '3 Spray Bottles'],
    },
    { category: 'Wheel & Tire Care', items: ['Brake Buster', 'Wheel Brushes', 'CARPRO PERL'] },
    {
      category: 'Interior Care',
      items: ['P&S Xpress Interior Cleaner', 'Leather Honey Cleaner/Conditioner', 'McCulloch Steam Cleaner', 'Ridgid Shop Vac with Attachments', 'Detail Brushes', 'Boar Hair Brushes', 'Invisible Glass Cleaner'],
    },
    {
      category: 'Decontamination & Polishing',
      items: ["Meguiar's Ultimate Iron Remover", 'Nanoskin Clay Mitt', 'Maxshine Dual Action Polisher', 'Lake Country Pads', '3D One Compound/Polish'],
    },
  ],

  // ── Vehicle Class ────────────────────────────────────────────────────
  // Doubles as the pricing dimension every service is keyed on. `multiplier`
  // only scales labor hours and material cost — price always comes directly
  // from each service's per-class table below.
  vehicleTypes: [
    {
      id: 'sports-car',
      label: 'Sports Car',
      multiplier: 1.0,
      description: 'Mustang GT, Camaro SS, Toyota Supra, Nissan Z, BMW M2, Porsche Cayman, and similar performance cars',
      factors: ['Our baseline vehicle class — no additional handling surcharge'],
      classification: { makes: [], modelKeywords: [] },
    },
    {
      id: 'supercar',
      label: 'Supercar',
      multiplier: 1.12,
      description: 'Porsche 911 Turbo S, Ferrari, Lamborghini, McLaren, Audi R8, Acura NSX, and other exotic supercars',
      factors: ['Low ground clearance, wide-body fitment, and exotic materials require specialized handling and product care'],
      classification: {
        makes: ['ferrari', 'lamborghini', 'mclaren', 'lotus', 'aston martin', 'bentley', 'rolls-royce', 'rolls royce', 'acura'],
        modelKeywords: ['gt3', '911 turbo', '911 gt', 'gt2', 'r8', 'z06', 'zr1', 'gt-r', 'gtr', 'amg gt', 'nsx'],
      },
    },
    {
      id: 'luxury-suv-truck',
      label: 'Luxury SUV & Truck',
      multiplier: 1.22,
      description: 'Cadillac Escalade, Range Rover, Mercedes G-Class, Rivian R1S, Ram Limited, GMC/Yukon Denali, BMW X7, Raptor, TRX, and other luxury SUVs and high-performance trucks',
      factors: ['Larger surface area and premium interior materials require additional time and care'],
      classification: {
        makes: ['rivian', 'ram'],
        modelKeywords: [
          'escalade', 'range rover', 'g-class', 'g wagon', 'g-wagon', 'gwagen', 'denali', 'x7',
          'raptor r', 'raptor', 'trx', 'shelby f-150', 'hummer ev',
        ],
      },
    },
    {
      id: 'hypercar',
      label: 'Hypercar',
      multiplier: 1.35,
      description: 'Bugatti, Koenigsegg, Pagani, Rimac, and other million-dollar hypercars',
      factors: ['Extreme rarity, bespoke materials, and irreplaceable parts require our most careful, deliberate handling'],
      classification: {
        makes: ['bugatti', 'koenigsegg', 'pagani', 'rimac', 'czinger'],
        modelKeywords: ['chiron', 'tourbillon', 'divo', 'veneno', 'sian', 'laferrari', 'sf90 xx', 'senna', 'p1', 'speedtail', '918 spyder', 'valkyrie', 'regera', 'jesko', 'nevera', 'huayra', 'utopia', 'amg one'],
      },
    },
  ],

  // ── Condition & Findings ─────────────────────────────────────────────
  // Exterior and Interior Condition each carry their own flat surcharge —
  // applied ONCE per side, regardless of how many individual contamination
  // types are present. The inspection items themselves are technician
  // reference only; they help decide which single tier to pick and never
  // stack into separate charges.
  exteriorConditions: [
    { id: 'excellent', label: 'Excellent', surcharge: 0, note: 'Presented in showroom-ready condition — no additional exterior contamination charge.' },
    { id: 'light', label: 'Light Contamination', surcharge: 15, note: 'Light bugs, brake dust, road film, or fallout — minor added decontamination time.' },
    { id: 'moderate', label: 'Moderate Contamination', surcharge: 30, note: 'Moderate contamination (bugs, brake dust, tar, tree sap, road film) — additional decontamination time required.' },
    { id: 'heavy', label: 'Heavy Contamination', surcharge: 60, note: 'Heavy contamination across paint and wheels — significant additional decontamination time required.' },
  ],
  interiorConditions: [
    { id: 'excellent', label: 'Excellent', surcharge: 0, note: 'Interior presented in showroom-ready condition — no additional interior contamination charge.' },
    { id: 'light', label: 'Light Contamination', surcharge: 15, note: 'Interior shows light contamination — minor added cleaning time.' },
    { id: 'moderate', label: 'Moderate Contamination', surcharge: 30, note: 'Interior shows moderate contamination — additional cleaning time required.' },
    { id: 'heavy', label: 'Heavy Contamination', surcharge: 60, note: 'Interior shows heavy contamination — significant additional cleaning time required.' },
  ],
  paintConditions: [
    { id: 'excellent', label: 'Excellent', note: '' },
    { id: 'light', label: 'Light Swirls', note: 'Light swirl marks noted in the paint — informs polishing approach, no charge.' },
    { id: 'moderate', label: 'Moderate Swirls', note: 'Moderate swirl marks noted in the paint — informs polishing approach, no charge.' },
    { id: 'heavy', label: 'Heavy Swirls', note: 'Heavy swirl marks noted in the paint — informs polishing approach, no charge.' },
  ],

  // ── Primary Services ─────────────────────────────────────────────────
  services: [
    {
      id: 'interior-detail',
      label: 'Interior Detail',
      includes: [
        'Complete vacuum',
        'Interior wipe down',
        'Plastic & vinyl cleaning',
        'Dashboard, console & door panels',
        'Interior glass cleaning',
        'Door jamb wipe down',
        'Soft brush detailing of vents, buttons, badges and crevices',
        'Leather cleaned (not conditioned)',
      ],
      basePriceByClass: { 'sports-car': 185, supercar: 215, 'luxury-suv-truck': 240, hypercar: 255 },
      baseLaborHours: 0.9,
      materialCost: 14,
      equipmentUsed: ['P&S Xpress Interior Cleaner', 'Leather Honey Cleaner/Conditioner', 'Ridgid Shop Vac with Attachments', 'Detail Brushes', 'Boar Hair Brushes', 'Invisible Glass Cleaner', 'Microfiber Towels'],
    },
    {
      id: 'exterior-detail',
      label: 'Exterior Detail',
      includes: [
        'Wheels cleaned',
        'Tires cleaned',
        'Wheel faces & barrels cleaned',
        'Wheel wells rinsed',
        'Foam pre-soak',
        'Hand wash',
        'Detail brushes around emblems, trim, fuel door, badges & crevices',
        'Final rinse',
        'Premium microfiber towel dry',
        'Tire dressing',
        'Exterior glass cleaning',
      ],
      basePriceByClass: { 'sports-car': 100, supercar: 115, 'luxury-suv-truck': 135, hypercar: 155 },
      baseLaborHours: 0.45,
      materialCost: 10,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Chemical Guys Mr. Pink', '2 Five-Gallon Buckets', 'Grit Guards', 'Premium Wash Mitts', 'Premium Drying Towels', 'Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes'],
    },
    {
      id: 'full-detail',
      label: 'Full Detail',
      includes: ['Everything in Interior Detail', 'Everything in Exterior Detail'],
      basePriceByClass: { 'sports-car': 275, supercar: 295, 'luxury-suv-truck': 315, hypercar: 335 },
      baseLaborHours: 1.2,
      materialCost: 15,
      equipmentUsed: [
        'Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Chemical Guys Mr. Pink', '2 Five-Gallon Buckets', 'Grit Guards', 'Premium Wash Mitts', 'Premium Drying Towels',
        'Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes',
        'P&S Xpress Interior Cleaner', 'Leather Honey Cleaner/Conditioner', 'Ridgid Shop Vac with Attachments', 'Boar Hair Brushes', 'Invisible Glass Cleaner', 'Microfiber Towels',
      ],
    },
    {
      id: 'paint-enhancement',
      label: 'Paint Enhancement Detail',
      includes: [
        'Everything in Full Detail',
        'Iron remover treatment',
        'Clay mitt decontamination',
        'One-step machine polish using our Maxshine DA polisher',
        '3D One compound/polish',
        'Appropriate Lake Country pad selection',
        'Paint refinement to improve gloss and reduce light swirls',
        'Finished with paint sealant',
      ],
      tagline: 'Our highest level service currently offered.',
      basePriceByClass: { 'sports-car': 425, supercar: 450, 'luxury-suv-truck': 475, hypercar: 525 },
      baseLaborHours: 1.9,
      materialCost: 32,
      equipmentUsed: [
        'Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Chemical Guys Mr. Pink', '2 Five-Gallon Buckets', 'Grit Guards', 'Premium Wash Mitts', 'Premium Drying Towels',
        'Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes',
        'P&S Xpress Interior Cleaner', 'Leather Honey Cleaner/Conditioner', 'Ridgid Shop Vac with Attachments', 'Boar Hair Brushes', 'Invisible Glass Cleaner', 'Microfiber Towels',
        "Meguiar's Ultimate Iron Remover", 'Nanoskin Clay Mitt', 'Maxshine Dual Action Polisher', 'Lake Country Pads', '3D One Compound/Polish',
      ],
    },
  ],

  // ── Premium Enhancements ─────────────────────────────────────────────
  // Every enhancement is available as an optional checkbox regardless of
  // which package is selected — `availableForServiceIds` lists all four
  // services for each one. Leather Conditioning is the one exception with
  // an actual availability gate: it's hidden unless the vehicle's interior
  // material includes leather (`requiresLeatherInterior`).
  addOns: [
    {
      id: 'steam-cleaning',
      label: 'Steam Cleaning',
      includes: ['Steam cleaning of vents, buttons, and high-touch hard surfaces'],
      price: 45,
      laborHours: 0.2,
      materialCost: 5,
      equipmentUsed: ['McCulloch Steam Cleaner', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'leather-conditioning',
      label: 'Leather Conditioning',
      includes: ['Leather Honey Conditioner', 'UV protection', 'Leather nourishment'],
      price: 40,
      laborHours: 0.15,
      materialCost: 7,
      equipmentUsed: ['Leather Honey Cleaner/Conditioner'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
      requiresLeatherInterior: true,
    },
    {
      id: 'engine-bay',
      label: 'Engine Bay Detail',
      includes: ['Safe rinse when appropriate', 'Gentle cleaning', 'Detail brushes', 'Drying', 'CARPRO PERL dressing'],
      price: 60,
      laborHours: 0.26,
      materialCost: 8,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'Detail Brushes', 'Premium Drying Towels', 'CARPRO PERL'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'pet-hair-removal',
      label: 'Pet Hair Removal',
      includes: ['Detailed removal of embedded pet hair from carpet and upholstery'],
      price: 40,
      laborHours: 0.18,
      materialCost: 3,
      equipmentUsed: ['Ridgid Shop Vac with Attachments', 'Detail Brushes'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'odor-treatment',
      label: 'Odor Treatment',
      includes: ['Interior odor elimination treatment'],
      price: 30,
      laborHours: 0.1,
      materialCost: 6,
      equipmentUsed: ['P&S Xpress Interior Cleaner'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'seat-extraction',
      label: 'Seat Extraction (per row)',
      includes: ['Deep extraction cleaning of one row of seating'],
      price: 40,
      laborHours: 0.18,
      materialCost: 5,
      equipmentUsed: ['Ridgid Shop Vac with Attachments', 'P&S Xpress Interior Cleaner'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'carpet-extraction',
      label: 'Carpet Extraction',
      includes: ['Deep extraction cleaning of carpet and floor mats'],
      price: 50,
      laborHours: 0.24,
      materialCost: 6,
      equipmentUsed: ['Ridgid Shop Vac with Attachments', 'P&S Xpress Interior Cleaner'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'headliner-spot-cleaning',
      label: 'Headliner Spot Cleaning',
      includes: ['Spot cleaning of headliner stains and soiling'],
      price: 25,
      laborHours: 0.11,
      materialCost: 3,
      equipmentUsed: ['P&S Xpress Interior Cleaner', 'Detail Brushes', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'heavy-bug-removal',
      label: 'Heavy Bug Removal',
      includes: ['Extra dwell time and detail work for heavy bug accumulation'],
      price: 20,
      laborHours: 0.08,
      materialCost: 3,
      equipmentUsed: ['Chemical Guys Mr. Pink', 'Detail Brushes'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'tree-sap-removal',
      label: 'Tree Sap Removal',
      includes: ['Targeted removal of bonded tree sap from paint'],
      price: 30,
      laborHours: 0.13,
      materialCost: 4,
      equipmentUsed: ['Detail Brushes', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'tar-removal',
      label: 'Tar Removal',
      includes: ['Targeted removal of bonded tar and road grime from paint'],
      price: 30,
      laborHours: 0.13,
      materialCost: 4,
      equipmentUsed: ['Detail Brushes', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
  ],

  travel: { freeMiles: 25, pricePerMile: 2.5 },

  discounts: [
    { id: 'military', label: 'Military', percentage: 0.1, description: 'Active duty, reserve, or veteran' },
    { id: 'repeatClient', label: 'Repeat Client', percentage: 0.05, description: 'Returning client discount' },
    { id: 'referral', label: 'Referral', percentage: 0.05, description: 'Came in on a client referral' },
    { id: 'portfolioVehicle', label: 'Portfolio Vehicle', percentage: 0.15, description: 'Notable vehicle we can feature in our portfolio' },
    { id: 'custom', label: 'Custom %', percentage: 0, description: 'Manually entered percentage' },
  ],

  labor: {
    ratePerHour: 85,
    travelCostPerMile: 0.67,
    marginWarningThreshold: 0.45,
  },

  future: {
    yachts: { enabled: false, label: 'Yachts', services: [], addOns: [] },
    aircraft: { enabled: false, label: 'Private Aviation', services: [], addOns: [] },
  },

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
