"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, User, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ACTIVITIES = [
  {
    id: 1,
    icon: "check",
    text: "Jake confirmed for AAA Tryouts",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: "user",
    text: "Emma’s stats were verified",
    time: "1 day ago",
  },
  {
    id: 3,
    icon: "check",
    text: "Nadib confirmed for AAA Tryouts",
    time: "1 hours ago",
  },

  {
    id: 4,
    icon: "user",
    text: "Larisa’s stats were verified",
    time: "2 day ago",
  },

  {
    id: 5,
    icon: "check",
    text: "Larisa Cavallaro confirmed for AAA Tryouts",
    time: "5 hours ago",
  },
  // {
  //   id: 3,
  //   icon: "calendar",
  //   text: "Skills Development Camp available",
  //   time: "2 days ago",
  // },
];

const RecentActivityCardDashboard = () => {
  return (
    <div className="space-y-4 mt-10">
      {/* SAME wrapper style */}
      <div className="mb-6 bg-[#E5E7EB]/50 p-4 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-md font-semibold text-foreground">
            Recent Activity
          </h2>

          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            6
          </Badge>
        </div>

        {/* Activity list */}
        <div className="space-y-4 ">
          {ACTIVITIES.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start pb-4 gap-3 border-b-2"
            >
              {/* Icon */}
              <div className="mt-0.5">
                {activity.icon === "check" && (
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                )}
                {activity.icon === "user" && (
                  <User className="h-8 w-8 text-blue-500" />
                )}
                {/* {activity.icon === "calendar" && (
                  <CalendarDays className="h-8 w-8 text-blue-500" />
                )} */}
              </div>

              {/* Text */}

              <div>
                <p className="text-sm text-foreground">{activity.text}</p>
                <p className="text-xs text-muted-foreground pt-2">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Coach request */}
        <div className="mt-5 flex items-center justify-between gap-3 p-3 border-b-2">
          <div className="flex items-center gap-3">
            <Image
              src="/newasset/auth/nadib.jpg"
              alt="demo"
              width={48}
              height={48}
              className="rounded-full border-2"
            />

            <div>
              <p className="text-sm font-medium">Coach Jake confirmed</p>
              <p className="text-xs text-muted-foreground">
                Request contact info
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button
              size="sm"
              className="h-7 px-3 text-xs bg-button-clr1 hover:bg-button-clr1/50 hover:text-sub-text1"
            >
              Approve
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs text-muted-foreground"
              disabled
            >
              Decline
            </Button>
          </div>
        </div>

        {/* Footer */}
        <Button
          asChild
          className="w-full mt-4 bg-button-clr1 hover:bg-button-clr1/90 text-white font-medium text-sm"
        >
          <Link
            href="/parent-dashboard/notifications"
            className="flex items-center justify-center gap-1"
          >
            View all activity
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RecentActivityCardDashboard;
