import { addListener, removeListener } from "@/lib/sse/sse";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  let listener: ((data: string) => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(": ping\n\n"));

      listener = (data: string) => {
        try {
          controller.enqueue(encoder.encode(data));
        } catch {
          console.log(`Error broadcasting to client, removing listener.`);
        }
      };

      addListener(listener);
    },
    cancel() {
      if (listener) removeListener(listener);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
