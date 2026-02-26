"use client";

import { FC } from "react";

const iconBase = "w-6 h-6 text-gray-700 shrink-0";

/** Free – single profile, minimal entry */
export const FreeTierIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? iconBase}
    aria-hidden
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

/** Gold – badge/shield, credibility */
export const GoldTierIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? iconBase}
    aria-hidden
  >
    <path d="M12 2L4 6v6c0 5.5 3.8 9.5 8 11 4.2-1.5 8-5.5 8-11V6l-8-4z" />
  </svg>
);

/** Elite – diamond, premium tier */
export const EliteTierIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? iconBase}
    aria-hidden
  >
    <path d="M12 2l6 8-6 12-6-12 6-8z" />
  </svg>
);

/** Family Gold – same shield as Gold, family plan */
export const FamilyGoldTierIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? iconBase}
    aria-hidden
  >
    <path d="M12 2L4 6v6c0 5.5 3.8 9.5 8 11 4.2-1.5 8-5.5 8-11V6l-8-4z" />
  </svg>
);

/** Family Elite – same diamond as Elite, family plan */
export const FamilyEliteTierIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? iconBase}
    aria-hidden
  >
    <path d="M12 2l6 8-6 12-6-12 6-8z" />
  </svg>
);
