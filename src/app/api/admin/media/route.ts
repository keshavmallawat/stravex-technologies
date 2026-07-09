import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const category = req.nextUrl.searchParams.get("category");

  const assets = await prisma.mediaAsset.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ assets });
}
