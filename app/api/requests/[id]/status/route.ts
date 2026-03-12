import { Status, VALID_STATUSES } from "@/constants/status";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.$transaction([
    prisma.request.update({
      where: { id },
      data: { status: status as Status },
    }),
    prisma.statusHistory.create({
      data: {
        requestId: id,
        status: status as Status,
      },
    }),
  ]);

  return NextResponse.json(updated[0]);
}
