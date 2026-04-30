import {
  Pickaxe, Gem, Droplet, Zap, Factory, FlaskConical, Rocket, Shield,
  Building2, Radar, Warehouse, Atom, Cpu, Telescope, Wrench, Battery,
  Plane, Crosshair, Satellite, Bomb, ShieldCheck, ShieldAlert,
} from "lucide-react";

export type ResourceKey = "metal" | "crystal" | "deuterium" | "energy";

export interface Resources {
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
}

export const initialResources: Resources = {
  metal: 245_800,
  crystal: 187_500,
  deuterium: 98_200,
  energy: 5_240,
};

export const productionPerHour: Resources = {
  metal: 4_820,
  crystal: 2_140,
  deuterium: 980,
  energy: 0,
};

export interface BuildItem {
  id: string;
  name: string;
  level: number;
  description: string;
  icon: typeof Pickaxe;
  cost: { metal: number; crystal: number; deuterium?: number };
  buildTime: string;
  production?: string;
  building?: { progress: number; remaining: string };
}

export const buildings: BuildItem[] = [
  { id: "metal-mine", name: "Mina de Metal", level: 14, description: "Extrai metal bruto da crosta planetária.", icon: Pickaxe, cost: { metal: 18_400, crystal: 4_600 }, buildTime: "2h 14m", production: "+4.820 /h" },
  { id: "crystal-mine", name: "Mina de Cristal", level: 11, description: "Refina cristais raros para componentes.", icon: Gem, cost: { metal: 12_800, crystal: 6_400 }, buildTime: "1h 48m", production: "+2.140 /h", building: { progress: 62, remaining: "00:42:18" } },
  { id: "deut-synth", name: "Sintetizador de Deutério", level: 9, description: "Captura deutério da atmosfera.", icon: Droplet, cost: { metal: 9_200, crystal: 3_600, deuterium: 0 }, buildTime: "1h 22m", production: "+980 /h" },
  { id: "solar-plant", name: "Usina Solar", level: 12, description: "Converte radiação estelar em energia.", icon: Zap, cost: { metal: 8_400, crystal: 2_800 }, buildTime: "0h 58m", production: "+1.840 GW" },
  { id: "fusion-reactor", name: "Reator de Fusão", level: 6, description: "Energia nuclear de alta densidade.", icon: Atom, cost: { metal: 24_000, crystal: 12_000, deuterium: 6_000 }, buildTime: "4h 10m", production: "+3.200 GW" },
  { id: "metal-storage", name: "Armazém de Metal", level: 8, description: "Aumenta a capacidade de estocagem.", icon: Warehouse, cost: { metal: 6_400, crystal: 0 }, buildTime: "0h 32m", production: "Cap: 500k" },
];

export const facilities: BuildItem[] = [
  { id: "robot-factory", name: "Fábrica de Robôs", level: 7, description: "Acelera construções planetárias.", icon: Factory, cost: { metal: 16_000, crystal: 8_000 }, buildTime: "1h 45m" },
  { id: "shipyard-fac", name: "Estaleiro", level: 6, description: "Permite construir naves e defesas.", icon: Wrench, cost: { metal: 24_000, crystal: 12_000 }, buildTime: "2h 30m" },
  { id: "research-lab", name: "Laboratório de Pesquisa", level: 5, description: "Desbloqueia novas tecnologias.", icon: FlaskConical, cost: { metal: 18_000, crystal: 18_000 }, buildTime: "2h 00m" },
  { id: "nanite", name: "Fábrica de Nanitos", level: 2, description: "Reduz drasticamente tempos de construção.", icon: Cpu, cost: { metal: 480_000, crystal: 240_000, deuterium: 80_000 }, buildTime: "8h 30m" },
  { id: "missile-silo", name: "Silo de Mísseis", level: 3, description: "Armazena mísseis interplanetários.", icon: Building2, cost: { metal: 14_000, crystal: 7_000, deuterium: 2_000 }, buildTime: "1h 10m" },
  { id: "terraformer", name: "Terraformador", level: 1, description: "Expande os campos do planeta.", icon: Radar, cost: { metal: 0, crystal: 50_000, deuterium: 100_000 }, buildTime: "12h 00m" },
];

