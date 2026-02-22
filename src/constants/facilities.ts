/**
 * Official facility/training categories for the Facilities page.
 * Use this as the source of truth for filters, add facility form, and any
 * facility-related dropdowns or tags.
 *
 * Reference: List for Facilities Page (MHR Documents)
 */
export const FACILITY_CATEGORIES = [
  "Real Ice",
  "Synthetic Ice",
  "Shooting Skills",
  "Skating (Edgework)",
  "Skating (Power)",
  "Stick Handling",
  "App",
  "At Home Trainer",
  "Tournament Teams",
  "Goalie Training",
] as const;

export type FacilityCategory = (typeof FACILITY_CATEGORIES)[number];
