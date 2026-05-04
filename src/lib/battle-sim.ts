// Lightweight deterministic combat simulator
export interface UnitStats {
  id: string;
  name: string;
  weapon: number;
  shield: number;
  hull: number; // structure / 10
  rapidFire?: Record<string, number>;
}

export const UNIT_DB: Record<string, UnitStats> = {
  "light-fighter":  { id: "light-fighter",  name: "Caça Leve",      weapon: 50,    shield: 10,   hull: 400 },
  "heavy-fighter":  { id: "heavy-fighter",  name: "Caça Pesado",    weapon: 150,   shield: 25,   hull: 1000 },
  "cruiser":        { id: "cruiser",        name: "Cruzador",       weapon: 400,   shield: 50,   hull: 2700, rapidFire: { "light-fighter": 6, "rocket-launcher": 10 } },
  "battleship":     { id: "battleship",     name: "Nave de Batalha",weapon: 1000,  shield: 200,  hull: 6000 },
  "bomber":         { id: "bomber",         name: "Bombardeiro",    weapon: 1000,  shield: 500,  hull: 7500, rapidFire: { "rocket-launcher": 20, "light-laser": 20, "heavy-laser": 10 } },
  "destroyer":      { id: "destroyer",      name: "Destruidor",     weapon: 2000,  shield: 500,  hull: 11000 },
  "deathstar":      { id: "deathstar",      name: "Estrela da Morte", weapon: 200000, shield: 50000, hull: 900000 },
  // defense
  "rocket-launcher":{ id: "rocket-launcher",name: "Lança-Mísseis",  weapon: 80,    shield: 20,   hull: 200 },
  "light-laser":    { id: "light-laser",    name: "Laser Leve",     weapon: 100,   shield: 25,   hull: 200 },
  "heavy-laser":    { id: "heavy-laser",    name: "Laser Pesado",   weapon: 250,   shield: 100,  hull: 800 },
  "gauss":          { id: "gauss",          name: "Canhão Gauss",   weapon: 1100,  shield: 200,  hull: 3500 },
  "plasma":         { id: "plasma",         name: "Canhão Plasma",  weapon: 3000,  shield: 300,  hull: 10000 },
};

export interface Combatant {
  unitId: string;
  count: number;
  // runtime
  hpPool?: number; // total hp left
}

export interface SimSide {
  name: string;
  units: Combatant[];
}

export interface RoundSnapshot {
  round: number;
  attackerShots: number;
  defenderShots: number;
  attackerDamage: number;
  defenderDamage: number;
  attackerRemaining: Combatant[];
  defenderRemaining: Combatant[];
  attackerHpPct: number;
  defenderHpPct: number;
}

export interface SimResult {
  winner: "attacker" | "defender" | "draw";
  rounds: RoundSnapshot[];
  attackerLossesValue: number;
  defenderLossesValue: number;
  debris: { metal: number; crystal: number };
}

const totalHp = (side: SimSide) =>
  side.units.reduce((s, u) => {
    const stats = UNIT_DB[u.unitId];
    if (!stats) return s;
    return s + u.count * (stats.hull + stats.shield);
  }, 0);

const totalDamage = (side: SimSide) =>
  side.units.reduce((s, u) => s + u.count * (UNIT_DB[u.unitId]?.weapon ?? 0), 0);

const totalShots = (side: SimSide) =>
  side.units.reduce((s, u) => s + u.count, 0);

function applyDamage(side: SimSide, damage: number): { remaining: Combatant[]; lossesValue: number } {
  let remaining = side.units.map((u) => ({ ...u }));
  let dmg = damage;
  let lossesValue = 0;
  // distribute proportionally to count, kill weakest first
  const order = [...remaining].sort((a, b) => (UNIT_DB[a.unitId]?.hull ?? 0) - (UNIT_DB[b.unitId]?.hull ?? 0));
  for (const u of order) {
    if (dmg <= 0) break;
    const stats = UNIT_DB[u.unitId];
    if (!stats) continue;
    const hpEach = stats.hull + stats.shield;
    const killable = Math.min(u.count, Math.floor(dmg / hpEach));
    if (killable > 0) {
      u.count -= killable;
      dmg -= killable * hpEach;
      lossesValue += killable * (stats.hull * 4); // arbitrary value scoring
    }
  }
  remaining = remaining.filter((u) => u.count > 0);
  return { remaining, lossesValue };
}

export function simulate(attacker: SimSide, defender: SimSide, maxRounds = 6): SimResult {
  const rounds: RoundSnapshot[] = [];
  let att = { ...attacker, units: attacker.units.map((u) => ({ ...u })) };
  let def = { ...defender, units: defender.units.map((u) => ({ ...u })) };
  const startAttHp = totalHp(att) || 1;
  const startDefHp = totalHp(def) || 1;
  let attLost = 0, defLost = 0;
  let r = 1;
  while (r <= maxRounds && att.units.length > 0 && def.units.length > 0) {
    const attShots = totalShots(att);
    const defShots = totalShots(def);
    const attDmg = totalDamage(att);
    const defDmg = totalDamage(def);
    const a = applyDamage(att, defDmg);
    const d = applyDamage(def, attDmg);
    att = { ...att, units: a.remaining };
    def = { ...def, units: d.remaining };
    attLost += a.lossesValue;
    defLost += d.lossesValue;
    rounds.push({
      round: r,
      attackerShots: attShots,
      defenderShots: defShots,
      attackerDamage: attDmg,
      defenderDamage: defDmg,
      attackerRemaining: att.units.map((u) => ({ ...u })),
      defenderRemaining: def.units.map((u) => ({ ...u })),
      attackerHpPct: Math.max(0, Math.round((totalHp(att) / startAttHp) * 100)),
      defenderHpPct: Math.max(0, Math.round((totalHp(def) / startDefHp) * 100)),
    });
    r++;
  }
  const attEnd = totalHp(att);
  const defEnd = totalHp(def);
  const winner: SimResult["winner"] =
    attEnd > defEnd && def.units.length === 0 ? "attacker" :
    defEnd > attEnd && att.units.length === 0 ? "defender" :
    att.units.length === 0 && def.units.length === 0 ? "draw" :
    attEnd > defEnd ? "attacker" : "defender";

  return {
    winner,
    rounds,
    attackerLossesValue: attLost,
    defenderLossesValue: defLost,
    debris: {
      metal: Math.round((attLost + defLost) * 0.3),
      crystal: Math.round((attLost + defLost) * 0.15),
    },
  };
}
