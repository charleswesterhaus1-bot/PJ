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

  // Every service/add-on's `equipmentUsed` is drawn from this exact roster —
  // nothing is ever advertised that we don't actually own.
  equipment: [
    { category: 'Pressure Washing', items: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon'] },
    { category: 'Wash & Drying', items: ['Microfiber Towels', 'Wheel Brushes', 'Detail Brushes'] },
    { category: 'Wheel & Tire Care', items: ['P&S Brake Buster', 'CARPRO PERL'] },
    {
      category: 'Interior Care',
      items: ['P&S Xpress Interior Cleaner', 'Leather Honey Cleaner', 'Leather Honey Conditioner', 'Applicator Pads', 'McCulloch MC1385 Steamer', 'Ridgid Shop Vac', 'Invisible Glass'],
    },
    { category: 'Decontamination & Polishing', items: ['Iron Remover', 'Nanoskin Clay Mitt', "Griot's G9 Polisher", 'Lake Country Pads', '3D One Hybrid Compound & Polish'] },
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
      description: 'Toyota Supra, BMW M2/M4, Mustang GT, Corvette Stingray, Porsche Cayman, and similar performance cars',
      factors: ['Our baseline vehicle class — no additional handling surcharge'],
      classification: { makes: [], modelKeywords: [] },
    },
    {
      id: 'supercar',
      label: 'Supercar',
      multiplier: 1.12,
      description: 'Porsche 911 Turbo S, Ferrari, Lamborghini, McLaren, Audi R8, and other exotic supercars',
      factors: ['Low ground clearance, wide-body fitment, and exotic materials require specialized handling and product care'],
      classification: {
        makes: ['ferrari', 'lamborghini', 'mclaren', 'aston martin', 'bentley', 'rolls-royce', 'rolls royce', 'acura'],
        modelKeywords: ['gt3', '911 turbo', '911 gt', 'gt2', 'r8', 'z06', 'zr1', 'amg gt', 'nsx'],
      },
    },
    {
      id: 'luxury-suv-truck',
      label: 'SUV / Truck',
      multiplier: 1.22,
      description: 'Range Rover, Escalade, Ram Limited/Tungsten, Mercedes G-Class, BMW X7, Yukon Denali, Rivian R1S, and other trucks and SUVs',
      factors: ['Larger surface area and premium interior materials require additional time and care'],
      classification: {
        makes: ['rivian', 'ram'],
        modelKeywords: [
          'escalade', 'range rover', 'g-class', 'g wagon', 'g-wagon', 'gwagen', 'denali', 'yukon', 'tahoe', 'x7',
          'bentayga', 'cullinan', 'f-150', 'f150', 'raptor r', 'raptor', 'trx', 'shelby f-150', 'hummer ev',
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
  // Exterior and Interior Condition are the ONLY tiers that change price —
  // one flat surcharge per side, applied once, that simply compensates for
  // additional labor. It never stacks per contamination type (a car with
  // heavy bugs, heavy mud, AND heavy road film is still just "Heavy
  // Exterior Contamination," not three separate charges). Paint, Wheels,
  // and Engine Bay are technician-reference categories that help decide
  // which tier and which primary service fit — they never add their own
  // charge.
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
    { id: 'light', label: 'Light Swirls', note: 'Light swirl marks noted in the paint — Signature Paint Enhancement is worth recommending.' },
    { id: 'moderate', label: 'Moderate Swirls', note: 'Moderate swirl marks noted in the paint — Signature Paint Enhancement is recommended.' },
    { id: 'heavy', label: 'Heavy Swirls', note: 'Heavy swirl marks and reduced clarity noted in the paint — Signature Paint Enhancement is strongly recommended.' },
  ],
  wheelConditions: [
    { id: 'excellent', label: 'Excellent', note: '' },
    { id: 'light', label: 'Light', note: 'Wheel faces/barrels show light brake dust or road grime — technician reference only.' },
    { id: 'moderate', label: 'Moderate', note: 'Wheel faces/barrels show moderate brake dust or road grime — technician reference only.' },
    { id: 'heavy', label: 'Heavy', note: 'Wheel faces/barrels show heavy, baked-on brake dust or road grime — technician reference only.' },
  ],
  engineBayConditions: [
    { id: 'excellent', label: 'Excellent', note: '' },
    { id: 'light', label: 'Light', note: 'Engine bay shows light dust/grime — consider the Engine Bay Detail enhancement.' },
    { id: 'moderate', label: 'Moderate', note: 'Engine bay shows moderate dust/grime — consider the Engine Bay Detail enhancement.' },
    { id: 'heavy', label: 'Heavy', note: 'Engine bay shows heavy grime buildup — the Engine Bay Detail enhancement is recommended.' },
  ],

  // ── Primary Services ─────────────────────────────────────────────────
  services: [
    {
      id: 'interior-detail',
      label: 'Signature Interior Detail',
      includes: [
        {
          group: '',
          items: [
            'Thorough vacuum',
            'Dashboard cleaning',
            'Center console cleaning',
            'Door panels',
            'Door jamb wipe-down',
            'Cup holders',
            'Air vents',
            'Buttons & switches',
            'Plastic & vinyl cleaning using P&S Xpress',
            'Leather cleaning (not conditioning)',
            'Interior glass',
            'Detail brush work',
            'Final microfiber wipe',
          ],
        },
      ],
      basePriceByClass: { 'sports-car': 185, supercar: 215, 'luxury-suv-truck': 240, hypercar: 255 },
      baseLaborHours: 0.9,
      materialCost: 14,
      equipmentUsed: ['P&S Xpress Interior Cleaner', 'Leather Honey Cleaner', 'Ridgid Shop Vac', 'Detail Brushes', 'Invisible Glass', 'Microfiber Towels'],
      relevantConditions: ['interior'],
    },
    {
      id: 'exterior-detail',
      label: 'Signature Exterior Detail',
      includes: [
        {
          group: '',
          items: [
            'Pressure rinse',
            'Foam cannon pre-soak',
            'Two-bucket hand wash',
            'Wheels cleaned',
            'Wheel barrels cleaned where accessible',
            'Tire cleaning',
            'Tire dressing using CARPRO PERL',
            'Detail brush work around badges, trim, fuel door and grilles',
            'Exterior glass cleaning',
            'Door jamb wipe-down',
            'Final rinse',
            'Premium microfiber towel dry',
            'Removes normal bug buildup — no separate charge',
          ],
        },
      ],
      basePriceByClass: { 'sports-car': 100, supercar: 115, 'luxury-suv-truck': 135, hypercar: 155 },
      baseLaborHours: 0.45,
      materialCost: 10,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'P&S Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes', 'Microfiber Towels'],
      relevantConditions: ['exterior'],
    },
    {
      id: 'full-detail',
      label: 'Signature Full Detail',
      includes: [
        {
          group: 'Interior',
          items: [
            'Thorough vacuum',
            'Dashboard & center console cleaning',
            'Door panels & door jamb wipe-down',
            'Cup holders, air vents, buttons & switches',
            'Leather cleaning (not conditioning)',
            'Interior glass',
            'Final microfiber wipe',
          ],
        },
        {
          group: 'Exterior',
          items: [
            'Foam cannon pre-soak & two-bucket hand wash',
            'Wheels & tires cleaned, tires dressed',
            'Detail brush work around badges, trim & grilles',
            'Exterior glass cleaning',
            'Door jamb wipe-down',
            'Premium microfiber towel dry',
          ],
        },
      ],
      basePriceByClass: { 'sports-car': 275, supercar: 295, 'luxury-suv-truck': 315, hypercar: 335 },
      baseLaborHours: 1.2,
      materialCost: 15,
      equipmentUsed: [
        'Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'P&S Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes',
        'P&S Xpress Interior Cleaner', 'Leather Honey Cleaner', 'Ridgid Shop Vac', 'Invisible Glass', 'Microfiber Towels',
      ],
      relevantConditions: ['exterior', 'interior'],
    },
    {
      id: 'paint-enhancement',
      label: 'Signature Paint Enhancement',
      includes: [
        {
          group: 'Interior',
          items: [
            'Thorough vacuum',
            'Dashboard & center console cleaning',
            'Door panels & door jamb wipe-down',
            'Cup holders, air vents, buttons & switches',
            'Leather cleaning (not conditioning)',
            'Interior glass',
            'Final microfiber wipe',
          ],
        },
        {
          group: 'Exterior',
          items: [
            'Foam cannon pre-soak & two-bucket hand wash',
            'Wheels & tires cleaned, tires dressed',
            'Detail brush work around badges, trim & grilles',
            'Exterior glass cleaning',
            'Door jamb wipe-down',
            'Premium microfiber towel dry',
          ],
        },
        {
          group: 'Paint Enhancement',
          items: [
            'Iron decontamination',
            'Clay mitt decontamination',
            'One-step machine polish',
            'Improved gloss and reduced light swirl marks',
          ],
        },
      ],
      tagline: "A single-stage enhancement — not paint correction. Our highest level service currently offered.",
      basePriceByClass: { 'sports-car': 425, supercar: 450, 'luxury-suv-truck': 475, hypercar: 525 },
      baseLaborHours: 1.9,
      materialCost: 32,
      equipmentUsed: [
        'Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'P&S Brake Buster', 'Wheel Brushes', 'CARPRO PERL', 'Detail Brushes',
        'P&S Xpress Interior Cleaner', 'Leather Honey Cleaner', 'Ridgid Shop Vac', 'Invisible Glass', 'Microfiber Towels',
        'Iron Remover', 'Nanoskin Clay Mitt', "Griot's G9 Polisher", 'Lake Country Pads', '3D One Hybrid Compound & Polish',
      ],
      relevantConditions: ['exterior', 'interior', 'paint', 'wheels', 'engine'],
    },
  ],

  // ── Premium Enhancements ─────────────────────────────────────────────
  // Only enhancements we can actually perform with our current equipment.
  // Every enhancement is available as an optional checkbox regardless of
  // which package is selected — `availableForServiceIds` lists all four
  // services for each one. Leather Conditioning is the one exception with
  // a real availability gate: it's hidden unless the vehicle's interior
  // material includes leather (`requiresLeatherInterior`).
  addOns: [
    {
      id: 'steam-cleaning',
      label: 'Steam Cleaning',
      includes: ['Vents', 'Cup holders', 'Buttons', 'Door panels', 'Steering wheel', 'High-touch interior plastics'],
      price: 40,
      laborHours: 0.18,
      materialCost: 5,
      equipmentUsed: ['McCulloch MC1385 Steamer', 'Detail Brushes', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'leather-conditioning',
      label: 'Leather Conditioning',
      includes: ['Leather Honey conditioner', 'UV protection', 'Leather nourishment'],
      price: 30,
      laborHours: 0.1,
      materialCost: 7,
      equipmentUsed: ['Leather Honey Conditioner', 'Applicator Pads', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
      requiresLeatherInterior: true,
    },
    {
      id: 'engine-bay',
      label: 'Engine Bay Detail',
      includes: ['Gentle hand cleaning', 'Dressing with CARPRO PERL', 'No pressure washing sensitive components'],
      price: 50,
      laborHours: 0.21,
      materialCost: 8,
      equipmentUsed: ['P&S Xpress Interior Cleaner', 'Detail Brushes', 'CARPRO PERL', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
    },
    {
      id: 'pet-hair-removal',
      label: 'Pet Hair Removal',
      includes: ['Detailed removal of embedded pet hair from carpet and upholstery', 'Starting price — technician may increase for severity'],
      price: 40,
      laborHours: 0.18,
      materialCost: 3,
      equipmentUsed: ['Ridgid Shop Vac', 'Detail Brushes', 'Microfiber Towels'],
      availableForServiceIds: ['interior-detail', 'exterior-detail', 'full-detail', 'paint-enhancement'],
      allowManualSurcharge: true,
    },
  ],

  travel: { freeMiles: 15, pricePerMile: 2.5 },

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
