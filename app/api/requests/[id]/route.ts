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
