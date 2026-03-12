import { Priority } from "@/constants/priority";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const { title, description, priority, dueDate } = await req.json();

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 },
    );
  }

  const validPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  const resolvedPriority: Priority = validPriorities.includes(priority)
    ? priority
    : "MEDIUM";

  const request = await prisma.request.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      priority: resolvedPriority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return NextResponse.json(request, { status: 201 });
}
