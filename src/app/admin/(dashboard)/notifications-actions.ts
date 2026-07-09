"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getRecentNotifications() {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.notification.count({ where: { read: false } }),
  ]);
  return { notifications, unreadCount };
}

export async function markNotificationReadAction(id: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.notification.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin", "layout");
  return { success: true };
}

export async function markAllNotificationsReadAction() {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
  revalidatePath("/admin", "layout");
  return { success: true };
}
