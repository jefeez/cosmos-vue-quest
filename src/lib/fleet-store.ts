import { useSyncExternalStore } from "react";

export type MissionType =
  | "Ataque"
  | "Transporte"
  | "Espionagem"
  | "Colonizar"
  | "Reciclar"
  | "Estacionar"
  | "Expedição"
  | "Destruir";

export type MissionStatus = "outbound" | "holding" | "returning" | "completed" | "recalled";

export interface FleetShip {
  id: string;
  name: string;
  count: number;
}

export interface Mission {
  id: string;
  type: MissionType;
  origin: string;
  target: string;
  ships: FleetShip[];
  cargo: { metal: number; crystal: number; deuterium: number };
  fuel: number;
  speed: number; // 10..100
  departedAt: number; // epoch ms
  arrivalAt: number;
  returnAt: number;
  status: MissionStatus;
}

const now = () => Date.now();
const min = (n: number) => n * 60_000;

let state: { missions: Mission[]; nextId: number } = {
  nextId: 7,
  missions: [
    {
      id: "m1", type: "Ataque", origin: "[1:147:8]", target: "[2:241:11]",
      ships: [{ id: "battleship", name: "Nave de Batalha", count: 18 }, { id: "cruiser", name: "Cruzador", count: 42 }, { id: "light-fighter", name: "Caça Leve", count: 96 }],
      cargo: { metal: 0, crystal: 0, deuterium: 0 },
      fuel: 4_820, speed: 100,
      departedAt: now() - min(28), arrivalAt: now() + min(42), returnAt: now() + min(112),
      status: "outbound",
    },
    {
      id: "m2", type: "Espionagem", origin: "[1:147:8]", target: "[1:147:9]",
      ships: [{ id: "espionage-probe", name: "Sonda", count: 8 }],
      cargo: { metal: 0, crystal: 0, deuterium: 0 },
      fuel: 12, speed: 100,
      departedAt: now() - min(2), arrivalAt: now() + min(75), returnAt: now() + min(150),
      status: "outbound",
    },
    {
      id: "m3", type: "Transporte", origin: "[1:147:8]", target: "[1:147:6]",
      ships: [{ id: "large-cargo", name: "Cargueiro Grande", count: 24 }],
      cargo: { metal: 180_000, crystal: 90_000, deuterium: 12_000 },
      fuel: 840, speed: 100,
      departedAt: now() - min(120), arrivalAt: now() - min(8), returnAt: now() + min(128),
      status: "returning",
    },
    {
      id: "m4", type: "Reciclar", origin: "[1:147:8]", target: "[1:147:5]",
      ships: [{ id: "recycler", name: "Reciclador", count: 12 }],
      cargo: { metal: 0, crystal: 0, deuterium: 0 },
      fuel: 360, speed: 100,
      departedAt: now() - min(48), arrivalAt: now() + min(18), returnAt: now() + min(78),
      status: "outbound",
    },
    {
      id: "m5", type: "Estacionar", origin: "[1:147:8]", target: "[1:201:4]",
      ships: [{ id: "battleship", name: "Nave de Batalha", count: 6 }, { id: "heavy-fighter", name: "Caça Pesado", count: 30 }],
      cargo: { metal: 50_000, crystal: 25_000, deuterium: 0 },
      fuel: 1_240, speed: 50,
      departedAt: now() - min(180), arrivalAt: now() - min(20), returnAt: now() + min(160),
      status: "holding",
    },
    {
      id: "m6", type: "Expedição", origin: "[1:147:8]", target: "[1:16:16]",
      ships: [{ id: "large-cargo", name: "Cargueiro Grande", count: 8 }, { id: "cruiser", name: "Cruzador", count: 6 }],
      cargo: { metal: 0, crystal: 0, deuterium: 4_000 },
      fuel: 980, speed: 100,
      departedAt: now() - min(15), arrivalAt: now() + min(95), returnAt: now() + min(245),
      status: "outbound",
    },
  ],
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function setState(updater: (s: typeof state) => typeof state) {
  state = updater(state);
  emit();
}

export const fleetStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  getSnapshot() { return state; },

  addMission(m: Omit<Mission, "id" | "departedAt" | "status">) {
    setState((s) => {
      const id = `m${s.nextId}`;
      const mission: Mission = { ...m, id, departedAt: now(), status: "outbound" };
      return { nextId: s.nextId + 1, missions: [mission, ...s.missions] };
    });
  },

  recall(id: string) {
    setState((s) => ({
      ...s,
      missions: s.missions.map((m) => {
        if (m.id !== id || m.status === "returning" || m.status === "completed") return m;
        const elapsed = now() - m.departedAt;
        return { ...m, status: "recalled" as MissionStatus, returnAt: now() + elapsed };
      }),
    }));
  },

  remove(id: string) {
    setState((s) => ({ ...s, missions: s.missions.filter((m) => m.id !== id) }));
  },
};

export function useFleet() {
  return useSyncExternalStore(fleetStore.subscribe, fleetStore.getSnapshot, fleetStore.getSnapshot);
}

export function formatCountdown(target: number): string {
  const diff = Math.max(0, target - Date.now());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function missionProgress(m: Mission): number {
  const total = m.arrivalAt - m.departedAt;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, ((Date.now() - m.departedAt) / total) * 100));
}
