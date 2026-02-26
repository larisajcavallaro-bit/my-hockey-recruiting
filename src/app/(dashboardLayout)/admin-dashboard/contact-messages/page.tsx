"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { toCSV, downloadFile } from "@/lib/csv-utils";

const TOPIC_LABELS: Record<string, string> = {
  "coach-verification": "Coach verification",
  "info-correction": "Info correction",
  "head-coach-dispute": "Head coach dispute",
  "visibility-access": "Profile visibility",
  "event-rsvp": "Event/RSVP",
  "billing-account": "Billing/account",
  other: "Other",
};

type Reply = {
  id: string;
  authorType: string;
  message: string;
  createdAt: string;
};

type Message = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
  userId?: string | null;
  replies: Reply[];
};

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchMessages = () => {
    fetch("/api/admin/contact-messages?limit=9999")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setMessages(data.messages ?? []);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleExport = () => {
    const rows = messages.map((m) => ({
      ...m,
      replies: m.replies?.length ?? 0,
    }));
    const csv = toCSV(rows as unknown as Record<string, unknown>[], [
      { key: "firstName", label: "First Name" },
      { key: "lastName", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "topic", label: "Topic" },
      { key: "message", label: "Message" },
      { key: "createdAt", label: "Date" },
    ]);
    downloadFile(csv, `contact-messages-export-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleReply = async (id: string) => {
    const text = (replyText[id] ?? "").trim();
    if (!text) {
      toast.error("Enter a message");
      return;
    }
    setSubmittingId(id);
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
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
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                replies: [...(m.replies ?? []), data.reply],
              }
            : m
        )
      );
      setReplyText((prev) => ({ ...prev, [id]: "" }));
      toast.success("Reply sent");
    } catch {
      toast.error("Failed to send");
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-slate-400 mt-1">
          Messages from the Contact Us form. Reply here—no outside email needed.
        </p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">
            All Messages ({messages.length})
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-500 text-slate-300 hover:bg-slate-700"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const isExpanded = expandedId === m.id;
                const replies = m.replies ?? [];
                return (
                  <div
                    key={m.id}
                    className="rounded-lg bg-slate-700/50 border border-slate-600 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-medium text-white">
                          {m.firstName} {m.lastName}
                        </span>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-amber-400 hover:underline text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {m.email}
                        </a>
                        <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                          {TOPIC_LABELS[m.topic] ?? m.topic}
                        </Badge>
                        {replies.length > 0 && (
                          <Badge className="bg-amber-600/80">
                            {replies.length} repl{replies.length === 1 ? "y" : "ies"}
                          </Badge>
                        )}
                        <span className="text-slate-500 text-sm">
                          {new Date(m.createdAt).toLocaleString()}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                        )}
                      </div>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-2">
                        {m.message}
                      </p>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-slate-600">
                        <p className="text-slate-300 text-sm whitespace-pre-wrap mt-3 mb-4">
                          {m.message}
                        </p>
                        {replies.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {replies.map((r) => (
                              <div
                                key={r.id}
                                className={`p-3 rounded-lg text-sm ${
                                  r.authorType === "admin"
                                    ? "bg-amber-900/30 border border-amber-700/50 ml-4"
                                    : "bg-slate-600/50 border border-slate-500 mr-4"
                                }`}
                              >
                                <span className="text-slate-400 text-xs">
                                  {r.authorType === "admin" ? "You" : "User"} ·{" "}
                                  {new Date(r.createdAt).toLocaleString()}
                                </span>
                                <p className="text-slate-200 mt-1 whitespace-pre-wrap">
                                  {r.message}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your reply…"
                            value={replyText[m.id] ?? ""}
                            onChange={(e) =>
                              setReplyText((prev) => ({ ...prev, [m.id]: e.target.value }))
                            }
                            className="min-h-[80px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                            rows={3}
                          />
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 shrink-0 self-end"
                            onClick={() => handleReply(m.id)}
                            disabled={submittingId === m.id}
                          >
                            {submittingId === m.id ? "Sending…" : "Send Reply"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {messages.length === 0 && (
                <p className="text-slate-500 py-8">No contact messages yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
