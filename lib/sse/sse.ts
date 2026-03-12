// lib/sse.ts
type Listener = (data: string) => void;

const global = globalThis as unknown as {
  sseListeners: Set<Listener> | undefined;
};

if (!global.sseListeners) {
  global.sseListeners = new Set<Listener>();
}

const listeners = global.sseListeners;

export function addListener(fn: Listener) {
  listeners.add(fn);
  console.log("SSE listener added, total:", listeners.size); // debug
}

export function removeListener(fn: Listener) {
  listeners.delete(fn);
  console.log("SSE listener removed, total:", listeners.size); // debug
}

export function broadcast(data: object) {
  console.log("Broadcasting to", listeners.size, "listeners:", data); // debug
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  listeners.forEach((fn) => fn(payload));
}
