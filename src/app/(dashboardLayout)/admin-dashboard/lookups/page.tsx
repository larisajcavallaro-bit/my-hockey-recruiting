"use client";

import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Pencil, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { toCSV, downloadFile, parseCSV } from "@/lib/csv-utils";

const HIERARCHY_CATEGORIES = [
  { value: "league", label: "League" },
  { value: "level", label: "Level" },
  { value: "team", label: "Team" },
] as const;

const FLAT_CATEGORIES = [
  { value: "coach_title", label: "Coach Title" },
  { value: "birth_year", label: "Birth Year" },
  { value: "coach_specialty", label: "Coach Specialty" },
  { value: "area", label: "Area (Location)" },
  { value: "position", label: "Position" },
  { value: "gender", label: "Gender" },
  { value: "event_type", label: "Event Type" },
  { value: "venue", label: "Venue" },
] as const;

type Lookup = { id: string; category: string; value: string; sortOrder: number };

export default function AdminLookupsPage() {
  const [tab, setTab] = useState<"league_level_team" | "flat">("league_level_team");
  const [hierCategory, setHierCategory] = useState<(typeof HIERARCHY_CATEGORIES)[number]["value"]>("league");
  const [hierLookups, setHierLookups] = useState<Lookup[]>([]);
  const [hierLoading, setHierLoading] = useState(false);
  const [newHierValue, setNewHierValue] = useState("");
  const [addingHier, setAddingHier] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [uploading, setUploading] = useState(false);

  const [flatCategory, setFlatCategory] = useState<string>("coach_title");
  const [flatLookups, setFlatLookups] = useState<Lookup[]>([]);
  const [flatLoading, setFlatLoading] = useState(false);
  const [newFlatValue, setNewFlatValue] = useState("");
  const [addingFlat, setAddingFlat] = useState(false);
  const [editingFlatId, setEditingFlatId] = useState<string | null>(null);
  const [editFlatValue, setEditFlatValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchHierLookups = () => {
    setHierLoading(true);
    fetch(`/api/admin/lookups?category=${hierCategory}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setHierLookups(data.lookups ?? []))
      .catch(() => setHierLookups([]))
      .finally(() => setHierLoading(false));
  };

  useEffect(() => {
    if (tab === "league_level_team") void Promise.resolve().then(() => fetchHierLookups());
  }, [tab, hierCategory]);

  const fetchFlatLookups = () => {
    setFlatLoading(true);
    fetch(`/api/admin/lookups?category=${flatCategory}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setFlatLookups(data.lookups ?? []))
      .catch(() => setFlatLookups([]))
      .finally(() => setFlatLoading(false));
  };

  useEffect(() => {
    if (tab === "flat") void Promise.resolve().then(() => fetchFlatLookups());
  }, [tab, flatCategory]);

  const handleAddHier = async () => {
    const val = newHierValue.trim();
    if (!val) {
      toast.error("Enter a value");
      return;
    }
    setAddingHier(true);
    try {
      const res = await fetch("/api/admin/lookups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: hierCategory, value: val }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Failed");
        return;
      }
      toast.success("Added");
      setNewHierValue("");
      fetchHierLookups();
    } catch {
      toast.error("Failed");
    } finally {
      setAddingHier(false);
    }
  };

  const handleUpdateHier = () => {
    const val = editValue.trim();
    if (!val || !editingId) return;
    fetch(`/api/admin/lookups/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: val }),
    })
      .then((r) => {
        if (r.ok) {
          toast.success("Updated");
          setEditingId(null);
          fetchHierLookups();
        } else toast.error("Failed");
      })
      .catch(() => toast.error("Failed"));
  };

  const handleDeleteHier = (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    fetch(`/api/admin/lookups/${id}`, { method: "DELETE" })
      .then((r) => {
        if (r.ok) {
          toast.success("Deleted");
          fetchHierLookups();
        } else toast.error("Failed");
      })
      .catch(() => toast.error("Failed"));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) {
        toast.error("No valid rows. CSV should have League, Level, Team columns.");
        return;
      }
      const res = await fetch("/api/admin/lookups/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows, format: "league_level_team" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Import failed");
        return;
      }
      const { created, errors } = data;
      if (created) toast.success(`Imported ${created} items`);
      if (errors?.length) toast.error(`${errors.length} error(s)`);
      fetchHierLookups();
    } catch {
      toast.error("Failed to import");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleExportHier = () => {
    const leagueRows = (hierLookups.length ? hierLookups : [])
      .filter((l) => l.category === hierCategory)
      .map((l) => ({ [HIERARCHY_CATEGORIES.find((c) => c.value === hierCategory)!.label]: l.value }));
    if (leagueRows.length === 0) {
      toast.error("No data to export");
      return;
    }
    const key = HIERARCHY_CATEGORIES.find((c) => c.value === hierCategory)!.label;
    const csv = toCSV(leagueRows as unknown as Record<string, unknown>[], [{ key, label: key }]);
    downloadFile(csv, `${hierCategory}-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleAddFlat = async () => {
    const val = newFlatValue.trim();
    if (!val) {
      toast.error("Enter a value");
      return;
    }
    setAddingFlat(true);
    try {
      const res = await fetch("/api/admin/lookups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: flatCategory, value: val }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error ?? "Failed");
        return;
      }
      toast.success("Added");
      setNewFlatValue("");
      fetchFlatLookups();
    } catch {
      toast.error("Failed");
    } finally {
      setAddingFlat(false);
    }
  };

  const handleUpdateFlat = async (id: string) => {
    const val = editFlatValue.trim();
    if (!val) return;
    const res = await fetch(`/api/admin/lookups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: val }),
    });
    if (!res.ok) {
      toast.error("Failed");
      return;
    }
    toast.success("Updated");
    setEditingFlatId(null);
    fetchFlatLookups();
  };

  const handleDeleteFlat = async (id: string) => {
    if (!window.confirm("Delete this lookup?")) return;
    const res = await fetch(`/api/admin/lookups/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Failed");
      return;
    }
    toast.success("Deleted");
    fetchFlatLookups();
  };

  const handleExportFlat = async () => {
    const res = await fetch("/api/admin/lookups");
    const data = await res.json();
    const all = data.lookups ?? [];
    const csv = toCSV(all as unknown as Record<string, unknown>[], [
      { key: "category", label: "Category" },
      { key: "value", label: "Value" },
      { key: "sortOrder", label: "Sort Order" },
    ]);
    downloadFile(csv, `lookups-export-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const currentHierLookups = hierLookups.filter((l) => l.category === hierCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Management</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage League, Level, and Team lists (typeahead search). Plus Coach Title, Birth Year, etc.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={tab === "league_level_team" ? "default" : "outline"}
          onClick={() => setTab("league_level_team")}
          className={tab === "league_level_team" ? "bg-amber-600 hover:bg-amber-700" : "border-slate-600 text-slate-300"}
        >
          League / Level / Team
        </Button>
        <Button
          variant={tab === "flat" ? "default" : "outline"}
          onClick={() => setTab("flat")}
          className={tab === "flat" ? "bg-amber-600 hover:bg-amber-700" : "border-slate-600 text-slate-300"}
        >
          Coach Title, Birth Year, etc.
        </Button>
        <Button size="sm" variant="outline" className="border-slate-500 text-slate-300 ml-auto" onClick={tab === "league_level_team" ? handleExportHier : handleExportFlat}>
          <Download className="w-4 h-4 mr-1" /> Export
        </Button>
      </div>

      {tab === "league_level_team" ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">League / Level / Team</CardTitle>
            <p className="text-slate-400 text-sm">
              Three flat lists. Users type to search instead of scrolling long dropdowns. Upload CSV with League, Level, Team columns to bulk add.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              <Select value={hierCategory} onValueChange={(v) => setHierCategory(v as typeof hierCategory)}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HIERARCHY_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleUpload} />
              <Button size="sm" variant="outline" className="border-slate-500 text-slate-300" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-1" /> {uploading ? "Importing…" : "Upload CSV"}
              </Button>
            </div>

            <div>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder={`New ${hierCategory} name`}
                  value={newHierValue}
                  onChange={(e) => setNewHierValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddHier()}
                  className="max-w-xs bg-slate-700 border-slate-600 text-white"
                />
                <Button onClick={handleAddHier} disabled={addingHier} className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hierLoading ? (
                  <p className="text-slate-400">Loading...</p>
                ) : currentHierLookups.length === 0 ? (
                  <p className="text-slate-500">No {hierCategory}s yet. Add one above or upload CSV.</p>
                ) : (
                  currentHierLookups.map((l) => (
                    <div key={l.id} className="flex items-center gap-1 rounded-lg bg-slate-700/50 px-2 py-1.5">
                      {editingId === l.id ? (
                        <>
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8 w-32 bg-slate-700 border-slate-600 text-white text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleUpdateHier();
                              if (e.key === "Escape") setEditingId(null);
                            }}
                          />
                          <Button size="sm" variant="ghost" className="h-7 text-green-400" onClick={handleUpdateHier}>Save</Button>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-white">{l.value}</span>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400" onClick={() => { setEditingId(l.id); setEditValue(l.value); }}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400" onClick={() => handleDeleteHier(l.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white">Other Options</CardTitle>
              <Select value={flatCategory} onValueChange={setFlatCategory}>
                <SelectTrigger className="w-full max-w-xs mt-2 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLAT_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New value"
                value={newFlatValue}
                onChange={(e) => setNewFlatValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddFlat()}
                className="max-w-xs bg-slate-700 border-slate-600 text-white"
              />
              <Button onClick={handleAddFlat} disabled={addingFlat} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            {flatLoading ? (
              <p className="text-slate-400">Loading...</p>
            ) : (
              <ul className="space-y-2">
                {flatLookups.map((l) => (
                  <li key={l.id} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-700/50">
                    {editingFlatId === l.id ? (
                      <>
                        <Input
                          value={editFlatValue}
                          onChange={(e) => setEditFlatValue(e.target.value)}
                          className="flex-1 bg-slate-700 border-slate-600 text-white"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateFlat(l.id);
                            if (e.key === "Escape") setEditingFlatId(null);
                          }}
                        />
                        <Button size="sm" variant="ghost" className="text-green-400" onClick={() => handleUpdateFlat(l.id)}>Save</Button>
                        <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => setEditingFlatId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-white">{l.value}</span>
                        <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => { setEditingFlatId(l.id); setEditFlatValue(l.value); }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-400" onClick={() => handleDeleteFlat(l.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
                {flatLookups.length === 0 && <p className="text-slate-500 py-4">No values yet. Add one above.</p>}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
