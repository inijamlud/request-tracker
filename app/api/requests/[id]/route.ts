import prisma from "@/lib/prisma";
import { updateRequestSchema } from "@/lib/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  const existing = await prisma.request.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  await prisma.request.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  const result = updateRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const existing = await prisma.request.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  if (existing.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only PENDING requests can be edited" },
      { status: 403 },
    );
  }

  const updated = await prisma.request.update({
    where: { id },
    data: {
      ...result.data,
      dueDate: result.data.dueDate ? new Date(result.data.dueDate) : null,
    },
  });

  // broadcast({ type: "REQUEST_UPDATED", request: updated });
  return NextResponse.json(updated);
}
