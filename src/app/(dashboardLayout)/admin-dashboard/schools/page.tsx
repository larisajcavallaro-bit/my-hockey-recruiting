"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import AdminAddSchoolModal from "@/components/dashboard/adminDashboard/AdminAddSchoolModal";
import AdminEditSchoolModal from "@/components/dashboard/adminDashboard/AdminEditSchoolModal";

type School = {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string | null;
  website: string | null;
  description: string;
  imageUrl?: string | null;
  gender: string[];
  league: string[];
  ageBracketFrom: string | null;
  ageBracketTo: string | null;
  status: string;
  slug: string | null;
};

export default function AdminSchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = () => {
    setLoading(true);
    fetch("/api/admin/schools?status=approved")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setSchools(data.schools ?? []);
      })
      .catch(() => setSchools([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchSchools());
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the Teams and Schools page? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/schools/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error ?? "Failed to delete");
        return;
      }
      toast.success("School removed.");
      fetchSchools();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Schools & Programs</h1>
        <p className="text-slate-400 mt-1">
          Add and manage schools and programs on the Teams and Schools page.
        </p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white">Live on Website</CardTitle>
          <AdminAddSchoolModal onAdded={fetchSchools} />
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : schools.length === 0 ? (
            <p className="text-slate-500 py-6">
              No schools or programs yet. Click &quot;Add School&quot; to create one.
            </p>
          ) : (
            <div className="space-y-3">
              {schools.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-slate-700/50 border border-slate-600"
                >
                  <div>
                    <span className="font-medium text-white">{s.name}</span>
                    <p className="text-slate-400 text-sm">
                      {s.address}, {s.city} {s.zipCode}
                    </p>
                    {(s.league || s.gender?.length) && (
                      <p className="text-slate-500 text-xs mt-1">
                        {[(Array.isArray(s.league) ? s.league.join(", ") : s.league), s.gender?.join(", ")].filter(Boolean).join(" · ")}
                        {s.ageBracketFrom && s.ageBracketTo && (
                          <> · {s.ageBracketFrom}–{s.ageBracketTo}</>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {s.slug && (
                      <Link
                        href={`/teams-and-schools/${s.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-300 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" /> View
                        </Button>
                      </Link>
                    )}
                    <AdminEditSchoolModal school={s} onSaved={fetchSchools} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={() => handleDelete(s.id, s.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
