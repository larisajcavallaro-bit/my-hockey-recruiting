"use client";

import { useState } from "react";
import { CheckCircle2, Star, Lock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Notification {
  id: string;
  type: "request" | "review" | "verified";
  title: string;
  description: string;
  time: string;
  avatar?: string;
  avatarInitial?: string;
  actions?: {
    accept?: boolean;
    decline?: boolean;
  };
}

const notificationsData: { [key: string]: Notification[] } = {
  today: [
    {
      id: "1",
      type: "request",
      title: "Profile Access Request",
      description:
        "Sarah Miller (Parent) is asking to see your contact details.",
      time: "06:33 PM",
      avatarInitial: "SM",
      actions: {
        accept: true,
        decline: true,
      },
    },
    {
      id: "2",
      type: "review",
      title: "New Review Received",
      description: "You received a 5-star review from Coach Jordan Smith.",
      time: "04:33 PM",
      avatarInitial: "JS",
    },
  ],
  yesterday: [
    {
      id: "3",
      type: "verified",
      title: "Account Verified",
      description:
        "Your player credentials have been successfully verified by Accor.",
      time: "08:39 PM",
      avatarInitial: "AV",
    },
  ],
};

function NotificationItem({ notification }: { notification: Notification }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "request":
        return <Lock className="w-5 h-5 text-blue-500" />;
      case "review":
        return <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
      case "verified":
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6 mb-4 bg-secondary-foreground/20 border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Icon/Avatar */}
        <div className="flex-shrink-0">
          {notification.type === "request" || notification.type === "review" ? (
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                {notification.avatarInitial}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              {getIcon(notification.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {notification.title}
              </h3>
              <p className="text-sm text-sub-text1/80 mt-1">
                {notification.description}
              </p>
            </div>
            <span className="text-xs text-gray-500 ml-2">
              {notification.time}
            </span>
          </div>

          {/* Actions */}
          {notification.actions && (
            <div className="flex gap-3 mt-4">
              {notification.actions.accept && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  ✓ Accept
                </Button>
              )}
              {notification.actions.decline && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  ✕ Decline
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const allNotifications = [
    ...notificationsData.today,
    ...notificationsData.yesterday,
  ];

  const getFilteredNotifications = (tab: string) => {
    if (tab === "all") return allNotifications;
    if (tab === "requests")
      return allNotifications.filter((n) => n.type === "request");
    if (tab === "reviews")
      return allNotifications.filter((n) => n.type === "review");
    return allNotifications;
  };

  return (
    <div className="mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sub-text1/80 text-sm mt-1">
          Stay updated with your latest activities
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-3 mb-8 bg-background/50 p-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-button-clr1 data-[state=active]:text-sub-text1"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-button-clr1 data-[state=active]:text-sub-text1"
          >
            Requests
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-button-clr1 data-[state=active]:text-sub-text1"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* Notifications Content */}
        <TabsContent value={activeTab}>
          <div>
            {/* Today Section */}
            {notificationsData.today.some((n) => {
              const filtered = getFilteredNotifications(activeTab);
              return filtered.some((fn) => n.id === fn.id);
            }) && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-button-clr1">●</span> Today
                </h2>
                {notificationsData.today.map((notification) => {
                  const filtered = getFilteredNotifications(activeTab);
                  if (filtered.some((fn) => fn.id === notification.id)) {
                    return (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    );
                  }
                })}
              </div>
            )}

            {/* Yesterday Section */}
            {notificationsData.yesterday.some((n) => {
              const filtered = getFilteredNotifications(activeTab);
              return filtered.some((fn) => n.id === fn.id);
            }) && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-blue-600">●</span> Yesterday
                </h2>
                {notificationsData.yesterday.map((notification) => {
                  const filtered = getFilteredNotifications(activeTab);
                  if (filtered.some((fn) => fn.id === notification.id)) {
                    return (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    );
                  }
                })}
              </div>
            )}

            {/* Empty State */}
            {getFilteredNotifications(activeTab).length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No notifications</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
