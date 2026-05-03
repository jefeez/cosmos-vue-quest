export type PlayerStatus = "active" | "inactive" | "vacation" | "banned" | "noob" | "strong" | "self";

export type PlanetType = "rocky" | "lava" | "ocean" | "ice" | "gas" | "desert" | "toxic" | "barren";

export interface DebrisField {
  metal: number;
  crystal: number;
}

export interface PlanetSlot {
  pos: number;
  player?: string;
  alliance?: string;
  planet?: string;
  rank?: number;
  status?: PlayerStatus;
  moon?: { name: string; size: number };
  debris?: DebrisField;
  activity?: number; // minutes since last activity, 0 = online (*), 15 = (15)
  type?: PlanetType;
  size?: number; // 8..18 visual radius
  hue?: number; // 0..360 secondary
}

// Deterministic pseudo-random
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const playerNames = [
  "Vortex", "Kazon", "Drax", "Nyx", "Volk", "Cipher", "Halcyon", "Ragnar",
  "Sylas", "Theron", "Orion", "Kairos", "Mira", "Zephyr", "Kael", "Lyra",
  "Atlas", "Praetor", "Onyx", "Vega", "Talon", "Hex", "Jinx", "Riven",
];
const alliances = ["VOID", "IRON", "NOVA", "AXIS", "—", "—", "RUST", "PYRE"];
const planetSuffixes = ["Prime", "IX", "Beta", "Forja", "Cinder", "Vesper", "Atrium", "Helios", "Nebulon", "Vortex", "Pyra", "Dust"];

const SELF = { player: "Krix (você)", alliance: "RUST", rank: 247 };

const TYPES: PlanetType[] = ["rocky", "lava", "ocean", "ice", "gas", "desert", "toxic", "barren"];

function typeForPos(pos: number, r: number): PlanetType {
  // inner = hot, outer = cold/gas
  if (pos <= 2) return r < 0.6 ? "lava" : "desert";
  if (pos <= 4) return r < 0.5 ? "rocky" : "desert";
  if (pos <= 8) return r < 0.4 ? "ocean" : r < 0.7 ? "rocky" : "toxic";
  if (pos <= 11) return r < 0.6 ? "barren" : "ice";
  return r < 0.7 ? "gas" : "ice";
}

export function generateSystem(galaxy: number, system: number): PlanetSlot[] {
  const rand = seededRand(galaxy * 1000 + system);
  const slots: PlanetSlot[] = [];

  // Self planet only on home system
  const selfPos = galaxy === 1 && system === 147 ? 8 : -1;

  for (let i = 1; i <= 15; i++) {
    if (i === selfPos) {
      slots.push({
        pos: i,
        ...SELF,
        planet: "Forja",
        status: "self",
        moon: { name: "Selene", size: 8420 },
        activity: 0,
        type: "ocean",
        size: 16,
        hue: 200,
      });
      continue;
    }

    const r = rand();
    if (r < 0.55) {
      slots.push({ pos: i });
      continue;
    }

    const playerName = playerNames[Math.floor(rand() * playerNames.length)];
    const alliance = alliances[Math.floor(rand() * alliances.length)];
    const suffix = planetSuffixes[Math.floor(rand() * planetSuffixes.length)];
    const rank = Math.floor(rand() * 4000) + 30;

    let status: PlayerStatus = "active";
    const sr = rand();
    if (sr < 0.15) status = "inactive";
    else if (sr < 0.22) status = "vacation";
    else if (sr < 0.27) status = "banned";
    else if (sr < 0.4) status = "noob";
    else if (sr < 0.5) status = "strong";

    const slot: PlanetSlot = {
      pos: i,
      player: playerName,
      alliance: alliance === "—" ? undefined : alliance,
      planet: `${playerName} ${suffix}`,
      rank,
      status,
      activity: rand() < 0.3 ? 0 : Math.floor(rand() * 60),
      type: typeForPos(i, rand()),
      size: 9 + Math.floor(rand() * 9),
      hue: Math.floor(rand() * 360),
    };

    if (rand() < 0.3) {
      slot.moon = {
        name: `Lua-${i}`,
        size: 4000 + Math.floor(rand() * 6000),
      };
    }

    if (rand() < 0.25) {
      slot.debris = {
        metal: Math.floor(rand() * 80000) + 2000,
        crystal: Math.floor(rand() * 40000) + 1000,
      };
    }

    slots.push(slot);
  }

  return slots;
}

