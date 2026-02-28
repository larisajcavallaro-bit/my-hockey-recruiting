"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Star,
  Lock,
  MessageCircle,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  useNotifications,
  notifyNotificationsUpdated,
  type ApiNotification,
} from "@/hooks/useNotifications";
import { format, isToday, isYesterday } from "date-fns";

function getDisplayNotification(n: ApiNotification) {
  const time = format(new Date(n.createdAt), "h:mm a");
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    description: n.body ?? "",
    time,
    linkUrl: n.linkUrl,
    read: n.read,
  };
}

type DisplayNotification = ReturnType<typeof getDisplayNotification>;

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: DisplayNotification;
  onMarkRead: (id: string) => void;
}) {
  const getIcon = (type: string) => {
    switch (type) {
      case "request":
        return <Lock className="w-5 h-5 text-blue-500" />;
      case "review":
        return <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
      case "verified":
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const content = (
    <Card
      className={`p-6 mb-4 bg-secondary-foreground/20 border-0 shadow-sm hover:shadow-md transition-shadow ${
        !notification.read ? "ring-1 ring-orange-500/30" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
              {notification.description && (
                <p className="text-sm text-sub-text1/80 mt-1">
                  {notification.description}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-500 shrink-0">
              {notification.time}
            </span>
          </div>
          {notification.linkUrl && (
            <Button
              size="sm"
              variant="outline"
              className="mt-4"
              asChild
            >
              <Link
                href={notification.linkUrl}
                onClick={() => onMarkRead(notification.id)}
              >
                View
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (notification.linkUrl) {
    return (
      <Link
        href={notification.linkUrl}
        onClick={() => onMarkRead(notification.id)}
        className="block"
      >
        {content}
      </Link>
    );
  }

  return (
    <div onClick={() => onMarkRead(notification.id)} className="cursor-pointer">
      {content}
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);
  const [markingIds, setMarkingIds] = useState<Set<string>>(new Set());
  const { notifications, loading, refresh } = useNotifications();

  const displayNotifications = notifications.map(getDisplayNotification);

  const getFilteredNotifications = (tab: string) => {
    if (tab === "all") return displayNotifications;
    if (tab === "requests")
      return displayNotifications.filter((n) => n.type === "request");
    if (tab === "reviews")
      return displayNotifications.filter((n) => n.type === "review");
    return displayNotifications;
  };

  const handleMarkRead = async (id: string) => {
    if (markingIds.has(id)) return;
    setMarkingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      if (res.ok) {
        refresh();
        notifyNotificationsUpdated();
      }
    } finally {
      setMarkingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      if (res.ok) {
        refresh();
        notifyNotificationsUpdated();
      }
    } finally {
      setMarkingAll(false);
    }
  };

  const filtered = getFilteredNotifications(activeTab);
  const unreadCount = displayNotifications.filter((n) => !n.read).length;

  const today = filtered.filter((n) => {
    const d = notifications.find((x) => x.id === n.id)?.createdAt;
    return d && isToday(new Date(d));
  });
  const yesterday = filtered.filter((n) => {
    const d = notifications.find((x) => x.id === n.id)?.createdAt;
    return d && isYesterday(new Date(d));
  });
  const older = filtered.filter((n) => {
    const d = notifications.find((x) => x.id === n.id)?.createdAt;
    return d && !isToday(new Date(d)) && !isYesterday(new Date(d));
  });

  return (
    <div className="mx-auto px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sub-text1/80 text-sm mt-1">
            Stay updated with your latest activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={markingAll}
          >
            {markingAll ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCheck className="w-4 h-4 mr-2" />
            )}
            Mark all as read
          </Button>
        )}
      </div>

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

        <TabsContent value={activeTab}>
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {today.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-button-clr1">●</span> Today
                    </h2>
                    {today.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onMarkRead={handleMarkRead}
                      />
                    ))}
                  </div>
                )}
                {yesterday.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-blue-600">●</span> Yesterday
                    </h2>
                    {yesterday.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onMarkRead={handleMarkRead}
                      />
                    ))}
                  </div>
                )}
                {older.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-gray-500">●</span> Earlier
                    </h2>
                    {older.map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onMarkRead={handleMarkRead}
                      />
                    ))}
                  </div>
                )}
                {filtered.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No notifications</p>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
