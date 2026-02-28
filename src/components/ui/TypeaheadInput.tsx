"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TypeaheadInputProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  /** API URL - {q} is replaced with search query. e.g. /api/teams?q={q} */
  fetchUrl: string;
  value: string;
  onChange: (value: string) => void;
  /** Key in response for the list of options. e.g. "teams" -> data.teams */
  itemsKey: "leagues" | "levels" | "teams";
  /** Key for display name in each item. e.g. "name" */
  itemLabel?: string;
  placeholder?: string;
  className?: string;
  /** Override dropdown list styles (e.g. for dark backgrounds: "bg-slate-800 text-white border-slate-600") */
  dropdownClassName?: string;
  /** Min chars before fetching (default 0 = fetch on focus) */
  minChars?: number;
  /** Debounce ms (default 200) */
  debounceMs?: number;
}

export function TypeaheadInput({
  fetchUrl,
  value,
  onChange,
  itemsKey,
  itemLabel = "name",
  placeholder = "Type to search...",
  className,
  dropdownClassName,
  minChars = 0,
  debounceMs = 200,
  ...inputProps
}: TypeaheadInputProps) {
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchOptions = useCallback(
    async (q: string) => {
      const url = fetchUrl.replace("{q}", encodeURIComponent(q));
      setLoading(true);
      try {
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        const items = data[itemsKey] ?? [];
        setOptions(Array.isArray(items) ? items : []);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl, itemsKey]
  );

  useEffect(() => {
    const handle = () => {
      if (value.length >= minChars) fetchOptions(value);
      else setOptions([]);
    };
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(handle, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, minChars, debounceMs, fetchOptions]);

  const handleFocus = () => {
    setOpen(true);
    if (value.length >= minChars && options.length === 0 && !loading) fetchOptions(value);
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 150);
  };

  const handleSelect = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        {...inputProps}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(className)}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open && (options.length > 0 || loading) && (
        <ul
          className={cn(
            "absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white",
            dropdownClassName
          )}
          role="listbox"
        >
          {loading ? (
            <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">Loading…</li>
          ) : (
            options.map((item) => (
              <li
                key={item.id}
                role="option"
                aria-selected="false"
                className="cursor-pointer px-3 py-2 text-sm text-inherit hover:bg-slate-100 dark:hover:bg-slate-700"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item[itemLabel as keyof typeof item] as string);
                }}
              >
                {item[itemLabel as keyof typeof item]}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
