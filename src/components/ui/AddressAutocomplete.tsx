"use client";

import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: typeof google;
    initGoogleMaps?: () => void;
  }
}

interface AddressAutocompleteProps {
  defaultValue?: string;
  onChange?: (address: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function AddressAutocomplete({
  defaultValue = "",
  onChange,
  placeholder = "Start typing an address...",
  className = "",
  id = "address-autocomplete",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    const existing = document.getElementById("google-maps-script");
    if (existing) {
      if (window.google?.maps?.places) {
        setIsLoaded(true);
      } else {
        (existing as HTMLScriptElement).addEventListener("load", () =>
          setIsLoaded(true)
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      autocompleteRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps?.places) return;

    const input = inputRef.current;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ["address"],
      fields: ["formatted_address", "name", "address_components"],
    });

    autocompleteRef.current = autocomplete;
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || "";
      if (address && onChange) onChange(address);
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded, onChange]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={className}
      autoComplete="off"
    />
  );
}
