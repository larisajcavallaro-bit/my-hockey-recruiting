import { prisma } from "@/lib/db";

export type NotificationType = "request" | "review" | "message" | "verified" | "general";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  linkUrl?: string | null;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body ?? null,
      linkUrl: params.linkUrl ?? null,
    },
  });
}
