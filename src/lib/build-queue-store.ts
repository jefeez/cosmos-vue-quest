import { useSyncExternalStore } from "react";
import { resourcesStore } from "./resources-store";

export type QueueKind = "building" | "facility" | "research" | "ship" | "defense";

export interface QueueEntry {
  id: string;
  kind: QueueKind;
  itemId: string;
  name: string;
  level?: number;
  qty?: number;
  startedAt: number;
  durationMs: number;
}

let entries: QueueEntry[] = [];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  // seed mock entries client-side only (avoids SSR hydration drift)
  entries = [
    {
      id: "seed-1",
      kind: "building",
      itemId: "crystal-mine",
      name: "Mina de Cristal",
      level: 12,
      startedAt: Date.now() - 18 * 60_000,
      durationMs: 60 * 60_000,
    },
    {
      id: "seed-2",
      kind: "research",
      itemId: "hyperspace",
      name: "Tecnologia Hiperespacial",
      level: 7,
      startedAt: Date.now() - 35 * 60_000,
      durationMs: 3 * 60 * 60_000,
    },
  ];
  setInterval(emit, 1000);
}

const serverSnapshot: QueueEntry[] = [];

const parseTimeToMs = (s: string): number => {
  if (s.includes(":")) {
    const parts = s.split(":").map(Number);
    const [h, m, sec = 0] = parts;
    return ((h * 60 + m) * 60 + sec) * 1000;
  }
  const h = /(\d+)h/.exec(s)?.[1] ?? "0";
  const m = /(\d+)m/.exec(s)?.[1] ?? "0";
  return (Number(h) * 60 + Number(m)) * 60_000;
};

export const queueStore = {
  get: () => entries,
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },

  enqueue(entry: Omit<QueueEntry, "id" | "startedAt">) {
    const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    entries = [...entries, { ...entry, id, startedAt: Date.now() }];
    emit();
    return id;
  },

  cancel(id: string) {
    entries = entries.filter((e) => e.id !== id);
    emit();
  },

  forKind(kind: QueueKind) {
    return entries.filter((e) => e.kind === kind);
  },

  activeFor(kind: QueueKind, itemId: string) {
    return entries.find((e) => e.kind === kind && e.itemId === itemId);
  },

  startBuild(opts: {
    kind: QueueKind;
    itemId: string;
    name: string;
    level?: number;
    qty?: number;
    timeStr: string;
    cost: { metal?: number; crystal?: number; deuterium?: number };
  }) {
    if (!resourcesStore.canAfford(opts.cost)) return { ok: false as const, reason: "Recursos insuficientes" };
    resourcesStore.spend(opts.cost);
    const id = this.enqueue({
      kind: opts.kind,
      itemId: opts.itemId,
      name: opts.name,
      level: opts.level,
      qty: opts.qty,
      durationMs: parseTimeToMs(opts.timeStr),
    });
    return { ok: true as const, id };
  },
};

export function useQueue() {
  return useSyncExternalStore(queueStore.subscribe, queueStore.get, queueStore.get);
}

export function progressOf(e: QueueEntry) {
  const elapsed = Date.now() - e.startedAt;
  const pct = Math.min(100, (elapsed / e.durationMs) * 100);
  const remainingMs = Math.max(0, e.durationMs - elapsed);
  const totalSec = Math.floor(remainingMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const remaining = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return { pct, remaining, done: pct >= 100 };
}
