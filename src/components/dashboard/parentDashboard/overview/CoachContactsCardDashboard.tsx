"use client";

import React, { useState } from "react";
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

// Dummy data - replace with API calls later
const DUMMY_REQUEST = [
  {
    id: 1,
    name: "Larisa Cav",
    title: "Mississauga Chiefs",
    requestStatus: "Approved",
  },
  {
    id: 2,
    name: "Nadib Rana",
    title: "Mississauga Chiefs",
    requestStatus: "Pending",
  },
  {
    id: 3,
    name: "Karim",
    title: "Mississauga Chiefs",
    requestStatus: "Rejected",
  },
  {
    id: 4,
    name: "Larisa ",
    title: "Mississauga Chiefs",
    requestStatus: "Approved",
  },
  {
    id: 5,
    name: "Shaim Khan",
    title: "Mississauga Chiefs",
    requestStatus: "Rejected",
  },
  {
    id: 6,
    name: "Chima luice",
    title: "Mississauga Chiefs",
    requestStatus: "Rejected",
  },
  {
    id: 7,
    name: "Larisa Cav",
    title: "Mississauga Chiefs",
    requestStatus: "Rejected",
  },
  {
    id: 8,
    name: "Larisa Cav",
    title: "Mississauga Chiefs",
    requestStatus: "Rejected",
  },
];

const statusStyles = {
  Approved: "bg-green-500 hover:bg-green-600 border-green-600 text-white",
  Pending: "bg-yellow-500 hover:bg-yellow-600 border-yellow-600 text-black",
  Rejected: "bg-red-500 hover:bg-red-600 border-red-600 text-white",
};

const CoachContactsCard = () => {
  const [requestInformation] = useState(DUMMY_REQUEST);
  const [open, setOpen] = useState(false);

  const handleStartExercise = (exerciseId: number) => {
    console.log("Starting exercise:", exerciseId);
  };

  return (
    <div className="space-y-4 mt-10">
      <div className="mb-6 bg-[#E5E7EB]/50 p-4 rounded-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-md font-semibold text-foreground">
            Coach Contacts
          </h2>

          {/*  SHOW ALL BUTTON */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Show All
              </Button>
            </DialogTrigger>

            {/*  MODAL */}
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>All Coach Requests</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {requestInformation.map((request) => (
                  <Card key={request.id} className="bg-secondary-foreground/10">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-sm">
                            {request.name}
                          </h3>
                          <p className="text-black/50 text-sm">
                            {request.title}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          className={cn(
                            "border h-auto text-xs px-3 py-1 font-normal",
                            statusStyles[
                              request.requestStatus as keyof typeof statusStyles
                            ],
                          )}
                        >
                          {request.requestStatus}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* SHORT LIST (optional preview) */}
        <div className="space-y-3">
          {requestInformation.slice(0, 2).map((request) => (
            <Card key={request.id} className="bg-secondary-foreground/10">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-sm">{request.name}</h3>
                    <p className="text-black/50">{request.title}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleStartExercise(request.id)}
                    className={cn(
                      "border h-auto text-xs px-3 py-1 font-normal",
                      statusStyles[
                        request.requestStatus as keyof typeof statusStyles
                      ],
                    )}
                  >
                    {request.requestStatus}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <UpcomingEventsCardDashboard />
    </div>
  );
};

export default CoachContactsCard;
