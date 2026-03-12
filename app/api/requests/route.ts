import prisma from "@/lib/prisma";
import { createRequestSchema } from "@/lib/schemas";
import { broadcast } from "@/lib/sse/sse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = createRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { title, description, priority, dueDate, tagIds } = result.data;

  const request = await prisma.request.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
  });

  broadcast({ type: "REQUEST_CREATED", request });
  return NextResponse.json(request, { status: 201 });
}
