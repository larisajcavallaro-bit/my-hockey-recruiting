"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContactRequestItem {
  id: string;
  coachName: string;
  parentName: string;
  playerName: string | null;
  requestedBy: "coach" | "parent";
  status: "pending" | "approved" | "rejected";
}

const statusStyles: Record<string, string> = {
  approved: "bg-green-500 hover:bg-green-600 border-green-600 text-white",
  pending: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-black",
  rejected: "bg-red-500 hover:bg-red-600 border-red-600 text-white",
};

export default function ContactRequestsCardDashboard() {
  const [requests, setRequests] = useState<ContactRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchRequests = () => {
    fetch("/api/contact-requests")
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((data) =>
        setRequests(
          (data.requests ?? []).map((r: Record<string, unknown>) => ({
            id: r.id,
            coachName: r.coachName ?? "Coach",
            parentName: r.parentName ?? "Parent",
            playerName: r.playerName ?? null,
            requestedBy: r.requestedBy,
            status: r.status ?? "pending",
          }))
        )
      )
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/contact-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    if (res.ok) fetchRequests();
  };

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/contact-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    if (res.ok) fetchRequests();
  };

  const incomingPending = requests.filter(
    (r) => r.requestedBy === "parent" && r.status === "pending"
  );

  const renderRequest = (req: ContactRequestItem) => (
    <Card key={req.id} className="bg-secondary-foreground/10">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-medium text-sm">{req.parentName}</h3>
            <p className="text-black/50 text-sm">
              Requested your contact info
            </p>
          </div>
          <div className="flex items-center gap-2">
            {req.status === "pending" && req.requestedBy === "parent" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(req.id)}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(req.id)}
                  className="border-red-500 text-red-600 hover:bg-red-50 text-xs"
                >
                  Reject
                </Button>
              </>
            )}
            {!(req.status === "pending" && req.requestedBy === "parent") && (
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border",
                  statusStyles[req.status] ?? "bg-gray-100 text-gray-800"
                )}
              >
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Contact Requests
          </h2>
          <p className="text-sm text-sub-text1/60">
            Parents requesting your contact info
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Show All
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>All Contact Requests</DialogTitle>
            </DialogHeader>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {loading ? (
                <p className="text-muted-foreground text-sm py-4">Loading...</p>
              ) : requests.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  No contact requests yet. When parents request your contact from
                  Find Coaches, they will appear here.
                </p>
              ) : (
                requests.map(renderRequest)
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-muted-foreground text-sm py-2">Loading...</p>
        ) : incomingPending.length === 0 ? (
          <p className="text-muted-foreground text-sm py-2">
            No pending contact requests
          </p>
        ) : (
          incomingPending.slice(0, 3).map(renderRequest)
        )}
      </div>
    </div>
  );
}
