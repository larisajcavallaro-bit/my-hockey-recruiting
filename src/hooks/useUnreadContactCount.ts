"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const MARK_READ_EVENT = "messages-marked-read";

function fetchUnreadCount(setCount: (n: number) => void) {
  fetch(`/api/messages/unread-count?_=${Date.now()}`)
    .then((r) => r.json())
    .then((data) => setCount(data.count ?? 0))
    .catch(() => setCount(0));
}

export function useUnreadContactCount() {
  const { status } = useSession();
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (status !== "authenticated") {
      void Promise.resolve().then(() => setCount(0));
      return;
    }
    void Promise.resolve().then(() => fetchUnreadCount(setCount));
    const onEvent = () => fetchUnreadCount(setCount);
    window.addEventListener("focus", onEvent);
    window.addEventListener(MARK_READ_EVENT, onEvent);
    return () => {
      window.removeEventListener("focus", onEvent);
      window.removeEventListener(MARK_READ_EVENT, onEvent);
    };
  }, [status]);

  // Refetch when on messages page (dot clears after parent views replies)
  useEffect(() => {
    if (status === "authenticated" && pathname?.includes("/messages")) {
      const t = setTimeout(() => fetchUnreadCount(setCount), 400);
      return () => clearTimeout(t);
    }
  }, [status, pathname]);

  return count;
}

export function notifyMessagesMarkedRead() {
  window.dispatchEvent(new Event(MARK_READ_EVENT));
}
