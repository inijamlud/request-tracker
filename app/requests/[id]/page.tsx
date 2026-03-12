import StatusBadge from "@/components/BadgeStatus";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteButton from "./DeleteButton";
import ResolveButton from "./ResolveButton";

type Props = {
  params: { id: string };
};

export default async function RequestDetailPage({ params }: Props) {
  const { id } = await params;

  const request = await prisma.request.findUnique({
    where: { id },
  });

  if (!request) notFound();

  return (
    <div className="min-h-screen bg-[#F0F4EF] p-10">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Back */}
        <Link
          href="/requests"
          className="text-sm text-[#00272B]/50 hover:text-[#00272B] transition"
        >
          ← Back to Requests
        </Link>

        {/* Card */}
        <div className="bg-white border border-[#BFCC94]/40 rounded-2xl p-6 space-y-4">
          {/* Title + Badge */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#00272B]">
              {request.title}
            </h1>
            <StatusBadge status={request.status} />
          </div>

          {/* Divider */}
          <hr className="border-[#BFCC94]/30" />

          {/* Description */}
          <p className="text-[#00272B]/60 leading-relaxed">
            {request.description}
          </p>

          {/* Meta */}
          <p className="text-xs text-[#00272B]/30">
            Created{" "}
            {new Date(request.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Action */}
        <ResolveButton id={request.id} status={request.status} />
        <DeleteButton id={request.id} />
      </div>
    </div>
  );
}
