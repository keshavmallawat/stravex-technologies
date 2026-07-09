"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { emptyBlockContent, type BlockContent, type BlockType } from "@/lib/product-block-types";

export async function createProductBlockAction(productId: string, type: BlockType) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const maxOrder = await prisma.productContentBlock.aggregate({
    where: { productId },
    _max: { sortOrder: true },
  });

  const block = await prisma.productContentBlock.create({
    data: {
      productId,
      type,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      content: emptyBlockContent(type) as object,
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  return { success: true, id: block.id };
}

export async function updateProductBlockAction(blockId: string, content: BlockContent) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const block = await prisma.productContentBlock.update({
    where: { id: blockId },
    data: { content: content as object },
  });

  revalidatePath(`/admin/products/${block.productId}`);
  return { success: true };
}

export async function deleteProductBlockAction(blockId: string, productId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  await prisma.productContentBlock.delete({ where: { id: blockId } });

  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}

export async function reorderProductBlockAction(
  blockId: string,
  productId: string,
  direction: "up" | "down"
) {
  const session = await auth();
  if (!session?.user) return { error: "Not authorized." };

  const blocks = await prisma.productContentBlock.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });

  const index = blocks.findIndex((b) => b.id === blockId);
  if (index === -1) return { error: "Block not found." };

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= blocks.length) return { success: true };

  const current = blocks[index];
  const swap = blocks[swapIndex];

  await prisma.$transaction([
    prisma.productContentBlock.update({
      where: { id: current.id },
      data: { sortOrder: swap.sortOrder },
    }),
    prisma.productContentBlock.update({
      where: { id: swap.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  revalidatePath(`/admin/products/${productId}`);
  return { success: true };
}
