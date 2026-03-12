import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const request = await prisma.request.create({
    data: {
      title: body.title,
      description: body.description,
      id: crypto.randomUUID(),
    },
  });

  return NextResponse.json(request);
}
