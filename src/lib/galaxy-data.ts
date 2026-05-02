export type PlayerStatus = "active" | "inactive" | "vacation" | "banned" | "noob" | "strong" | "self";

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

export const statusMeta: Record<PlayerStatus, { label: string; color: string; tone: string }> = {
  active: { label: "Ativo", color: "text-foreground", tone: "bg-foreground/60" },
  inactive: { label: "Inativo (i)", color: "text-muted-foreground italic", tone: "bg-muted-foreground/50" },
  vacation: { label: "Modo férias (v)", color: "text-crystal", tone: "bg-crystal/70" },
  banned: { label: "Banido (b)", color: "text-destructive line-through", tone: "bg-destructive/70" },
  noob: { label: "Iniciante (n)", color: "text-deuterium", tone: "bg-deuterium/70" },
  strong: { label: "Forte (s)", color: "text-warning font-semibold", tone: "bg-warning/70" },
  self: { label: "Você", color: "text-primary font-bold", tone: "bg-primary" },
};
