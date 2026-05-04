import { useSyncExternalStore } from "react";

export type ReportType = "battle" | "espionage" | "transport" | "deploy" | "harvest" | "expedition" | "colonize";

export interface BaseReport {
  id: string;
  type: ReportType;
  title: string;
  origin: string;
  target: string;
  targetName?: string;
  timestamp: number;
  read: boolean;
  starred: boolean;
}

export interface BattleReport extends BaseReport {
  type: "battle";
  result: "victory" | "defeat" | "draw";
  rounds: number;
  attackerLosses: { metal: number; crystal: number; deuterium: number };
  defenderLosses: { metal: number; crystal: number; deuterium: number };
  loot: { metal: number; crystal: number; deuterium: number };
  debris: { metal: number; crystal: number };
  attacker: string;
  defender: string;
  moonChance?: number;
}

export interface EspionageReport extends BaseReport {
  type: "espionage";
  counterChance: number; // % attacker detected
  resources: { metal: number; crystal: number; deuterium: number; energy: number };
  fleet: { name: string; count: number }[] | null; // null = no data
  defense: { name: string; count: number }[] | null;
  buildings: { name: string; level: number }[] | null;
  research: { name: string; level: number }[] | null;
  activity: number; // minutes
}

export interface TransportReport extends BaseReport {
  type: "transport";
  cargo: { metal: number; crystal: number; deuterium: number };
  ships: { name: string; count: number }[];
  direction: "delivered" | "received";
}

export interface DeployReport extends BaseReport {
  type: "deploy";
  ships: { name: string; count: number }[];
  cargo: { metal: number; crystal: number; deuterium: number };
}

export interface HarvestReport extends BaseReport {
  type: "harvest";
  recyclers: number;
  capacity: number;
  collected: { metal: number; crystal: number };
  remaining: { metal: number; crystal: number };
}

export interface ExpeditionReport extends BaseReport {
  type: "expedition";
  outcome: "resources" | "fleet" | "nothing" | "aliens" | "pirates" | "merchant";
  message: string;
  gain?: { metal?: number; crystal?: number; deuterium?: number; ships?: { name: string; count: number }[] };
}

export interface ColonizeReport extends BaseReport {
  type: "colonize";
  success: boolean;
  fields: number;
  temperature: { min: number; max: number };
  diameter: number;
}

export type Report = BattleReport | EspionageReport | TransportReport | DeployReport | HarvestReport | ExpeditionReport | ColonizeReport;

const min = (n: number) => n * 60_000;
const hour = (n: number) => n * 3_600_000;
const now = Date.now();