export const research: BuildItem[] = [
  { id: "energy-tech", name: "Tecnologia de Energia", level: 8, description: "Aumenta eficiência energética.", icon: Battery, cost: { metal: 0, crystal: 12_800 }, buildTime: "1h 30m" },
  { id: "laser-tech", name: "Tecnologia de Laser", level: 9, description: "Melhora armas a laser.", icon: Crosshair, cost: { metal: 8_000, crystal: 4_000 }, buildTime: "1h 15m" },
  { id: "ion-tech", name: "Tecnologia Iônica", level: 5, description: "Habilita armas iônicas.", icon: Zap, cost: { metal: 12_000, crystal: 18_000 }, buildTime: "2h 45m" },
  { id: "hyperspace", name: "Tecnologia Hiperespacial", level: 6, description: "Reduz consumo de naves.", icon: Telescope, cost: { metal: 20_000, crystal: 40_000 }, buildTime: "3h 20m", building: { progress: 28, remaining: "02:24:55" } },
  { id: "combustion", name: "Motor de Combustão", level: 10, description: "Velocidade base das naves.", icon: Rocket, cost: { metal: 12_000, crystal: 0, deuterium: 4_000 }, buildTime: "1h 50m" },
  { id: "shielding", name: "Tecnologia de Escudos", level: 7, description: "Melhora escudos defensivos.", icon: ShieldCheck, cost: { metal: 0, crystal: 24_000 }, buildTime: "2h 10m" },
];

export interface UnitItem {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: typeof Rocket;
  cost: { metal: number; crystal: number; deuterium?: number };
  attack: number;
  shield: number;
  speed?: number;
}

export const ships: UnitItem[] = [
  { id: "light-fighter", name: "Caça Leve", count: 248, description: "Caça rápido e barato.", icon: Plane, cost: { metal: 3_000, crystal: 1_000 }, attack: 50, shield: 10, speed: 12500 },
  { id: "heavy-fighter", name: "Caça Pesado", count: 86, description: "Caça blindado de assalto.", icon: Plane, cost: { metal: 6_000, crystal: 4_000 }, attack: 150, shield: 25, speed: 10000 },
  { id: "cruiser", name: "Cruzador", count: 42, description: "Nave veloz contra caças.", icon: Rocket, cost: { metal: 20_000, crystal: 7_000, deuterium: 2_000 }, attack: 400, shield: 50, speed: 15000 },
  { id: "battleship", name: "Nave de Batalha", count: 18, description: "Espinha dorsal da frota.", icon: Rocket, cost: { metal: 45_000, crystal: 15_000 }, attack: 1000, shield: 200, speed: 10000 },
  { id: "bomber", name: "Bombardeiro", count: 6, description: "Especializada em defesas.", icon: Bomb, cost: { metal: 50_000, crystal: 25_000, deuterium: 15_000 }, attack: 1000, shield: 500, speed: 4000 },
  { id: "recycler", name: "Reciclador", count: 12, description: "Coleta destroços de batalhas.", icon: Satellite, cost: { metal: 10_000, crystal: 6_000, deuterium: 2_000 }, attack: 1, shield: 10, speed: 2000 },
];

export const defenses: UnitItem[] = [
  { id: "rocket-launcher", name: "Lançador de Foguetes", count: 320, description: "Defesa básica e barata.", icon: Crosshair, cost: { metal: 2_000, crystal: 0 }, attack: 80, shield: 20 },
  { id: "light-laser", name: "Laser Leve", count: 180, description: "Defesa antifoguetes.", icon: Zap, cost: { metal: 1_500, crystal: 500 }, attack: 100, shield: 25 },
  { id: "heavy-laser", name: "Laser Pesado", count: 60, description: "Defesa anticaça pesada.", icon: Crosshair, cost: { metal: 6_000, crystal: 2_000 }, attack: 250, shield: 100 },
  { id: "gauss", name: "Canhão Gauss", count: 24, description: "Alto dano em naves grandes.", icon: Bomb, cost: { metal: 20_000, crystal: 15_000, deuterium: 2_000 }, attack: 1100, shield: 200 },
  { id: "plasma", name: "Torre de Plasma", count: 8, description: "Devastadora contra cruzadores.", icon: Atom, cost: { metal: 50_000, crystal: 50_000, deuterium: 30_000 }, attack: 3000, shield: 300 },
  { id: "shield-dome", name: "Cúpula de Escudo", count: 1, description: "Reduz dano recebido.", icon: ShieldAlert, cost: { metal: 10_000, crystal: 10_000 }, attack: 1, shield: 2000 },
];
