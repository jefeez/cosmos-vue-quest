import { Building2, Radar, Zap, Warehouse, Telescope, Sparkles, Wrench, Rocket, Shield } from "lucide-react";
import type { BuildItem, UnitItem } from "./game-data";

export const moonBuildings: BuildItem[] = [
  { id: "lunar-base", name: "Base Lunar", level: 4, description: "Cada nível adiciona campos exploráveis na lua.", icon: Building2, cost: { metal: 20_000, crystal: 40_000, deuterium: 20_000 }, buildTime: "3h 12m", production: "Campos: +3 / nível" },
  { id: "phalanx", name: "Sensor Phalanx", level: 2, description: "Detecta movimentações de frota em sistemas próximos.", icon: Radar, cost: { metal: 20_000, crystal: 40_000, deuterium: 20_000 }, buildTime: "2h 40m", production: "Alcance: 4 sistemas" },
  { id: "jump-gate", name: "Portal de Salto", level: 1, description: "Teletransporta frotas instantaneamente entre luas.", icon: Sparkles, cost: { metal: 2_000_000, crystal: 4_000_000, deuterium: 2_000_000 }, buildTime: "18h 20m", building: { progress: 41, remaining: "10:48:22" } },
  { id: "lunar-solar", name: "Usina Solar Lunar", level: 5, description: "Converte radiação estelar em energia para a lua.", icon: Zap, cost: { metal: 8_400, crystal: 2_800 }, buildTime: "0h 58m", production: "+820 GW" },
  { id: "lunar-storage", name: "Depósito Lunar", level: 3, description: "Estoque de recursos para operações lunares.", icon: Warehouse, cost: { metal: 4_200, crystal: 0 }, buildTime: "0h 18m", production: "Cap: 250k" },
  { id: "lunar-shipyard", name: "Estaleiro Lunar", level: 3, description: "Permite construir naves a partir da lua.", icon: Wrench, cost: { metal: 16_000, crystal: 8_000 }, buildTime: "1h 30m" },
];

export const moonShips: UnitItem[] = [
  { id: "m-light-fighter", name: "Caça Leve", count: 64, description: "Estacionado na lua.", icon: Rocket, cost: { metal: 3_000, crystal: 1_000 }, attack: 50, shield: 10, speed: 12500 },
  { id: "m-cruiser", name: "Cruzador", count: 18, description: "Patrulha lunar rápida.", icon: Rocket, cost: { metal: 20_000, crystal: 7_000, deuterium: 2_000 }, attack: 400, shield: 50, speed: 15000 },
];

export const moonDefenses: UnitItem[] = [
  { id: "m-rocket", name: "Lançador de Foguetes", count: 80, description: "Defesa lunar básica.", icon: Shield, cost: { metal: 2_000, crystal: 0 }, attack: 80, shield: 20 },
  { id: "m-laser", name: "Laser Pesado", count: 14, description: "Defesa lunar antifrota.", icon: Telescope, cost: { metal: 6_000, crystal: 2_000 }, attack: 250, shield: 100 },
];

export const moonStats = {
  usedFields: 8,
  totalFields: 19,
  tempMin: -180,
  tempMax: -40,
  diameter: 8420,
};
