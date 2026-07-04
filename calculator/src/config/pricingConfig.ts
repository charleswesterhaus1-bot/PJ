// ═══════════════════════════════════════════════════════════════════════
// HANGAR & HARBOR — MASTER PRICING CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════
//
// This is the ONLY file you should need to edit to change pricing, labor
// estimates, multipliers, or discounts anywhere in the app. Every screen in
// the calculator reads from this file — nothing is hardcoded elsewhere.
//
// Safe to edit:
//   - Any number (prices, multipliers, hours, percentages, miles)
//   - Labels and descriptions
//   - Adding new add-ons, services, vehicle types, sizes, or conditions
//     (just copy an existing entry and give it a new unique `id`)
//
// Multipliers work like this: 1.0 = no change, 1.25 = +25%, 0.9 = -10%.
//
// The `future` section holds pricing scaffolding for yachts and private
// aviation. Both are `enabled: false` so nothing shows up in the app yet —
// flip `enabled: true` once you're ready to launch that service line, and
// fill in real services/add-ons the same way the detailing ones are built.
// ═══════════════════════════════════════════════════════════════════════

import type { PricingConfig } from '../types'

export const pricingConfig: PricingConfig = {
  company: {
    name: 'Hangar & Harbor',
    tagline: 'Exotic & High-Performance Vehicle Detailing — Estimate Console',
  },

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE TYPE — the class of exotic/performance vehicle being serviced.
  // Multiplier applies to the base service price to reflect the added
  // care, product cost, and risk of working on these platforms.
  // ─────────────────────────────────────────────────────────────────────
  vehicleTypes: [
    {
      id: 'hypercar',
      label: 'Hypercar',
      multiplier: 1.5,
      description: 'Bugatti, Koenigsegg, Pagani, LaFerrari-tier vehicles',
    },
    {
      id: 'supercar',
      label: 'Supercar',
      multiplier: 1.35,
      description: 'Ferrari, Lamborghini, McLaren',
    },
    {
      id: 'exotic',
      label: 'Exotic Car',
      multiplier: 1.2,
      description: 'Aston Martin, Bentley Continental GT, Maserati MC20',
    },
    {
      id: 'sports',
      label: 'High-End Sports Car',
      multiplier: 1.1,
      description: 'Porsche GT cars, Audi R8, AMG GT, Corvette Z06/ZR1, Nissan GT-R',
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE SIZE — scales labor/product needs relative to a mid-size car.
  // ─────────────────────────────────────────────────────────────────────
  vehicleSizes: [
    { id: 'small', label: 'Small', multiplier: 0.9 },
    { id: 'medium', label: 'Medium', multiplier: 1.0 },
    { id: 'large', label: 'Large', multiplier: 1.15 },
    { id: 'xl', label: 'Extra Large', multiplier: 1.3 },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // VEHICLE CONDITION — automatically applied multiplier, editable per job.
  // ─────────────────────────────────────────────────────────────────────
  conditions: [
    { id: 'excellent', label: 'Excellent', multiplier: 1.0, description: 'Minimal correction needed' },
    { id: 'light-dirt', label: 'Light Dirt', multiplier: 1.1 },
    { id: 'moderate-dirt', label: 'Moderate Dirt', multiplier: 1.25 },
    { id: 'heavy-contamination', label: 'Heavy Contamination', multiplier: 1.5 },
    { id: 'show-car-prep', label: 'Show Car Preparation', multiplier: 1.75, description: 'Concours-level finish' },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // SERVICES — the primary package selected for the estimate.
  // ─────────────────────────────────────────────────────────────────────
  services: [
    {
      id: 'maintenance-wash',
      label: 'Premium Maintenance Wash',
      description: 'Two-bucket hand wash, wheels, tires, and quick detail spray',
      basePrice: 225,
      baseLaborHours: 1.5,
    },
    {
      id: 'exterior-detail',
      label: 'Premium Exterior Detail',
      description: 'Full exterior decontamination, wash, and dressing',
      basePrice: 450,
      baseLaborHours: 3,
    },
    {
      id: 'interior-detail',
      label: 'Premium Interior Detail',
      description: 'Full interior deep clean, leather, and trim care',
      basePrice: 425,
      baseLaborHours: 3,
    },
    {
      id: 'signature-full-detail',
      label: 'Signature Full Detail',
      description: 'Complete interior + exterior signature service',
      basePrice: 850,
      baseLaborHours: 6,
    },
    {
      id: 'paint-enhancement',
      label: 'Paint Enhancement (One-Step Polish)',
      description: 'Single-stage machine polish to remove light swirls and add gloss',
      basePrice: 675,
      baseLaborHours: 5,
    },
    {
      id: 'paint-correction',
      label: 'Paint Correction',
      description: 'Multi-stage correction for swirl marks, scratches, and oxidation',
      basePrice: 1400,
      baseLaborHours: 10,
    },
    {
      id: 'engine-bay-detail',
      label: 'Engine Bay Detail',
      description: 'Degreased, dressed, and detailed engine bay',
      basePrice: 275,
      baseLaborHours: 2,
    },
    {
      id: 'leather-treatment',
      label: 'Leather Treatment',
      description: 'Deep clean, condition, and protect all leather surfaces',
      basePrice: 225,
      baseLaborHours: 1.5,
    },
    {
      id: 'headlight-restoration',
      label: 'Headlight Restoration',
      description: 'Restore clarity and UV-protect headlight lenses',
      basePrice: 150,
      baseLaborHours: 1,
    },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // ADD-ONS — flat-priced extras layered on top of the primary service.
  // ─────────────────────────────────────────────────────────────────────
  addOns: [
    { id: 'clay-bar', label: 'Clay Bar Decontamination', price: 125, laborHours: 1 },
    { id: 'iron-removal', label: 'Iron Removal', price: 95, laborHours: 0.75 },
    { id: 'leather-conditioning', label: 'Leather Conditioning', price: 110, laborHours: 0.75 },
    { id: 'engine-bay', label: 'Engine Bay Detail', price: 225, laborHours: 1.5 },
    { id: 'pet-hair-removal', label: 'Pet Hair Removal', price: 135, laborHours: 1 },
    { id: 'odor-treatment', label: 'Odor Treatment', price: 150, laborHours: 1 },
    { id: 'steam-cleaning', label: 'Steam Cleaning', price: 175, laborHours: 1.5 },
    { id: 'headlight-restoration', label: 'Headlight Restoration', price: 150, laborHours: 1 },
    { id: 'glass-sealant', label: 'Glass Sealant', price: 95, laborHours: 0.5 },
    { id: 'trim-restoration', label: 'Trim Restoration', price: 165, laborHours: 1 },
    { id: 'interior-protectant', label: 'Interior Protectant', price: 120, laborHours: 0.75 },
    { id: 'wheel-ceramic-coating', label: 'Wheel Ceramic Coating', price: 350, laborHours: 2 },
    { id: 'paint-sealant', label: 'Paint Sealant', price: 275, laborHours: 1.5 },
  ],

  // ─────────────────────────────────────────────────────────────────────
  // TRAVEL — miles included at no charge, then a per-mile rate beyond that.
  // ─────────────────────────────────────────────────────────────────────
  travel: {
    freeMiles: 15,
    pricePerMile: 3.5,
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
  // LABOR — reference hourly rate plus rules for suggested crew size and
  // rounding of the estimated appointment length.
  // ─────────────────────────────────────────────────────────────────────
  labor: {
    ratePerHour: 95,
    teamSizeThresholds: [
      { maxLaborHours: 3, teamSize: 1, label: 'Solo Detailer' },
      { maxLaborHours: 7, teamSize: 2, label: 'Two-Person Team' },
      { maxLaborHours: 12, teamSize: 3, label: 'Three-Person Team' },
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
}
