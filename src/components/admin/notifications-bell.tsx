"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Bell } from "@phosphor-icons/react";
import {
  getRecentNotifications,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/app/admin/(dashboard)/notifications-actions";
import { formatDateTime } from "@/lib/format-date";

interface NotificationDTO {
  id: string;
  type: string;
  message: string;
  linkHref: string | null;
  read: boolean;
  createdAt: Date;
}

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  function refresh() {
    startTransition(async () => {
      const { notifications, unreadCount } = await getRecentNotifications();
      setNotifications(notifications);
      setUnreadCount(unreadCount);
    });
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggle() {
    setOpen((v) => !v);
    if (!open) refresh();
  }

  function markAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      refresh();
    });
  }

  function handleClickNotification(n: NotificationDTO) {
    if (!n.read) {
      startTransition(async () => {
        await markNotificationReadAction(n.id);
        refresh();
      });
    }
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center border border-ink/15 text-ink/60 transition-colors hover:border-brand hover:text-brand"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[9px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 border border-ink/10 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <span className="font-mono-label text-[10px] uppercase text-ink/40">
              [ Notifications ]
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                disabled={isPending}
                className="font-mono-label cursor-pointer text-[10px] uppercase text-brand hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink/40">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.linkHref ?? "/admin"}
                  onClick={() => handleClickNotification(n)}
                  className={`block cursor-pointer border-b border-ink/5 px-4 py-3 text-sm transition-colors last:border-0 hover:bg-mist ${
                    n.read ? "text-ink/50" : "text-ink"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
                    <div className={n.read ? "" : "flex-1"}>
                      <p>{n.message}</p>
                      <p className="mt-0.5 text-xs text-ink/35">
                        {formatDateTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
