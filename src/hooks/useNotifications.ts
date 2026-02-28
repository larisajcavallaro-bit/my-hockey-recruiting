"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const NOTIFICATIONS_UPDATED_EVENT = "notifications-updated";

export interface ApiNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string | null;
  linkUrl: string | null;
  read: boolean;
  createdAt: string;
}

function fetchUnreadCount(setCount: (n: number) => void) {
  fetch(`/api/notifications/unread-count?_=${Date.now()}`)
    .then((r) => r.json())
    .then((data) => setCount(data.count ?? 0))
    .catch(() => setCount(0));
}

export function useUnreadNotificationCount() {
  const { status } = useSession();
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") {
      setCount(0);
      return;
    }
    fetchUnreadCount(setCount);
    const onEvent = () => fetchUnreadCount(setCount);
    window.addEventListener("focus", onEvent);
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, onEvent);
    return () => {
      window.removeEventListener("focus", onEvent);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, onEvent);
    };
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && pathname?.includes("/notifications")) {
      const t = setTimeout(() => fetchUnreadCount(setCount), 400);
      return () => clearTimeout(t);
    }
  }, [status, pathname]);

  return count;
}

export function useNotifications() {
  const { status } = useSession();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (status !== "authenticated") {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => setNotifications(data.notifications ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    refresh();
    const onEvent = () => refresh();
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, onEvent);
    return () => window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, onEvent);
  }, [refresh]);

  return { notifications, loading, refresh };
}

export function notifyNotificationsUpdated() {
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}