const seed: Report[] = [
  {
    id: "r1", type: "battle", title: "Vitória contra Xandros", origin: "[1:147:8]", target: "[2:241:11]", targetName: "Colônia Xandros",
    timestamp: now - min(12), read: false, starred: true,
    result: "victory", rounds: 4,
    attacker: "Alm. Krix", defender: "Xandros",
    attackerLosses: { metal: 24_000, crystal: 12_000, deuterium: 0 },
    defenderLosses: { metal: 480_000, crystal: 240_000, deuterium: 60_000 },
    loot: { metal: 1_240_000, crystal: 620_000, deuterium: 180_000 },
    debris: { metal: 360_000, crystal: 180_000 },
    moonChance: 18,
  },
  {
    id: "r2", type: "espionage", title: "Espionagem em Vega Prime", origin: "[1:147:8]", target: "[1:147:9]", targetName: "Vega Prime",
    timestamp: now - min(45), read: false, starred: false,
    counterChance: 12,
    resources: { metal: 2_480_000, crystal: 1_120_000, deuterium: 460_000, energy: 12_400 },
    fleet: [{ name: "Caça Leve", count: 240 }, { name: "Cruzador", count: 18 }, { name: "Cargueiro Grande", count: 64 }],
    defense: [{ name: "Lança-Mísseis", count: 80 }, { name: "Laser Pesado", count: 24 }],
    buildings: [{ name: "Mina de Metal", level: 28 }, { name: "Mina de Cristal", level: 24 }, { name: "Sintetizador Deutério", level: 20 }],
    research: [{ name: "Energia", level: 12 }, { name: "Computação", level: 10 }, { name: "Hyperespacial", level: 8 }],
    activity: 47,
  },
  {
    id: "r3", type: "transport", title: "Transporte recebido de Aurora", origin: "[1:147:6]", target: "[1:147:8]", targetName: "Base Mãe",
    timestamp: now - hour(2), read: true, starred: false,
    cargo: { metal: 180_000, crystal: 90_000, deuterium: 12_000 },
    ships: [{ name: "Cargueiro Grande", count: 24 }],
    direction: "received",
  },
  {
    id: "r4", type: "deploy", title: "Frota estacionada em Outpost-IV", origin: "[1:147:8]", target: "[1:201:4]", targetName: "Outpost-IV",
    timestamp: now - hour(4), read: true, starred: true,
    ships: [{ name: "Nave de Batalha", count: 6 }, { name: "Caça Pesado", count: 30 }],
    cargo: { metal: 50_000, crystal: 25_000, deuterium: 0 },
  },
  {
    id: "r5", type: "harvest", title: "Reciclagem em [1:147:5]", origin: "[1:147:8]", target: "[1:147:5]",
    timestamp: now - hour(6), read: true, starred: false,
    recyclers: 12, capacity: 240_000,
    collected: { metal: 240_000, crystal: 0 },
    remaining: { metal: 120_000, crystal: 80_000 },
  },
  {
    id: "r6", type: "expedition", title: "Expedição [1:16:16]", origin: "[1:147:8]", target: "[1:16:16]",
    timestamp: now - hour(9), read: true, starred: false,
    outcome: "resources",
    message: "Sua frota encontrou destroços de uma nave alienígena há muito esquecida.",
    gain: { metal: 420_000, crystal: 210_000, deuterium: 80_000 },
  },
  {
    id: "r7", type: "battle", title: "Defesa contra Pirata Vorn", origin: "[1:147:8]", target: "[1:147:8]",
    timestamp: now - hour(14), read: true, starred: false,
    result: "victory", rounds: 2,
    attacker: "Pirata Vorn", defender: "Alm. Krix",
    attackerLosses: { metal: 320_000, crystal: 120_000, deuterium: 0 },
    defenderLosses: { metal: 8_000, crystal: 2_000, deuterium: 0 },
    loot: { metal: 0, crystal: 0, deuterium: 0 },
    debris: { metal: 96_000, crystal: 36_000 },
  },
  {
    id: "r8", type: "espionage", title: "Espionagem detectada!", origin: "[1:147:8]", target: "[3:118:7]", targetName: "Drakon",
    timestamp: now - hour(20), read: true, starred: false,
    counterChance: 78,
    resources: { metal: 5_600_000, crystal: 2_400_000, deuterium: 1_100_000, energy: 24_800 },
    fleet: null, defense: null,
    buildings: [{ name: "Mina de Metal", level: 32 }],
    research: null,
    activity: 4,
  },
  {
    id: "r9", type: "expedition", title: "Expedição sem retorno", origin: "[1:147:8]", target: "[1:9:16]",
    timestamp: now - hour(28), read: true, starred: false,
    outcome: "pirates",
    message: "Piratas espaciais emboscaram sua frota. Perdas significativas registradas.",
  },
  {
    id: "r10", type: "colonize", title: "Nova colônia estabelecida", origin: "[1:147:8]", target: "[2:88:5]", targetName: "Nova Aurora",
    timestamp: now - hour(36), read: true, starred: true,
    success: true, fields: 184, temperature: { min: -12, max: 52 }, diameter: 12_400,
  },
  {
    id: "r11", type: "battle", title: "Derrota em [4:202:9]", origin: "[1:147:8]", target: "[4:202:9]", targetName: "Fortaleza Helix",
    timestamp: now - hour(40), read: true, starred: false,
    result: "defeat", rounds: 6,
    attacker: "Alm. Krix", defender: "Helix",
    attackerLosses: { metal: 1_800_000, crystal: 900_000, deuterium: 240_000 },
    defenderLosses: { metal: 120_000, crystal: 40_000, deuterium: 0 },
    loot: { metal: 0, crystal: 0, deuterium: 0 },
    debris: { metal: 540_000, crystal: 280_000 },
  },
];

let state = { reports: seed };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const reportsStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  getSnapshot() { return state; },
  markRead(id: string) {
    state = { reports: state.reports.map((r) => r.id === id ? { ...r, read: true } : r) };
    emit();
  },
  markAllRead() {
    state = { reports: state.reports.map((r) => ({ ...r, read: true })) };
    emit();
  },
  toggleStar(id: string) {
    state = { reports: state.reports.map((r) => r.id === id ? { ...r, starred: !r.starred } : r) };
    emit();
  },
  remove(id: string) {
    state = { reports: state.reports.filter((r) => r.id !== id) };
    emit();
  },
  removeMany(ids: string[]) {
    const set = new Set(ids);
    state = { reports: state.reports.filter((r) => !set.has(r.id)) };
    emit();
  },
};

export function useReports() {
  return useSyncExternalStore(reportsStore.subscribe, reportsStore.getSnapshot, reportsStore.getSnapshot);
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export const reportTypeMeta: Record<ReportType, { label: string; theme: string; }> = {
  battle:     { label: "Combate",    theme: "destructive" },
  espionage:  { label: "Espionagem", theme: "deuterium" },
  transport:  { label: "Transporte", theme: "crystal" },
  deploy:     { label: "Deploy",     theme: "amber" },
  harvest:    { label: "Reciclagem", theme: "energy" },
  expedition: { label: "Expedição",  theme: "metal" },
  colonize:   { label: "Colônia",    theme: "primary" },
};
