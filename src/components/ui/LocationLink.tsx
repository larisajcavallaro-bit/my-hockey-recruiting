"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

/**
 * Displays a location/address as a clickable link to Google Maps.
 * Use for full addresses that should open in Google Maps when clicked.
 */
export function LocationLink({
  address,
  className = "",
  showIcon = true,
}: {
  address: string;
  className?: string;
  showIcon?: boolean;
}) {
  if (!address?.trim()) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.trim()
  )}`;

  return (
    <Link
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline ${className}`}
    >
      {showIcon && <MapPin className="w-4 h-4 shrink-0" />}
      <span>{address}</span>
    </Link>
  );
}
