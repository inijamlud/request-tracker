import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { tagIds } = await req.json();

  if (!Array.isArray(tagIds)) {
    return NextResponse.json(
      { error: "tagIds must be an array" },
      { status: 400 },
    );
  }

  await prisma.requestTag.deleteMany({ where: { requestId: id } });

  if (tagIds.length > 0) {
    await prisma.requestTag.createMany({
      data: tagIds.map((tagId: string) => ({ requestId: id, tagId })),
    });
  }

  return NextResponse.json({ success: true });
}
