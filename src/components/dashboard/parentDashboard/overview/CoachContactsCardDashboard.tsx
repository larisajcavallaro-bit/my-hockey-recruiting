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
import UpcomingEventsCardDashboard from "./UpcomingEventsCardDashboard";

interface ContactRequestItem {
  id: string;
  coachName: string;
  parentName: string;
  playerName: string | null;
  requestedBy: "coach" | "parent";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  approved: "bg-green-500 hover:bg-green-600 border-green-600 text-white",
  pending: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-black",
  rejected: "bg-red-500 hover:bg-red-600 border-red-600 text-white",
};

interface ParentContactRequestItem {
  id: string;
  requestingParentName: string;
  playerName: string | null;
  status: string;
}

const CoachContactsCardDashboard = () => {
  const [requests, setRequests] = useState<ContactRequestItem[]>([]);
  const [parentRequests, setParentRequests] = useState<ParentContactRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/contact-requests").then((r) => (r.ok ? r.json() : { requests: [] })),
      fetch("/api/parent-contact-requests").then((r) => (r.ok ? r.json() : { requests: [] })),
    ])
      .then(([coachData, parentData]) => {
        setRequests(
          (coachData.requests ?? []).map((r: Record<string, unknown>) => ({
            id: r.id,
            coachName: r.coachName ?? "Coach",
            parentName: r.parentName ?? "Parent",
            playerName: r.playerName ?? null,
            requestedBy: r.requestedBy,
            status: r.status ?? "pending",
            createdAt: r.createdAt ?? "",
          }))
        );
        setParentRequests(
          (parentData.requests ?? []).map((r: Record<string, unknown>) => ({
            id: r.id,
            requestingParentName: r.requestingParentName ?? "Parent",
            playerName: r.playerName ?? null,
            status: r.status ?? "pending",
          }))
        );
      })
      .catch(() => {
        setRequests([]);
        setParentRequests([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchRequests());
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

  const handleParentApprove = async (id: string) => {
    const res = await fetch(`/api/parent-contact-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    if (res.ok) fetchRequests();
  };

  const handleParentReject = async (id: string) => {
    const res = await fetch(`/api/parent-contact-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    if (res.ok) fetchRequests();
  };

  const renderRequest = (req: ContactRequestItem) => (
    <Card key={req.id} className="bg-secondary-foreground/10">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="font-medium text-sm">{req.coachName}</h3>
            <p className="text-black/50 text-sm">
              {req.requestedBy === "coach"
                ? req.playerName
                  ? `Requested contact for ${req.playerName}`
                  : "Requested your contact"
                : `You requested their contact`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {req.status === "pending" && req.requestedBy === "coach" && (
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
            {!(req.status === "pending" && req.requestedBy === "coach") && (
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
    <div className="space-y-4 mt-10">
      <div className="mb-6 bg-[#E5E7EB]/50 p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-md font-semibold text-foreground">
            Coach Contacts
          </h2>

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
                ) : requests.length === 0 && parentRequests.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">
                    No contact requests yet. When coaches or other parents request your contact from a
                    player profile, they will appear here.
                  </p>
                ) : (
                  <>
                    {requests.map(renderRequest)}
                    {parentRequests.map((req) => (
                      <Card key={req.id} className="bg-secondary-foreground/10">
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h3 className="font-medium text-sm">{req.requestingParentName}</h3>
                              <p className="text-black/50 text-sm">
                                Requested contact for {req.playerName ?? "your player"}
                              </p>
                            </div>
                            {req.status === "pending" && (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleParentApprove(req.id)} className="bg-green-600 hover:bg-green-500 text-white text-xs">Approve</Button>
                                <Button size="sm" variant="outline" onClick={() => handleParentReject(req.id)} className="border-red-500 text-red-600 text-xs">Reject</Button>
                              </div>
                            )}
                            {req.status !== "pending" && (
                              <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border", statusStyles[req.status] ?? "bg-gray-100 text-gray-800")}>
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {loading ? (
            <p className="text-muted-foreground text-sm py-2">Loading...</p>
          ) : requests.length === 0 && parentRequests.length === 0 ? (
            <p className="text-muted-foreground text-sm py-2">
              No contact requests
            </p>
          ) : (
            <>
              {requests.slice(0, 2).map(renderRequest)}
              {parentRequests.slice(0, 2).map((req) => (
                <Card key={req.id} className="bg-secondary-foreground/10">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-medium text-sm">{req.requestingParentName}</h3>
                        <p className="text-black/50 text-sm">
                          Requested contact for {req.playerName ?? "your player"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {req.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleParentApprove(req.id)}
                              className="bg-green-600 hover:bg-green-500 text-white text-xs"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleParentReject(req.id)}
                              className="border-red-500 text-red-600 hover:bg-red-50 text-xs"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {req.status !== "pending" && (
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
              ))}
            </>
          )}
        </div>

      </div>
      <UpcomingEventsCardDashboard />
    </div>
  );
};

export default CoachContactsCardDashboard;
