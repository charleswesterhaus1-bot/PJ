// ═══════════════════════════════════════════════════════════════════════
// HANGAR & HARBOR — MASTER PRICING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════
//
// This is the ONLY file you should need to edit to change pricing, labor
// estimates, multipliers, equipment, or discounts anywhere in the app.
// Every screen reads from this file — nothing is hardcoded elsewhere.
//
// We are a luxury exotic/performance vehicle care brand, not a generic
// mobile detailer — every service/add-on below uses only equipment we
// actually own today (see `equipment`), scoped to what a Porsche/Ferrari/
// Lamborghini/McLaren/Urus/Raptor R-type clientele actually needs. No
// ceramic coatings, no multi-step correction, no carpet extraction —
// those aren't offered yet.
//
// Pricing is keyed on VEHICLE CLASS (Sports Car / Supercar / Luxury SUV /
// Performance Truck) rather than a base price × multiplier — real class
// pricing isn't a clean ratio across every package, so each service
// carries its own `basePriceByClass` table with "Sports Car" as the
// reference/baseline tier. The `multiplier` on each vehicle class scales
// labor hours and chemical cost only (bigger/more complex vehicles take
// more time and product), since price already comes from the table.
//
// `chemicalCost` and the labor rate are internal-only figures used to
// compute the staff-facing profitability panel; they never appear on a
// client-facing estimate. Each service's `baseLaborHours` was calibrated
// so the undiscounted Sports Car baseline clears ~45-55% gross margin —
// see the margin-warning note in README before changing prices/hours.
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
    tagline: 'Exotic & Performance Vehicle Care — Estimate Console',
  },

  // ─────────────────────────────────────────────────────────────────────
  // EQUIPMENT — what we actually own today. This is the ground truth for
  // which services we can responsibly offer; see `equipmentUsed` on each
  // service/add-on below.
  // ─────────────────────────────────────────────────────────────────────
  equipment: [
    {
      category: 'Pressure Washing',
      items: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Two-Bucket Wash System'],
    },
    {
      category: 'Wash Equipment',
      items: ['Premium Wash Mitts', 'Premium Microfiber Towels', 'Chemical Guys Mr. Pink Shampoo'],
    },
    {
      category: 'Wheel & Tire Care',
      items: ['Wheel Cleaner', 'Tire Dressing'],
    },
    {
      category: 'Interior Care',
      items: ['Interior Cleaners', 'Leather Cleaner', 'Leather Conditioner'],
    },
    {
      category: 'Decontamination & Polishing',
      items: [
        "Meguiar's Ultimate Iron Remover",
        'Nanoskin Clay Mitt',
        "Griot's Garage G9 Random Orbital Polisher",
        '3D One Compound/Polish',
        'Lake Country Foam Pads',
        'Premium Synthetic Paint Sealant',
      ],
    },
    {
      category: 'Engine Bay',
      items: ['Basic Engine Bay Cleaning Supplies'],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE CLASS — Sports Car / Supercar / Luxury SUV / Performance Truck.
  // `classification` drives auto-detection from Make/Model: modelKeywords
  // win over `makes` and are checked in priority order (Supercar first,
  // then Performance Truck, then Luxury SUV) so a more specific nameplate
  // never loses to a broader one. Anything unrecognized defaults to
  // Sports Car — there's no "unsupported vehicle" gate; every car we're
  // asked to quote gets priced, staff can always override the dropdown.
  // ─────────────────────────────────────────────────────────────────────
  vehicleTypes: [
    {
      id: 'sports-car',
      label: 'Sports Car',
      multiplier: 1.0,
      description: 'Porsche 911, BMW M cars, AMG models, Corvette, Mustang GT/Shelby, Hellcat, and similar performance cars',
      factors: ['Our baseline vehicle class — no additional handling surcharge'],
      classification: { makes: [], modelKeywords: [] },
    },
    {
      id: 'supercar',
      label: 'Supercar',
      multiplier: 1.1,
      description: 'Ferrari, Lamborghini, McLaren, Bugatti, and other exotic supercars and hypercars',
      factors: [
        'Extremely low ground clearance, wide-body fitment, and exotic materials require specialized handling and product care',
      ],
      classification: {
        makes: ['ferrari', 'lamborghini', 'mclaren', 'bugatti', 'koenigsegg', 'pagani', 'rimac', 'czinger', 'lotus'],
        modelKeywords: [
          'gt3', 'turbo s', '911 gt', 'gt2', 'z06', 'zr1', 'gt-r', 'gtr', 'r8', 'amg gt',
          'laferrari', 'senna', 'p1', 'chiron', 'divo', 'valkyrie', '918 spyder', 'veneno', 'sian', 'reventon',
        ],
      },
    },
    {
      id: 'luxury-suv',
      label: 'Luxury SUV',
      multiplier: 1.25,
      description: 'Urus, G63, Bentayga, Cullinan, Range Rover SV, and similar high-performance luxury SUVs',
      factors: ['Larger body panels, premium interior materials, and advanced surface coatings require additional time and care'],
      classification: {
        makes: [],
        modelKeywords: ['urus', 'g63', 'g-wagon', 'gwagen', 'bentayga', 'cullinan', 'range rover sv', 'range rover sport svr', 'trackhawk'],
      },
    },
    {
      id: 'performance-truck',
      label: 'Performance Truck',
      multiplier: 1.3,
      description: 'Raptor R, TRX, and other high-performance trucks',
      factors: ['Larger surface area combined with aggressive performance trim and premium finishes requires additional attention'],
      classification: {
        makes: [],
        modelKeywords: ['raptor r', 'raptor', 'trx'],
      },
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
  // the Sports Car baseline described above.
  // ─────────────────────────────────────────────────────────────────────
  services: [
    {
      id: 'maintenance-wash',
      label: 'Signature Maintenance Wash',
      includes: [
        'Wheel & tire cleaning',
        'Foam cannon wash',
        'Two-bucket hand wash',
        'Detail brushes around badges and tight areas',
        'Pressure rinse',
        'Hand dry',
        'Exterior glass',
        'Quick interior vacuum',
        'Quick interior wipe',
      ],
      basePriceByClass: { 'sports-car': 165, supercar: 185, 'luxury-suv': 200, 'performance-truck': 200 },
      baseLaborHours: 0.75,
      chemicalCost: 15,
      equipmentUsed: ['Active 2.0 Pressure Washer', 'MJJC Pro V3 Foam Cannon', 'Two-Bucket Wash System', 'Premium Wash Mitts', 'Chemical Guys Mr. Pink Shampoo'],
    },
    {
      id: 'exterior-detail',
      label: 'Signature Exterior Detail',
      includes: [
        'Everything in Signature Maintenance Wash',
        'Tire dressing',
        'Door jamb cleaning',
        'More detailed wheel cleaning',
        'Extra detail brush work',
        'Bug removal',
        'Premium Paint Sealant',
      ],
      basePriceByClass: { 'sports-car': 200, supercar: 250, 'luxury-suv': 275, 'performance-truck': 275 },
      baseLaborHours: 0.85,
      chemicalCost: 25,
      equipmentUsed: ['Wheel Cleaner', 'Tire Dressing', 'Premium Microfiber Towels', 'Premium Synthetic Paint Sealant'],
    },
    {
      id: 'interior-detail',
      label: 'Signature Interior Detail',
      includes: [
        'Full vacuum',
        'Dashboard and console cleaning',
        'Door panels',
        'Cup holders',
        'Vents',
        'Interior glass',
        'Leather cleaning',
        'Detail brushes in tight areas',
        'Trunk/frunk vacuum',
        'Light stain cleaning',
      ],
      basePriceByClass: { 'sports-car': 200, supercar: 225, 'luxury-suv': 250, 'performance-truck': 250 },
      baseLaborHours: 0.9,
      chemicalCost: 20,
      equipmentUsed: ['Interior Cleaners', 'Leather Cleaner', 'Premium Microfiber Towels'],
    },
    {
      id: 'full-detail',
      label: 'Signature Full Detail',
      includes: ['Everything in Signature Exterior Detail', 'Everything in Signature Interior Detail'],
      basePriceByClass: { 'sports-car': 375, supercar: 425, 'luxury-suv': 450, 'performance-truck': 450 },
      baseLaborHours: 1.7,
      chemicalCost: 40,
      equipmentUsed: ['Wheel Cleaner', 'Tire Dressing', 'Interior Cleaners', 'Leather Cleaner', 'Premium Synthetic Paint Sealant'],
    },
    {
      id: 'paint-enhancement',
      label: 'Paint Enhancement Detail',
      includes: [
        'Signature Exterior Detail',
        'Iron removal',
        'Clay mitt decontamination',
        "One-step machine polish using Griot's G9, 3D One, and Lake Country pads",
        'Premium Paint Sealant',
      ],
      basePriceByClass: { 'sports-car': 500, supercar: 575, 'luxury-suv': 625, 'performance-truck': 625 },
      baseLaborHours: 2.25,
      chemicalCost: 70,
      equipmentUsed: [
        "Meguiar's Ultimate Iron Remover",
        'Nanoskin Clay Mitt',
        "Griot's Garage G9 Random Orbital Polisher",
        '3D One Compound/Polish',
        'Lake Country Foam Pads',
        'Premium Synthetic Paint Sealant',
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // PREMIUM UPGRADES — the only two customer-facing add-ons right now.
  // Paint decontamination is NOT a separate upgrade — it's already
  // included in Paint Enhancement Detail above.
  // ─────────────────────────────────────────────────────────────────────
  addOns: [
    {
      id: 'engine-bay',
      label: 'Engine Bay Detail',
      includes: ['Clean engine bay', 'Dress plastics'],
      price: 75,
      laborHours: 0.75,
      chemicalCost: 10,
      equipmentUsed: ['Basic Engine Bay Cleaning Supplies'],
    },
    {
      id: 'leather-conditioning',
      label: 'Leather Conditioning',
      includes: ['Premium leather conditioner', 'UV protection'],
      price: 50,
      laborHours: 0.5,
      chemicalCost: 8,
      equipmentUsed: ['Leather Conditioner'],
    },
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
      { maxLaborHours: 3, teamSize: 1, label: 'Solo Detailer' },
      { maxLaborHours: 6, teamSize: 2, label: 'Two-Person Team' },
      { maxLaborHours: 10, teamSize: 3, label: 'Three-Person Team' },
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
