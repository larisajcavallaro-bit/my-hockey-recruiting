"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, Ban, ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";
import { toCSV, downloadFile } from "@/lib/csv-utils";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  createdAt: string;
  parentProfile?: {
    id: string;
    planId: string | null;
    phone: string | null;
    players: { id: string; name: string }[];
  };
  coachProfile?: {
    id: string;
    team: string | null;
    level: string | null;
    phone: string | null;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [blockedEmails, setBlockedEmails] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [blockDialog, setBlockDialog] = useState<{ user: User } | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [blocking, setBlocking] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);

  const fetchUsers = (paramsOverride?: URLSearchParams) => {
    const params = paramsOverride ?? new URLSearchParams();
    if (roleFilter && roleFilter !== "all") params.set("role", roleFilter);
    params.set("limit", "9999");
    return fetch(`/api/admin/users?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => (data.error ? [] : data.users ?? []));
  };

  const fetchBlocked = () =>
    fetch("/api/admin/users/blocked")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error && data.emails) {
          setBlockedEmails(new Set(data.emails.map((e: string) => e.toLowerCase())));
        }
      })
      .catch(() => {});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUsers().then((u) => {
        setUsers(u);
      }),
      fetchBlocked(),
    ])
      .catch(() => {
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [roleFilter]);

  const handleExport = async () => {
    const data = await fetchUsers();
    const rows = data.map((u: User) => ({
      email: u.email,
      name: u.name ?? "",
      role: u.role,
      phone: u.parentProfile?.phone ?? u.coachProfile?.phone ?? "",
      children: (u.parentProfile?.players ?? [])
        .map((p) => p.name)
        .join("; "),
      createdAt: u.createdAt,
      planId: u.parentProfile?.planId ?? (u.coachProfile ? "Coach" : ""),
    }));
    const csv = toCSV(rows as Record<string, unknown>[], [
      { key: "email", label: "Email" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "phone", label: "Phone" },
      { key: "children", label: "Children" },
      { key: "createdAt", label: "Joined" },
      { key: "planId", label: "Plan" },
    ]);
    downloadFile(csv, `users-export-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleBlock = async () => {
    if (!blockDialog) return;
    const email = blockDialog.user.email.toLowerCase();
    setBlocking(true);
    try {
      const res = await fetch("/api/admin/users/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason: blockReason.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to block");
      setBlockedEmails((prev) => new Set([...prev, email]));
      toast.success(`Blocked ${email}. They cannot sign in or create a new account.`);
      setBlockDialog(null);
      setBlockReason("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to block email");
    } finally {
      setBlocking(false);
    }
  };

  const handleVerifyPhone = async (user: User) => {
    setVerifying(user.id);
    try {
      const res = await fetch("/api/admin/users/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to verify");
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, emailVerified: new Date() } : u
        )
      );
      toast.success(data.message ?? "User can now sign in.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to verify");
    } finally {
      setVerifying(null);
    }
  };

  const handleUnblock = async (email: string) => {
    const norm = email.toLowerCase();
    try {
      const res = await fetch("/api/admin/users/unblock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: norm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to unblock");
      setBlockedEmails((prev) => {
        const next = new Set(prev);
        next.delete(norm);
        return next;
      });
      toast.success(`Unblocked ${email}.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to unblock");
    }
  };

  const getPhone = (u: User) =>
    u.parentProfile?.phone ?? u.coachProfile?.phone ?? null;
  const getChildren = (u: User) =>
    (u.parentProfile?.players ?? []).map((p) => p.name).join(", ") || null;
  const isBlocked = (u: User) => blockedEmails.has(u.email.toLowerCase());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 mt-1">
          All users. View account details for scam/fake account review. Block emails to revoke access and prevent future sign-ups.
        </p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-white">All Users</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-500 text-slate-300 hover:bg-slate-700"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" /> Export CSV
            </Button>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="PARENT">Parent</SelectItem>
                <SelectItem value="COACH">Coach</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="py-2 w-8" />
                    <th className="py-2 text-slate-400 font-medium">Email</th>
                    <th className="py-2 text-slate-400 font-medium">Name</th>
                    <th className="py-2 text-slate-400 font-medium">Phone</th>
                    <th className="py-2 text-slate-400 font-medium">Role</th>
                    <th className="py-2 text-slate-400 font-medium">Children</th>
                    <th className="py-2 text-slate-400 font-medium">Plan</th>
                    <th className="py-2 text-slate-400 font-medium">Joined</th>
                    <th className="py-2 text-slate-400 font-medium">Status</th>
                    <th className="py-2 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const expanded = expandedId === u.id;
                    const blocked = isBlocked(u);
                    return (
                      <React.Fragment key={u.id}>
                        <tr className="border-b border-slate-700/50">
                          <td className="py-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId(expanded ? null : u.id)
                              }
                              className="text-slate-400 hover:text-white"
                            >
                              {expanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 text-white">{u.email}</td>
                          <td className="py-3 text-slate-300">{u.name ?? "—"}</td>
                          <td className="py-3 text-slate-400">
                            {getPhone(u) ?? "—"}
                          </td>
                          <td className="py-3">
                            <Badge
                              className={
                                u.role === "ADMIN"
                                  ? "bg-amber-600"
                                  : u.role === "COACH"
                                    ? "bg-blue-600"
                                    : "bg-slate-600"
                              }
                            >
                              {u.role}
                            </Badge>
                          </td>
                          <td className="py-3 text-slate-400 text-sm">
                            {getChildren(u) ?? "—"}
                          </td>
                          <td className="py-3 text-slate-400">
                            {u.parentProfile?.planId ??
                              (u.coachProfile ? "Coach" : "—")}
                          </td>
                          <td className="py-3 text-slate-500 text-sm">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            {u.emailVerified ? (
                              <Badge className="bg-green-900/50 text-green-400">Verified</Badge>
                            ) : (
                              <Badge className="bg-amber-900/50 text-amber-400">Unverified</Badge>
                            )}
                          </td>
                          <td className="py-3">
                            {u.role === "ADMIN" ? (
                              <span className="text-slate-500 text-sm">
                                —
                              </span>
                            ) : !u.emailVerified ? (
                              <div className="flex items-center gap-1 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-amber-600 text-amber-400 hover:bg-amber-900/30"
                                  onClick={() => handleVerifyPhone(u)}
                                  disabled={verifying === u.id}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  {verifying === u.id ? "…" : "Verify"}
                                </Button>
                                {blocked ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-600 text-green-400 hover:bg-green-900/30"
                                    onClick={() => handleUnblock(u.email)}
                                  >
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-600 text-red-400 hover:bg-red-900/30"
                                    onClick={() => setBlockDialog({ user: u })}
                                  >
                                    <Ban className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ) : blocked ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-600 text-green-400 hover:bg-green-900/30"
                                onClick={() => handleUnblock(u.email)}
                              >
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-900/30"
                                onClick={() => setBlockDialog({ user: u })}
                              >
                                <Ban className="w-3 h-3 mr-1" />
                                Block
                              </Button>
                            )}
                          </td>
                        </tr>
                        {expanded && (
                          <tr key={`${u.id}-detail`}>
                            <td colSpan={10} className="py-0 pb-3">
                              <div className="bg-slate-900/50 rounded-lg p-4 text-sm space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                                  <div>
                                    <span className="text-slate-500">Email:</span>{" "}
                                    {u.email}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Name:</span>{" "}
                                    {u.name ?? "—"}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Phone:</span>{" "}
                                    {getPhone(u) ?? "—"}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Role:</span>{" "}
                                    {u.role}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">
                                      Children:
                                    </span>{" "}
                                    {getChildren(u) ?? "—"}
                                  </div>
                                  {u.parentProfile?.players &&
                                    u.parentProfile.players.length > 0 && (
                                      <div className="md:col-span-2">
                                        <span className="text-slate-500">
                                          Child profiles:
                                        </span>{" "}
                                        {u.parentProfile.players
                                          .map((p) => p.name)
                                          .join(", ")}
                                      </div>
                                    )}
                                  {blocked && (
                                    <div className="md:col-span-2">
                                      <Badge className="bg-red-900/80 text-red-300">
                                        Blocked
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-slate-500 py-8">No users found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!blockDialog} onOpenChange={() => !blocking && setBlockDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Block & Revoke Email</DialogTitle>
            <DialogDescription className="text-slate-400">
              Blocking <strong>{blockDialog?.user.email}</strong> will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Immediately prevent sign-in</li>
                <li>Prevent creating a new account with this email</li>
              </ul>
              Add an optional reason below for your records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="block-reason" className="text-slate-300">
              Reason (optional)
            </Label>
            <Textarea
              id="block-reason"
              placeholder="e.g. scam account, fake profile"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white"
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-slate-500"
              onClick={() => !blocking && setBlockDialog(null)}
              disabled={blocking}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleBlock}
              disabled={blocking}
            >
              {blocking ? "Blocking…" : "Block & Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
