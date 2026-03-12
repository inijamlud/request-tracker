import { Priority } from "@/constants/priority";
import prisma from "@/lib/prisma";
import { broadcast } from "@/lib/sse/sse";
import { NextResponse } from "next/server";

export async function GET() {
  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const { title, description, priority, dueDate, tagIds } = await req.json();

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
      tags: tagIds?.length
        ? {
            create: tagIds.map((tagId: string) => ({ tagId })),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  broadcast({ type: "REQUEST_CREATED", request });

  return NextResponse.json(request, { status: 201 });
}
