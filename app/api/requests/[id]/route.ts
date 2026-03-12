import { Priority } from "@/constants/priority";
import prisma from "@/lib/prisma";
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
  const { title, description, priority, dueDate } = await req.json();

  const existing = await prisma.request.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  // Hanya boleh edit kalau masih PENDING
  if (existing.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only PENDING requests can be edited" },
      { status: 403 },
    );
  }

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 },
    );
  }

  const validPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

  const updated = await prisma.request.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description.trim(),
      priority: validPriorities.includes(priority)
        ? priority
        : existing.priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return NextResponse.json(updated);
}
