"use client";

import { useState, useEffect } from "react";

/** Fetch lookup values for a category (area, birth_year, position, gender, event_type, venue) */
export function useLookupOptions(category: string): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!category) return;
    fetch(`/api/lookups?category=${category}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setOptions(data.lookups ?? []))
      .catch(() => setOptions([]));
  }, [category]);

  return options;
}

/** Fetch leagues from API */
export function useLeagueOptions(): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/leagues?limit=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => (data.leagues ?? []).map((l: { name: string }) => l.name))
      .catch(() => [])
      .then(setOptions);
  }, []);

  return options;
}

/** Fetch levels from API */
export function useLevelOptions(): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/levels?limit=100", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => (data.levels ?? []).map((l: { name: string }) => l.name))
      .catch(() => [])
      .then(setOptions);
  }, []);

  return options;
}

/** Fetch teams from API */
export function useTeamOptions(): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/teams?limit=200", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => (data.teams ?? []).map((t: { name: string }) => t.name))
      .catch(() => [])
      .then(setOptions);
  }, []);

  return options;
}
