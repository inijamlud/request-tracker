import prisma from "@/lib/prisma";
import { updateStatusSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  const result = updateStatusSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const updated = await prisma.$transaction([
    prisma.request.update({
      where: { id },
      data: { status: result.data.status },
    }),
    prisma.statusHistory.create({
      data: { requestId: id, status: result.data.status },
    }),
  ]);

  // broadcast({ type: "REQUEST_UPDATED", request: updated[0] });
  return NextResponse.json(updated[0]);
}
