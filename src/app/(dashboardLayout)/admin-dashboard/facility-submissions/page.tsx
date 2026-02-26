"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Upload, Trash2, ExternalLink } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { toCSV, downloadFile, parseCSV } from "@/lib/csv-utils";
import AdminAddFacilityModal from "@/components/dashboard/adminDashboard/AdminAddFacilityModal";
import AdminEditFacilityModal from "@/components/dashboard/adminDashboard/AdminEditFacilityModal";

type Submission = {
  id: string;
  facilityName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string | null;
  website: string | null;
  description: string;
  amenities: string[];
  hours?: string | null;
  facilityType?: string | null;
  imageUrl?: string | null;
  status: string;
  slug: string | null;
  createdAt: string;
};

export default function AdminFacilitySubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [liveFacilities, setLiveFacilities] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchLiveFacilities = () => {
    setLiveLoading(true);
    fetch("/api/admin/facility-submissions?status=approved")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setLiveFacilities(data.submissions ?? []);
      })
      .catch(() => setLiveFacilities([]))
      .finally(() => setLiveLoading(false));
  };

  const fetchSubmissions = () => {
    setLoading(true);
    fetch(`/api/admin/facility-submissions?status=${statusFilter}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setSubmissions(data.submissions ?? []);
      })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchSubmissions());
  }, [statusFilter]);

  useEffect(() => {
    void Promise.resolve().then(() => fetchLiveFacilities());
  }, []);

  const handleExport = () => {
    const rows = submissions.map((s) => ({
      ...s,
      amenities: Array.isArray(s.amenities) ? s.amenities.join("; ") : "",
    }));
    const csv = toCSV(rows as unknown as Record<string, unknown>[], [
      { key: "facilityName", label: "Training Name" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "zipCode", label: "Zip Code" },
      { key: "phone", label: "Phone" },
      { key: "website", label: "Website" },
      { key: "description", label: "Description" },
      { key: "amenities", label: "Amenities" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Created At" },
    ]);
    downloadFile(csv, `training-submissions-export-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImportClick = () => fileInputRef.current?.click();
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length === 0) {
      toast.error("No valid rows. Use template for correct format.");
      e.target.value = "";
      return;
    }
    /** Parse combined address "123 Main St, Minneapolis, MN 55401" into street, city, zip */
    const parseCombinedAddress = (full: string): { address: string; city: string; zipCode: string } => {
      const trimmed = full.trim();
      if (!trimmed) return { address: "", city: "", zipCode: "" };
      const zipMatch = trimmed.match(/,?\s*(\d{5}(?:-\d{4})?)\s*$/);
      const zipCode = zipMatch ? zipMatch[1].trim() : "";
      const rest = zipMatch ? trimmed.slice(0, zipMatch.index).trim().replace(/,?\s*$/, "") : trimmed;
      const parts = rest.split(",").map((p) => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const street = parts[0];
        const city = parts.length >= 3 && /^[A-Z]{2}$/i.test(parts[parts.length - 1]) ? parts[parts.length - 2] : parts[parts.length - 1];
        return { address: street, city, zipCode };
      }
      return { address: trimmed, city: "", zipCode };
    };

    const payload = rows.map((r) => {
      const norm = (s: string) => s.toLowerCase().replace(/\s/g, "");
      const getVal = (...keys: string[]) => {
        for (const k of keys) {
          const v = r[k];
          if (v != null && String(v).trim()) return String(v).trim();
        }
        for (const [header, val] of Object.entries(r)) {
          if (keys.some((k) => norm(header) === norm(k)) && val != null && String(val).trim()) {
            return String(val).trim();
          }
        }
        return "";
      };
      const facilityName = getVal("facilityName", "Facility Name", "Training Name", "Training", "name", "Name", "Business Name");
      const fullAddress = getVal("address", "Address", "Street", "Street Address", "Street 1", "Address 1", "Full Address");
      const cityOnly = getVal("city", "City");
      const zipOnly = getVal("zipCode", "Zip Code", "zip", "Zip", "Postal Code", "ZIP", "Postal");
      const parsed = fullAddress ? parseCombinedAddress(fullAddress) : { address: "", city: "", zipCode: "" };
      const address = fullAddress; // full "street, city, state zip" goes to address field
      const city = cityOnly || parsed.city;
      const zipCode = zipOnly || parsed.zipCode;
      const description = getVal("description", "Description", "Details", "Notes", "About", "Offerings");
      const amenitiesStr = getVal("amenities", "Amenities", "Services", "Features", "Tags", "Categories", "Offerings") || "";
      return {
        facilityName,
        address,
        city,
        zipCode,
        phone: getVal("phone", "Phone", "Phone Number", "Telephone") || undefined,
        website: getVal("website", "Website", "URL", "Web", "Website URL") || undefined,
        description,
        hours: getVal("hours", "Hours") || undefined,
        amenities: amenitiesStr ? amenitiesStr.split(/[;,]/).map((s) => s.trim()).filter(Boolean) : [],
      };
    }).filter((r) => r.facilityName && r.address && r.city && r.zipCode && r.description);
    if (payload.length === 0) {
      const sample = rows[0];
      const colHint = sample ? `Columns found: ${Object.keys(sample).join(", ")}` : "No columns";
      toast.error(
        `No valid rows. Need: Name, Address (include city & zip if no separate columns), Description/Offerings (10+ chars). ${colHint}. Address format: "street, city, state zip".`
      );
      e.target.value = "";
      return;
    }
    try {
      const res = await fetch("/api/admin/facility-submissions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result?.error ?? "Import failed");
        return;
      }
      toast.success(`Imported ${result.created} training submissions`);
      fetchSubmissions();
    } catch {
      toast.error("Import failed");
    }
    e.target.value = "";
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/facility-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update");
        return;
      }
      toast.success(status === "approved" ? "Approved" : "Rejected");
      fetchSubmissions();
      fetchLiveFacilities();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this training location from the website? It will no longer appear on the public page.")) return;
    try {
      const res = await fetch(`/api/admin/facility-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "removed" }),
      });
      if (!res.ok) {
        toast.error("Failed to remove");
        return;
      }
      toast.success("Training removed from website.");
      fetchLiveFacilities();
      fetchSubmissions();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Training</h1>
        <p className="text-slate-400 mt-1">
          Manage live training locations and review public submissions.
        </p>
      </div>

      {/* Live Facilities */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white">Live on Website</CardTitle>
          <AdminAddFacilityModal onAdded={fetchLiveFacilities} />
        </CardHeader>
        <CardContent>
          {liveLoading ? (
            <p className="text-slate-400">Loading...</p>
          ) : liveFacilities.length === 0 ? (
            <p className="text-slate-500 py-6">No training locations live yet. Add one or approve a submission.</p>
          ) : (
            <div className="space-y-3">
              {liveFacilities.map((f) => (
                <div
                  key={f.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-slate-700/50 border border-slate-600"
                >
                  <div>
                    <span className="font-medium text-white">{f.facilityName}</span>
                    <p className="text-slate-400 text-sm">{f.address}, {f.city} {f.zipCode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {f.slug && (
                      <Link
                        href={`/training/${f.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-amber-400 hover:underline flex items-center gap-1"
                      >
                        View on site <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <AdminEditFacilityModal facility={f} onSaved={fetchLiveFacilities} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleRemove(f.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submissions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white">Submissions</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-700"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportFile}
            />
            <Button
              size="sm"
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-700"
              onClick={handleImportClick}
            >
              <Upload className="w-4 h-4 mr-1" /> Import CSV
            </Button>
            <button
              type="button"
              onClick={() => {
                const template = "facilityName,address,city,zipCode,phone,website,description,amenities\nArctic Ice,123 Main St,Minneapolis,55401,(612)555-0123,https://example.com,Premier ice rink,Real Ice; Synthetic Ice";
                downloadFile(template, "training-submissions-template.csv");
              }}
              className="text-xs text-slate-400 hover:text-white hover:underline"
            >
              Template
            </button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="removed">Removed</SelectItem>
            </SelectContent>
          </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-lg bg-slate-700/50 border border-slate-600"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-white text-lg">
                      {s.facilityName}
                    </span>
                    <Badge
                      variant="secondary"
                      className={
                        s.status === "pending"
                          ? "bg-amber-600"
                          : s.status === "approved"
                            ? "bg-green-600"
                            : s.status === "removed"
                              ? "bg-red-900/50 text-red-300"
                              : "bg-slate-600"
                      }
                    >
                      {s.status}
                    </Badge>
                    <span className="text-slate-500 text-sm">
                      {new Date(s.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    {s.address}, {s.city} {s.zipCode}
                  </p>
                  {s.phone && (
                    <p className="text-slate-400 text-sm">Phone: {s.phone}</p>
                  )}
                  {s.website && (
                    <a
                      href={s.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline text-sm"
                    >
                      {s.website}
                    </a>
                  )}
                  <p className="text-slate-400 text-sm mt-2">{s.description}</p>
                  {s.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.amenities.map((a) => (
                        <Badge key={a} variant="outline" className="border-slate-500 text-slate-400 text-xs">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {s.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(s.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleAction(s.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {submissions.length === 0 && (
                <p className="text-slate-500 py-8">
                  No {statusFilter} submissions.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
