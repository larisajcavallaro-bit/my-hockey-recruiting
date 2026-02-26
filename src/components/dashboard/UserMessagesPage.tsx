"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { notifyMessagesMarkedRead } from "@/hooks/useUnreadContactCount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

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
  topic: string;
  message: string;
  createdAt: string;
  replies: Reply[];
};

type DisputeMsg = { id: string; authorType: string; message: string; createdAt: string };
type Dispute = {
  type: "coach" | "player";
  id: string;
  reason: string | null;
  status: string;
  createdAt: string;
  review: { text: string; rating: number; author: string; player?: { name: string } };
  messages: DisputeMsg[];
};

const CONTACT_TOPICS = [
  { value: "coach-verification", label: "Coach credential or verification issue" },
  { value: "info-correction", label: "Missing or incorrect team, league, or level information" },
  { value: "head-coach-dispute", label: "Head coach dispute" },
  { value: "visibility-access", label: "Profile visibility or access question" },
  { value: "event-rsvp", label: "Event or RSVP issue" },
  { value: "billing-account", label: "Account or billing question" },
  { value: "other", label: "Other" },
] as const;

export default function UserMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDispute, setExpandedDispute] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [submittingNew, setSubmittingNew] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/messages").then((r) => r.json()),
      fetch("/api/disputes").then((r) => r.json()),
    ]).then(([msgData, dispData]) => {
      if (!msgData.error) setMessages(msgData.messages ?? []);
      if (!dispData.error) setDisputes(dispData.disputes ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetch("/api/messages/mark-read", { method: "POST" })
      .then(() => notifyMessagesMarkedRead())
      .catch(() => {});
  }, []);

  const handleReply = async (id: string) => {
    const text = (replyText[id] ?? "").trim();
    if (!text) {
      toast.error("Enter a message");
      return;
    }
    setSubmittingId(id);
    try {
      const res = await fetch(`/api/messages/${id}/reply`, {
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
            ? { ...m, replies: [...(m.replies ?? []), data.reply] }
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

  const handleNewContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim() || !newMessage.trim()) {
      toast.error("Select a topic and enter your message");
      return;
    }
    if (newMessage.trim().length < 10) {
      toast.error("Message should be at least 10 characters");
      return;
    }
    const name = (session?.user as { name?: string | null })?.name ?? "";
    const parts = name.trim().split(/\s+/);
    const firstName = parts[0] ?? "User";
    const lastName = parts.slice(1).join(" ") || "Account";
    const email = (session?.user as { email?: string | null })?.email ?? "";
    if (!email) {
      toast.error("Your account has no email on file");
      return;
    }
    setSubmittingNew(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          topic: newTopic,
          message: newMessage.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = data?.error ?? (typeof data?.details === "string" ? data.details : "Failed to send");
        toast.error(errMsg);
        return;
      }
      toast.success("Message sent. We'll reply here shortly.");
      setNewTopic("");
      setNewMessage("");
      fetchAll();
    } catch {
      toast.error("Failed to send");
    } finally {
      setSubmittingNew(false);
    }
  };

  const handleDisputeReply = async (type: string, id: string) => {
    const key = `${type}-${id}`;
    const text = (replyText[key] ?? "").trim();
    if (!text) {
      toast.error("Enter a message");
      return;
    }
    setSubmittingId(key);
    try {
      const res = await fetch(`/api/disputes/${type}/${id}/reply`, {
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
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Contact Us</h1>
        <p className="text-black mt-1">
          Your conversations with support. Contact threads and review dispute threads.
        </p>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="contact" className="data-[state=active]:bg-amber-600">
            Contact ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="disputes" className="data-[state=active]:bg-amber-600">
            Review Disputes ({disputes.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="contact" className="mt-4 space-y-4">
      {/* Embedded contact form */}
      <Card className="bg-slate-800/50 border-slate-700 border-amber-600/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5" />
            New message
          </CardTitle>
          <p className="text-slate-400 text-sm font-normal">Send a message to support. We&apos;ll reply here.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewContact} className="space-y-4">
            <div>
              <Label htmlFor="new-topic" className="text-slate-300">Topic</Label>
              <Select value={newTopic} onValueChange={setNewTopic}>
                <SelectTrigger
                  id="new-topic"
                  className="mt-1.5 w-full bg-slate-800 border-slate-600 text-white data-[placeholder]:!text-white"
                >
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent
                  className="z-[70] bg-white text-black"
                  align="end"
                  alignOffset={8}
                  collisionPadding={{ left: 300 }}
                >
                  {CONTACT_TOPICS.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="text-black focus:bg-slate-100 focus:text-black"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="new-message" className="text-slate-300">Message</Label>
              <Textarea
                id="new-message"
                placeholder="Describe your question or issue…"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                minLength={10}
                required
                className="mt-1.5 min-h-[100px] bg-slate-800 border-slate-600 text-white placeholder:text-white"
              />
            </div>
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700"
              disabled={submittingNew}
            >
              {submittingNew ? "Sending…" : "Send message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Your contact threads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="text-slate-500 py-8">
              No messages yet. Use the form above to start a conversation.
            </p>
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
                      onClick={() => {
                        const nextId = isExpanded ? null : m.id;
                        setExpandedId(nextId);
                        if (nextId) {
                          fetch("/api/messages/mark-read", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ messageId: nextId }),
                          })
                            .then(() => notifyMessagesMarkedRead())
                            .catch(() => {});
                        }
                      }}
                      className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
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
                                  r.authorType === "user"
                                    ? "bg-amber-900/30 border border-amber-700/50 mr-4"
                                    : "bg-slate-600/50 border border-slate-500 ml-4"
                                }`}
                              >
                                <span className="text-slate-400 text-xs">
                                  {r.authorType === "user" ? "You" : "Support"} ·{" "}
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
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
        <TabsContent value="disputes" className="mt-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Review Dispute Threads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : disputes.length === 0 ? (
            <p className="text-white py-8">No review disputes. Review disputes appear here when you submit one on a review.</p>
          ) : (
            <div className="space-y-4">
              {disputes.map((d) => {
                const key = `${d.type}-${d.id}`;
                const isExpanded = expandedDispute === key;
                const msgs = d.messages ?? [];
                return (
                  <div
                    key={key}
                    className="rounded-lg bg-slate-700/50 border border-slate-600 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedDispute(isExpanded ? null : key)}
                      className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-slate-600">
                          {d.type === "coach" ? "Coach" : "Player"} dispute · {d.status}
                        </Badge>
                        {msgs.length > 0 && (
                          <Badge className="bg-amber-600/80">
                            {msgs.length} repl{msgs.length === 1 ? "y" : "ies"}
                          </Badge>
                        )}
                        <span className="text-slate-500 text-sm">
                          {new Date(d.createdAt).toLocaleString()}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 ml-auto" /> : <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />}
                      </div>
                      <p className="text-slate-300 text-sm line-clamp-2">
                        Review: &ldquo;{d.review.text}&rdquo; — {d.reason ? `Reason: ${d.reason}` : ""}
                      </p>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-slate-600">
                        <p className="text-slate-400 text-sm mt-3 mb-2">Review: &ldquo;{d.review.text}&rdquo;</p>
                        {d.reason && <p className="text-amber-200 text-sm mb-4">Reason: {d.reason}</p>}
                        {msgs.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {msgs.map((r) => (
                              <div
                                key={r.id}
                                className={`p-3 rounded-lg text-sm ${
                                  r.authorType === "disputant"
                                    ? "bg-amber-900/30 border border-amber-700/50 mr-4"
                                    : "bg-slate-600/50 border border-slate-500 ml-4"
                                }`}
                              >
                                <span className="text-slate-400 text-xs">
                                  {r.authorType === "disputant" ? "You" : "Support"} · {new Date(r.createdAt).toLocaleString()}
                                </span>
                                <p className="text-slate-200 mt-1 whitespace-pre-wrap">{r.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your reply…"
                            value={replyText[key] ?? ""}
                            onChange={(e) => setReplyText((prev) => ({ ...prev, [key]: e.target.value }))}
                            className="min-h-[80px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                            rows={3}
                          />
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 shrink-0 self-end"
                            onClick={() => handleDisputeReply(d.type, d.id)}
                            disabled={submittingId === key}
                          >
                            {submittingId === key ? "Sending…" : "Send Reply"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
