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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { toCSV, downloadFile } from "@/lib/csv-utils";

type DisputeMsg = { id: string; authorType: string; message: string; createdAt: string };

type Dispute = {
  type: "coach" | "player";
  id: string;
  reviewId: string;
  reason: string | null;
  status: string;
  createdAt: string;
  review: { text: string; rating: number; author: string };
  messages?: DisputeMsg[];
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [submittingKey, setSubmittingKey] = useState<string | null>(null);

  const fetchDisputes = () => {
    setLoading(true);
    fetch(`/api/admin/disputes?status=${statusFilter}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setDisputes(data.disputes ?? []);
      })
      .catch(() => setDisputes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchDisputes());
  }, [statusFilter]);

  const handleExport = () => {
    const rows = disputes.map((d) => ({
      type: d.type,
      id: d.id,
      reviewId: d.reviewId,
      reason: d.reason ?? "",
      status: d.status,
      reviewText: d.review?.text ?? "",
      rating: d.review?.rating ?? "",
      author: d.review?.author ?? "",
      createdAt: d.createdAt,
    }));
    const csv = toCSV(rows as unknown as Record<string, unknown>[], [
      { key: "type", label: "Type" },
      { key: "id", label: "ID" },
      { key: "status", label: "Status" },
      { key: "reason", label: "Reason" },
      { key: "reviewText", label: "Review Text" },
      { key: "author", label: "Author" },
      { key: "rating", label: "Rating" },
      { key: "createdAt", label: "Created At" },
    ]);
    downloadFile(csv, `disputes-export-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleResolve = async (type: string, id: string, status: "resolved" | "dismissed") => {
    const base = type === "coach"
      ? `/api/admin/disputes/coach/${id}`
      : `/api/admin/disputes/player/${id}`;
    try {
      const res = await fetch(base, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update");
        return;
      }
      toast.success(status === "resolved" ? "Resolved" : "Dismissed");
      fetchDisputes();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleReply = async (type: string, id: string) => {
    const key = `${type}-${id}`;
    const text = (replyText[key] ?? "").trim();
    if (!text) {
      toast.error("Enter a message");
      return;
    }
    setSubmittingKey(key);
    try {
      const res = await fetch(`/api/admin/disputes/${type}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error ?? "Failed to send");
        return;
      }
      const data = await res.json();
      setDisputes((prev) =>
        prev.map((d) =>
          d.type === type && d.id === id
            ? { ...d, messages: [...(d.messages ?? []), data.reply] }
            : d
        )
      );
      setReplyText((prev) => ({ ...prev, [key]: "" }));
      toast.success("Reply sent");
    } catch {
      toast.error("Failed to send");
    } finally {
      setSubmittingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Review Disputes</h1>
        <p className="text-slate-400 mt-1">
          Coach and parent disputes on reviews. Message back and forth, then resolve or dismiss.
        </p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white">Disputes</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-700"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              {disputes.map((d) => {
                const key = `${d.type}-${d.id}`;
                const isExpanded = expandedKey === key;
                const msgs = d.messages ?? [];
                return (
                  <div
                    key={key}
                    className="rounded-lg bg-slate-700/50 border border-slate-600 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedKey(isExpanded ? null : key)}
                      className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge
                          className={
                            d.type === "coach" ? "bg-blue-600" : "bg-green-600"
                          }
                        >
                          {d.type === "coach" ? "Coach" : "Player"} dispute
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={
                            d.status === "pending"
                              ? "bg-amber-600"
                              : d.status === "resolved"
                                ? "bg-green-600"
                                : "bg-slate-600"
                          }
                        >
                          {d.status}
                        </Badge>
                        {msgs.length > 0 && (
                          <Badge className="bg-amber-600/80">
                            {msgs.length} repl{msgs.length === 1 ? "y" : "ies"}
                          </Badge>
                        )}
                        <span className="text-slate-500 text-sm">
                          {new Date(d.createdAt).toLocaleString()}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                        )}
                      </div>
                      <p className="text-slate-300 text-sm mb-1">
                        <strong>Review:</strong> &ldquo;{d.review.text}&rdquo;
                      </p>
                      <p className="text-slate-400 text-xs mb-2">
                        By {d.review.author} — {d.review.rating}/5 stars
                      </p>
                      {d.reason && (
                        <p className="text-amber-200 text-sm">
                          <strong>Reason:</strong> {d.reason}
                        </p>
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-slate-600">
                        {msgs.length > 0 && (
                          <div className="space-y-3 mb-4 mt-3">
                            {msgs.map((r) => (
                              <div
                                key={r.id}
                                className={`p-3 rounded-lg text-sm ${
                                  r.authorType === "admin"
                                    ? "bg-amber-900/30 border border-amber-700/50 ml-4"
                                    : "bg-slate-600/50 border border-slate-500 mr-4"
                                }`}
                              >
                                <span className="text-slate-400 text-xs">
                                  {r.authorType === "admin" ? "You" : "Disputant"} ·{" "}
                                  {new Date(r.createdAt).toLocaleString()}
                                </span>
                                <p className="text-slate-200 mt-1 whitespace-pre-wrap">
                                  {r.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 mb-4">
                          <Textarea
                            placeholder="Type your reply…"
                            value={replyText[key] ?? ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                            className="min-h-[80px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                            rows={3}
                          />
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 shrink-0 self-end"
                            onClick={() => handleReply(d.type, d.id)}
                            disabled={submittingKey === key}
                          >
                            {submittingKey === key ? "Sending…" : "Send Reply"}
                          </Button>
                        </div>
                        {d.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleResolve(d.type, d.id, "resolved")}
                            >
                              Resolve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-500 text-slate-300"
                              onClick={() => handleResolve(d.type, d.id, "dismissed")}
                            >
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {disputes.length === 0 && (
                <p className="text-slate-500 py-8">
                  No {statusFilter} disputes.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
