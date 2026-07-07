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
      description: 'Porsche 911, BMW M cars, AMG models, Corvette Stingray, Mustang GT/Shelby GT500, Hellcat, and similar performance cars',
      factors: ['Our baseline vehicle class — no additional handling surcharge'],
      classification: { makes: [], modelKeywords: [] },
    },
    {
      id: 'supercar',
      label: 'Supercar',
      multiplier: 1.12,
      description: 'Ferrari, Lamborghini, McLaren, Audi R8, Aston Martin, Bentley, Rolls-Royce, Lotus, and other exotic supercars',
      factors: ['Low ground clearance, wide-body fitment, and exotic materials require specialized handling and product care'],
      classification: {
        makes: ['ferrari', 'lamborghini', 'mclaren', 'lotus', 'aston martin', 'bentley', 'rolls-royce', 'rolls royce'],
        modelKeywords: ['gt3', 'turbo s', '911 gt', 'gt2', 'r8', 'z06', 'zr1', 'gt-r', 'gtr', 'amg gt'],
      },
    },
    {
      id: 'performance-truck',
      label: 'Performance Truck',
      multiplier: 1.22,
      description: 'Raptor R, TRX, and other high-performance trucks',
      factors: ['Larger surface area combined with aggressive performance trim requires additional attention'],
      classification: { makes: [], modelKeywords: ['raptor r', 'raptor', 'trx'] },
    },
    {
      id: 'hypercar',
      label: 'Hypercar',
      multiplier: 1.35,
      description: 'Bugatti, Koenigsegg, Pagani, Rimac, and other million-dollar hypercars',
      factors: ['Extreme rarity, bespoke materials, and irreplaceable parts require our most careful, deliberate handling'],
      classification: {
        makes: ['bugatti', 'koenigsegg', 'pagani', 'rimac', 'czinger'],
        modelKeywords: ['chiron', 'divo', 'veneno', 'sian', 'revuelto', 'laferrari', 'sf90 xx', 'senna', 'p1', 'speedtail', '918 spyder', 'valkyrie', 'regera', 'huayra'],
      },
    },
  ],

  // ── Condition & Findings ─────────────────────────────────────────────
  // Exterior and Interior Condition each carry their own flat surcharge —
  // one bucket covering all forms of contamination on that side of the
  // vehicle rather than itemized charges. Paint condition is a technician
  // note only.
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
        'Steam cleaning where appropriate',
        'Dash cleaning',
        'Center console cleaning',
        'Door panels',
        'Door pockets',
        'Cup holders',
        'Air vents',
        'Buttons and switches',
        'Plastic and vinyl cleaning with P&S Xpress',
        'Leather cleaning',
        'Leather conditioning with Leather Honey',
        'Interior glass',
        'Detail brush work',
        'Final microfiber wipe',
      ],
      basePriceByClass: { 'sports-car': 225, supercar: 250, 'performance-truck': 295, hypercar: 325 },
      baseLaborHours: 1.1,
      materialCost: 14,
      equipmentUsed: ['P&S Xpress Interior Cleaner', 'Leather Honey Cleaner/Conditioner', 'McCulloch Steam Cleaner', 'Ridgid Shop Vac with Attachments', 'Detail Brushes', 'Boar Hair Brushes', 'Invisible Glass Cleaner', 'Microfiber Towels'],
    },
    {
      id: 'exterior-detail',
      label: 'Exterior Detail',
      includes: [
        'Pressure rinse',
        'Foam cannon pre-soak',
        'Two-bucket hand wash',
        'Wheel faces cleaned',
        'Wheel barrels cleaned where accessible',
        'Tires cleaned',
        'Lug nuts detailed',
        'Detail brush work around badges, grilles, trim, and fuel door',
        'Door jamb wipe down',
        'Final rinse',
        'Premium towel dry',
        'Tire dressing with CARPRO PERL',
        'Exterior trim dressing with CARPRO PERL',
        'Exterior glass',
      ],
      basePriceByClass: { 'sports-car': 150, supercar: 175, 'performance-truck': 200, hypercar: 225 },
      baseLaborHours: 0.7,
      materialCost: 12,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Chemical Guys Mr. Pink', '2 Five-Gallon Buckets', 'Grit Guards', 'Premium Wash Mitts', 'Premium Drying Towels', 'Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes'],
    },
    {
      id: 'full-detail',
      label: 'Full Detail',
      includes: ['Everything in Interior Detail', 'Everything in Exterior Detail'],
      basePriceByClass: { 'sports-car': 340, supercar: 375, 'performance-truck': 400, hypercar: 435 },
      baseLaborHours: 1.65,
      materialCost: 24,
      equipmentUsed: [
        'Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Chemical Guys Mr. Pink', '2 Five-Gallon Buckets', 'Grit Guards', 'Premium Wash Mitts', 'Premium Drying Towels',
        'Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes',
        'P&S Xpress Interior Cleaner', 'Leather Honey Cleaner/Conditioner', 'McCulloch Steam Cleaner', 'Ridgid Shop Vac with Attachments', 'Boar Hair Brushes', 'Invisible Glass Cleaner', 'Microfiber Towels',
      ],
    },
    {
      id: 'paint-enhancement',
      label: 'Paint Enhancement Detail',
      includes: [
        'Everything in Full Detail',
        'Iron removal',
        'Clay mitt decontamination',
        'One-step machine polish',
        '3D One compound/polish',
        'Lake Country pads',
        'Increased gloss',
        'Light swirl reduction',
        'Improved paint clarity',
      ],
      basePriceByClass: { 'sports-car': 500, supercar: 550, 'performance-truck': 600, hypercar: 650 },
      baseLaborHours: 2.35,
      materialCost: 40,
      equipmentUsed: [
        'Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Chemical Guys Mr. Pink', '2 Five-Gallon Buckets', 'Grit Guards', 'Premium Wash Mitts', 'Premium Drying Towels',
        'Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes',
        'P&S Xpress Interior Cleaner', 'Leather Honey Cleaner/Conditioner', 'McCulloch Steam Cleaner', 'Ridgid Shop Vac with Attachments', 'Boar Hair Brushes', 'Invisible Glass Cleaner', 'Microfiber Towels',
        "Meguiar's Ultimate Iron Remover", 'Nanoskin Clay Mitt', 'Maxshine Dual Action Polisher', 'Lake Country Pads', '3D One Compound/Polish',
      ],
    },
  ],

  // ── Premium Upgrades ─────────────────────────────────────────────────
  // `availableForServiceIds` hides an upgrade entirely on any service where
  // it's already included (e.g. Iron Removal / Clay Mitt on Paint
  // Enhancement) rather than showing it as a redundant, disabled option.
  // Leather Conditioning additionally requires a leather-containing interior
  // (`requiresLeatherInterior`) — see VehicleInfo.interiorMaterial.
  addOns: [
    {
      id: 'engine-bay',
      label: 'Engine Bay Detail',
      includes: ['Safe rinse where appropriate', 'Gentle cleaning', 'Detail brush work', 'Drying', 'CARPRO PERL dressing'],
      price: 75,
      laborHours: 0.35,
      materialCost: 8,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'Detail Brushes', 'Premium Drying Towels', 'CARPRO PERL'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'steam-interior',
      label: 'Steam Interior Treatment',
      includes: ['Steam cleaning of hard surfaces', 'Vents', 'Cup holders', 'Buttons', 'Door handles', 'High-touch sanitization'],
      price: 40,
      laborHours: 0.15,
      materialCost: 6,
      equipmentUsed: ['McCulloch Steam Cleaner', 'Detail Brushes', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'leather-conditioning',
      label: 'Leather Conditioning',
      includes: ['Leather Honey Conditioner', 'UV protection', 'Leather nourishment'],
      price: 40,
      laborHours: 0.15,
      materialCost: 7,
      equipmentUsed: ['Leather Honey Cleaner/Conditioner'],
      availableForServiceIds: ['interior-detail', 'full-detail', 'paint-enhancement'],
      requiresLeatherInterior: true,
    },
    {
      id: 'iron-removal',
      label: 'Iron Removal',
      includes: ["Meguiar's Ultimate Iron Remover treatment", 'Removes bonded iron/brake dust contamination from paint'],
      price: 55,
      laborHours: 0.25,
      materialCost: 6,
      equipmentUsed: ["Meguiar's Ultimate Iron Remover"],
      availableForServiceIds: ['exterior-detail', 'full-detail'],
    },
    {
      id: 'clay-decon',
      label: 'Clay Mitt Decontamination',
      includes: ['Nanoskin clay mitt treatment', 'Removes bonded surface contaminants for a glass-smooth finish'],
      price: 65,
      laborHours: 0.32,
      materialCost: 5,
      equipmentUsed: ['Nanoskin Clay Mitt'],
      availableForServiceIds: ['exterior-detail', 'full-detail'],
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
