import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditForm from "./EditForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditRequestPage({ params }: Props) {
  const { id } = await params;

  const request = await prisma.request.findUnique({ where: { id } });

  if (!request) notFound();

  if (request.status !== "PENDING") redirect(`/requests/${id}`);

  return <EditForm request={request} />;
}
