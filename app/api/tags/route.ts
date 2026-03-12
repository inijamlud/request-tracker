import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const { name, color } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const existing = await prisma.tag.findUnique({
    where: { name: name.trim() },
  });

  if (existing) {
    return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
  }

  const tag = await prisma.tag.create({
    data: {
      name: name.trim(),
      color: color ?? "#BFCC94",
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
