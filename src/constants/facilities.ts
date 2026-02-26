/**
 * Official categories for the Training page.
 * Use this as the source of truth for filters, add training form, and any
 * training-related dropdowns or tags.
 *
 * Reference: List for Training Page (MHR Documents)
 */
export const FACILITY_CATEGORIES = [
  "Real Ice",
  "Synthetic Ice",
  "Shooting Skills",
  "Skating (Edgework)",
  "Skating (Power)",
  "Stick Handling",
  "Goalie Training",
  "Treadmill",
  "Off Ice",
] as const;

export type FacilityCategory = (typeof FACILITY_CATEGORIES)[number];