export const planetTypeMeta: Record<PlanetType, { label: string; gradient: string; ring: string; glow: string }> = {
  rocky:  { label: "Rochoso",  gradient: "radial-gradient(circle at 30% 30%, oklch(0.78 0.05 60), oklch(0.42 0.04 50) 60%, oklch(0.22 0.02 40))", ring: "oklch(0.55 0.05 60)", glow: "oklch(0.7 0.06 60 / 0.5)" },
  lava:   { label: "Vulcânico", gradient: "radial-gradient(circle at 30% 30%, oklch(0.85 0.2 40), oklch(0.5 0.22 25) 55%, oklch(0.22 0.1 20))", ring: "oklch(0.65 0.2 30)", glow: "oklch(0.75 0.22 30 / 0.7)" },
  ocean:  { label: "Oceânico",  gradient: "radial-gradient(circle at 30% 30%, oklch(0.85 0.12 220), oklch(0.5 0.15 225) 55%, oklch(0.22 0.08 230))", ring: "oklch(0.6 0.15 220)", glow: "oklch(0.75 0.15 220 / 0.7)" },
  ice:    { label: "Gelado",    gradient: "radial-gradient(circle at 30% 30%, oklch(0.95 0.04 220), oklch(0.7 0.06 220) 55%, oklch(0.4 0.04 230))", ring: "oklch(0.8 0.06 220)", glow: "oklch(0.9 0.06 220 / 0.6)" },
  gas:    { label: "Gasoso",    gradient: "radial-gradient(circle at 30% 30%, oklch(0.85 0.12 80), oklch(0.55 0.14 50) 55%, oklch(0.3 0.1 40))", ring: "oklch(0.7 0.14 60)", glow: "oklch(0.8 0.14 60 / 0.6)" },
  desert: { label: "Desértico", gradient: "radial-gradient(circle at 30% 30%, oklch(0.88 0.12 80), oklch(0.6 0.14 70) 55%, oklch(0.32 0.08 60))", ring: "oklch(0.7 0.14 75)", glow: "oklch(0.82 0.14 75 / 0.6)" },
  toxic:  { label: "Tóxico",    gradient: "radial-gradient(circle at 30% 30%, oklch(0.85 0.18 140), oklch(0.5 0.2 145) 55%, oklch(0.25 0.12 150))", ring: "oklch(0.65 0.2 145)", glow: "oklch(0.75 0.2 145 / 0.6)" },
  barren: { label: "Estéril",   gradient: "radial-gradient(circle at 30% 30%, oklch(0.7 0.02 60), oklch(0.4 0.015 60) 55%, oklch(0.2 0.01 60))", ring: "oklch(0.5 0.02 60)", glow: "oklch(0.6 0.02 60 / 0.4)" },
};

export const statusMeta: Record<PlayerStatus, { label: string; color: string; tone: string }> = {
  active: { label: "Ativo", color: "text-foreground", tone: "bg-foreground/60" },
  inactive: { label: "Inativo (i)", color: "text-muted-foreground italic", tone: "bg-muted-foreground/50" },
  vacation: { label: "Modo férias (v)", color: "text-crystal", tone: "bg-crystal/70" },
  banned: { label: "Banido (b)", color: "text-destructive line-through", tone: "bg-destructive/70" },
  noob: { label: "Iniciante (n)", color: "text-deuterium", tone: "bg-deuterium/70" },
  strong: { label: "Forte (s)", color: "text-warning font-semibold", tone: "bg-warning/70" },
  self: { label: "Você", color: "text-primary font-bold", tone: "bg-primary" },
};
