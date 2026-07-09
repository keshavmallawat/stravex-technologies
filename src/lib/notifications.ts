import { prisma } from "@/lib/prisma";

export async function notify({
  type,
  message,
  linkHref,
}: {
  type: string;
  message: string;
  linkHref?: string;
}) {
  await prisma.notification.create({
    data: { type, message, linkHref: linkHref ?? null },
  });
}
